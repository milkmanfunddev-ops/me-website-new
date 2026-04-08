#!/usr/bin/env npx tsx
/**
 * migrate-content.ts
 * ------------------
 * Migrates Jekyll blog posts, changelog entries, and legal documents from the
 * Mealvana Endurance landing page repo into Sanity CMS.
 *
 * Usage:
 *   SANITY_PROJECT_ID=xxx SANITY_TOKEN=yyy npx tsx scripts/migrate-content.ts
 *
 * Environment variables:
 *   SANITY_PROJECT_ID  - Sanity project ID (required)
 *   SANITY_DATASET     - Sanity dataset (default: "production")
 *   SANITY_TOKEN       - Sanity write token (required)
 *   DRY_RUN            - Set to "true" to preview without writing (optional)
 *   JEKYLL_ROOT        - Path to Jekyll site (default: sibling dir)
 */

import { createClient, type SanityClient } from "@sanity/client";
import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.SANITY_DATASET || "production";
const SANITY_TOKEN = process.env.SANITY_TOKEN;
const DRY_RUN = process.env.DRY_RUN === "true";
const JEKYLL_ROOT =
  process.env.JEKYLL_ROOT ||
  path.resolve(__dirname, "../../mealvana_endurance_landing_page");

if (!SANITY_PROJECT_ID) {
  console.error("Error: SANITY_PROJECT_ID is required");
  process.exit(1);
}
if (!SANITY_TOKEN && !DRY_RUN) {
  console.error("Error: SANITY_TOKEN is required (or set DRY_RUN=true)");
  process.exit(1);
}

const client: SanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// ---------------------------------------------------------------------------
// Helpers: deterministic IDs
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function deterministicId(prefix: string, key: string): string {
  const hash = crypto.createHash("sha256").update(key).digest("hex").slice(0, 12);
  return `${prefix}-${hash}`;
}

// ---------------------------------------------------------------------------
// YAML front matter parser (minimal, no external deps)
// ---------------------------------------------------------------------------

interface FrontMatter {
  title?: string;
  date?: string;
  author?: string;
  categories?: string[];
  tags?: string[];
  excerpt?: string;
  read_time?: number;
  image?: string;
  layout?: string;
  permalink?: string;
  include_in_header?: boolean;
}

function parseFrontMatter(raw: string): { data: FrontMatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  const yamlBlock = match[1];
  const body = match[2];
  const data: Record<string, unknown> = {};

  for (const line of yamlBlock.split("\n")) {
    const kv = line.match(/^(\w[\w_]*):\s*(.+)$/);
    if (!kv) continue;
    const [, key, rawVal] = kv;
    let val: unknown = rawVal.trim();

    // Strip surrounding quotes
    if (
      (typeof val === "string" && val.startsWith('"') && val.endsWith('"')) ||
      (typeof val === "string" && val.startsWith("'") && val.endsWith("'"))
    ) {
      val = (val as string).slice(1, -1);
    }

    // Array like [a, b, c]
    if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
      val = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""));
    }

    // Number
    if (typeof val === "string" && /^\d+$/.test(val)) {
      val = parseInt(val, 10);
    }

    // Boolean
    if (val === "true") val = true;
    if (val === "false") val = false;

    data[key] = val;
  }

  return { data: data as FrontMatter, body };
}

// ---------------------------------------------------------------------------
// Markdown -> Sanity Portable Text converter
// ---------------------------------------------------------------------------

type PortableTextBlock = Record<string, unknown>;

function generateKey(): string {
  return crypto.randomBytes(6).toString("hex");
}

/**
 * Convert a single line of inline markdown to an array of Portable Text spans.
 * Handles: **bold**, *italic*, `code`, [links](url), and plain text.
 */
function parseInlineMarkdown(
  text: string
): { spans: Array<Record<string, unknown>>; markDefs: Array<Record<string, unknown>> } {
  const spans: Array<Record<string, unknown>> = [];
  const markDefs: Array<Record<string, unknown>> = [];

  // Regex to match inline elements in order
  const inlineRegex =
    /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|\[([^\]]+)\]\(([^)]+)\)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineRegex.exec(text)) !== null) {
    // Plain text before this match
    if (match.index > lastIndex) {
      const plain = text.slice(lastIndex, match.index);
      if (plain) {
        spans.push({ _type: "span", _key: generateKey(), text: plain, marks: [] });
      }
    }

    if (match[1]) {
      // **bold**
      spans.push({
        _type: "span",
        _key: generateKey(),
        text: match[2],
        marks: ["strong"],
      });
    } else if (match[3]) {
      // *italic*
      spans.push({
        _type: "span",
        _key: generateKey(),
        text: match[4],
        marks: ["em"],
      });
    } else if (match[5]) {
      // `code`
      spans.push({
        _type: "span",
        _key: generateKey(),
        text: match[6],
        marks: ["code"],
      });
    } else if (match[7]) {
      // [text](url)
      const linkKey = generateKey();
      markDefs.push({
        _type: "link",
        _key: linkKey,
        href: match[8],
        blank: match[8].startsWith("http"),
      });
      spans.push({
        _type: "span",
        _key: generateKey(),
        text: match[7],
        marks: [linkKey],
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining plain text
  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex);
    if (remaining) {
      spans.push({ _type: "span", _key: generateKey(), text: remaining, marks: [] });
    }
  }

  // If no spans were created, add the full text as a plain span
  if (spans.length === 0) {
    spans.push({ _type: "span", _key: generateKey(), text, marks: [] });
  }

  return { spans, markDefs };
}

/**
 * Create a single Portable Text block (paragraph, heading, blockquote, list item).
 */
function makeBlock(
  text: string,
  style: string = "normal",
  listItem?: string,
  level?: number
): PortableTextBlock {
  const { spans, markDefs } = parseInlineMarkdown(text);
  const block: PortableTextBlock = {
    _type: "block",
    _key: generateKey(),
    style,
    markDefs,
    children: spans,
  };
  if (listItem) {
    block.listItem = listItem;
    block.level = level || 1;
  }
  return block;
}

/**
 * Parse a markdown table string into a tableBlock object for Sanity.
 * Returns null if the text is not a valid table.
 */
function parseMarkdownTable(lines: string[]): PortableTextBlock | null {
  // A table needs at least a header row and a separator row
  if (lines.length < 2) return null;

  // Check that lines look like table rows
  const isTableRow = (line: string) => line.trim().startsWith("|") && line.trim().endsWith("|");
  const isSeparator = (line: string) => /^\|[\s\-:|]+\|$/.test(line.trim());

  if (!isTableRow(lines[0]) || !isSeparator(lines[1])) return null;

  const parseRow = (line: string): string[] =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());

  const headerCells = parseRow(lines[0]);
  const dataRows = lines.slice(2).filter(isTableRow).map(parseRow);

  // Build @sanity/table format: { rows: [ { _type: "tableRow", _key, cells: [...] } ] }
  const rows: Array<Record<string, unknown>> = [];

  rows.push({
    _type: "tableRow",
    _key: generateKey(),
    cells: headerCells,
  });

  for (const cells of dataRows) {
    rows.push({
      _type: "tableRow",
      _key: generateKey(),
      cells,
    });
  }

  return {
    _type: "tableBlock",
    _key: generateKey(),
    rows: { rows },
    hasHeaderRow: true,
  };
}

/**
 * Parse fenced code blocks from markdown.
 */
function parseFencedCodeBlock(
  lines: string[],
  startIndex: number
): { block: PortableTextBlock; endIndex: number } | null {
  const openMatch = lines[startIndex].match(/^```(\w*)$/);
  if (!openMatch) return null;

  const language = openMatch[1] || "text";
  const codeLines: string[] = [];
  let i = startIndex + 1;
  while (i < lines.length && !lines[i].startsWith("```")) {
    codeLines.push(lines[i]);
    i++;
  }

  return {
    block: {
      _type: "codeBlock",
      _key: generateKey(),
      code: {
        _type: "code",
        language,
        code: codeLines.join("\n"),
      },
    },
    endIndex: i, // points to closing ```
  };
}

/**
 * Detect and convert LaTeX math blocks ($$...$$) to mathBlock.
 */
function parseMathBlock(line: string): PortableTextBlock | null {
  const match = line.match(/^\$\$(.*)\$\$$/);
  if (!match) return null;
  return {
    _type: "mathBlock",
    _key: generateKey(),
    expression: match[1].trim(),
    displayMode: true,
  };
}

/**
 * Strip common HTML elements from Jekyll posts:
 * - <aside> callout blocks -> calloutBlock
 * - <div> CTA blocks -> buttonBlock
 * - <blockquote class="instagram-media" ...> -> stripped
 * - <img> tags -> image reference (textual note)
 * - Inline <a> tags within otherwise-markdown text
 * Returns null if not an HTML block, or the converted block(s).
 */
function parseHtmlBlock(
  lines: string[],
  startIndex: number
): { blocks: PortableTextBlock[]; endIndex: number } | null {
  const line = lines[startIndex];

  // Skip Instagram embeds (they span many lines)
  if (line.includes("instagram-media")) {
    let i = startIndex + 1;
    while (i < lines.length && !lines[i].includes("</blockquote>")) {
      i++;
    }
    return { blocks: [], endIndex: i };
  }

  // <aside> -> calloutBlock
  if (line.trim().startsWith("<aside")) {
    let i = startIndex;
    const asideLines: string[] = [];
    while (i < lines.length && !lines[i].includes("</aside>")) {
      asideLines.push(lines[i]);
      i++;
    }
    // Extract text content from the aside
    const textContent = asideLines
      .join(" ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (textContent) {
      const block: PortableTextBlock = {
        _type: "calloutBlock",
        _key: generateKey(),
        type: "tip",
        body: [makeBlock(textContent)],
      };
      return { blocks: [block], endIndex: i };
    }
    return { blocks: [], endIndex: i };
  }

  // <div> CTA blocks -> buttonBlock
  if (line.trim().startsWith("<div") && line.includes("linear-gradient")) {
    let i = startIndex;
    const divLines: string[] = [];
    while (i < lines.length && !lines[i].includes("</div>")) {
      divLines.push(lines[i]);
      i++;
    }
    // Extract the <a> href and heading
    const fullHtml = divLines.join(" ");
    const hrefMatch = fullHtml.match(/<a\s+href="([^"]+)"/);
    const headingMatch = fullHtml.match(/<h3[^>]*>(.*?)<\/h3>/);
    const paragraphMatch = fullHtml.match(/<p[^>]*>(.*?)<\/p>/);

    const blocks: PortableTextBlock[] = [];
    if (headingMatch) {
      const heading = headingMatch[1].replace(/<[^>]+>/g, "").trim();
      blocks.push(makeBlock(heading, "h3"));
    }
    if (paragraphMatch) {
      const para = paragraphMatch[1].replace(/<[^>]+>/g, "").trim();
      blocks.push(makeBlock(para));
    }
    if (hrefMatch) {
      blocks.push({
        _type: "buttonBlock",
        _key: generateKey(),
        label: "Get Your Free Plan",
        href: "https://endurance.mealvana.io",
        variant: "primary",
      });
    }

    return { blocks, endIndex: i };
  }

  // Standalone <img> tags
  if (line.trim().startsWith("<img")) {
    const altMatch = line.match(/alt="([^"]*)"/);
    const srcMatch = line.match(/src="([^"]*)"/);
    // We cannot upload the image binary in this script, so we note it as a
    // placeholder paragraph. The image can be uploaded manually later.
    if (srcMatch) {
      return {
        blocks: [
          makeBlock(
            `[Image: ${altMatch?.[1] || "Blog image"} — source: ${srcMatch[1]}]`
          ),
        ],
        endIndex: startIndex,
      };
    }
    return { blocks: [], endIndex: startIndex };
  }

  return null;
}

/**
 * Strip remaining inline HTML tags to extract text, converting <a> to markdown links.
 */
function stripInlineHtml(text: string): string {
  // Convert <a href="...">text</a> to [text](href)
  text = text.replace(
    /<a\s+[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi,
    (_, href, linkText) => `[${linkText}](${href})`
  );
  // Convert <strong> to **
  text = text.replace(/<strong>(.*?)<\/strong>/gi, "**$1**");
  // Convert <em> to *
  text = text.replace(/<em>(.*?)<\/em>/gi, "*$1*");
  // Strip any remaining HTML tags
  text = text.replace(/<[^>]+>/g, "");
  return text;
}

/**
 * Main markdown-to-Portable-Text converter.
 */
function markdownToPortableText(markdown: string): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = [];
  const lines = markdown.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // Skip standalone HTML script tags (e.g., Instagram embed script)
    if (trimmed.startsWith("<script") || trimmed.startsWith("</script")) {
      i++;
      continue;
    }

    // Skip SVG blocks
    if (trimmed.startsWith("<svg") || trimmed.startsWith("</svg")) {
      i++;
      continue;
    }

    // HTML blocks
    if (trimmed.startsWith("<")) {
      const htmlResult = parseHtmlBlock(lines, i);
      if (htmlResult) {
        blocks.push(...htmlResult.blocks);
        i = htmlResult.endIndex + 1;
        continue;
      }
    }

    // Fenced code blocks
    if (trimmed.startsWith("```")) {
      const codeResult = parseFencedCodeBlock(lines, i);
      if (codeResult) {
        blocks.push(codeResult.block);
        i = codeResult.endIndex + 1;
        continue;
      }
    }

    // Math blocks ($$...$$)
    const mathBlock = parseMathBlock(trimmed);
    if (mathBlock) {
      blocks.push(mathBlock);
      i++;
      continue;
    }

    // Horizontal rules
    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      blocks.push({
        _type: "dividerBlock",
        _key: generateKey(),
        style: "line",
      });
      i++;
      continue;
    }

    // Tables: collect consecutive table-like lines
    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const tableBlock = parseMarkdownTable(tableLines);
      if (tableBlock) {
        blocks.push(tableBlock);
      }
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      // Strip trailing ** wrappers from headings
      let headingText = headingMatch[2]
        .replace(/^\*\*/, "")
        .replace(/\*\*$/, "")
        .trim();
      headingText = stripInlineHtml(headingText);
      blocks.push(makeBlock(headingText, `h${level}`));
      i++;
      continue;
    }

    // Blockquotes
    if (trimmed.startsWith(">")) {
      const quoteText = stripInlineHtml(trimmed.replace(/^>\s*/, ""));
      blocks.push(makeBlock(quoteText, "blockquote"));
      i++;
      continue;
    }

    // Unordered list items
    if (/^[-*]\s+/.test(trimmed)) {
      const itemText = stripInlineHtml(trimmed.replace(/^[-*]\s+/, ""));
      blocks.push(makeBlock(itemText, "normal", "bullet", 1));
      i++;
      continue;
    }

    // Ordered list items
    if (/^\d+\.\s+/.test(trimmed)) {
      const itemText = stripInlineHtml(trimmed.replace(/^\d+\.\s+/, ""));
      blocks.push(makeBlock(itemText, "normal", "number", 1));
      i++;
      continue;
    }

    // Indented sub-list items (4 spaces or tab + dash)
    if (/^\s{2,}[-*]\s+/.test(line)) {
      const itemText = stripInlineHtml(line.trim().replace(/^[-*]\s+/, ""));
      blocks.push(makeBlock(itemText, "normal", "bullet", 2));
      i++;
      continue;
    }

    // Regular paragraph — strip inline HTML
    const cleaned = stripInlineHtml(trimmed);
    if (cleaned) {
      blocks.push(makeBlock(cleaned));
    }
    i++;
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// Document builders
// ---------------------------------------------------------------------------

function buildAuthorDoc(name: string): Record<string, unknown> {
  const id = deterministicId("author", name);
  return {
    _id: id,
    _type: "author",
    name,
    slug: { _type: "slug", current: slugify(name) },
    role: "Content Team",
  };
}

function buildCategoryDoc(title: string): Record<string, unknown> {
  const id = deterministicId("category", title);
  return {
    _id: id,
    _type: "blogCategory",
    title: title.charAt(0).toUpperCase() + title.slice(1),
    slug: { _type: "slug", current: slugify(title) },
    description: `Articles about ${title}.`,
  };
}

function buildBlogPostDoc(
  frontMatter: FrontMatter,
  body: PortableTextBlock[],
  fileName: string,
  authorId: string,
  categoryIds: string[]
): Record<string, unknown> {
  // Derive slug from filename: 2025-11-12-master-marathon-fueling-complete-guide.md
  const slugFromFile = fileName
    .replace(/\.md$/, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "");

  const postId = deterministicId("post", slugFromFile);

  return {
    _id: postId,
    _type: "blogPost",
    title: frontMatter.title || slugFromFile,
    slug: { _type: "slug", current: slugFromFile },
    excerpt: frontMatter.excerpt?.slice(0, 200) || "",
    readTime: frontMatter.read_time || 5,
    publishedAt: frontMatter.date
      ? new Date(frontMatter.date).toISOString()
      : new Date().toISOString(),
    categories: categoryIds.map((id) => ({
      _type: "reference",
      _ref: id,
      _key: generateKey(),
    })),
    tags: frontMatter.tags || [],
    body,
    status: "published",
    author: {
      _type: "reference",
      _ref: authorId,
    },
  };
}

// ---------------------------------------------------------------------------
// Changelog migration
// ---------------------------------------------------------------------------

interface ChangelogEntry {
  version: string;
  title?: string;
  label?: string;
  whatsNew: string[];
  improvements: string[];
  bugFixes: string[];
}

function parseChangelog(markdown: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  const lines = markdown.split("\n");
  let i = 0;

  let current: ChangelogEntry | null = null;
  let currentSection: "whatsNew" | "improvements" | "bugFixes" | null = null;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Version heading: # **Version X.Y.Z**
    const versionMatch = line.match(/^#\s+\*\*Version\s+([\d.]+)\*\*/);
    if (versionMatch) {
      if (current) entries.push(current);
      current = {
        version: versionMatch[1],
        whatsNew: [],
        improvements: [],
        bugFixes: [],
      };
      currentSection = null;
      i++;
      continue;
    }

    // Label line: ### `Label`
    const labelMatch = line.match(/^###\s+`(.+?)`/);
    if (labelMatch && current) {
      current.label = labelMatch[1];
      i++;
      continue;
    }

    // Title line (text right after version, not a heading)
    if (current && !current.title && line && !line.startsWith("#") && !line.startsWith("-") && !line.startsWith("*") && !line.startsWith("_") && line !== "<br>") {
      current.title = line;
      i++;
      continue;
    }

    // Section headings
    if (/^####\s+What'?s\s+New/i.test(line) || /^####\s+Features/i.test(line)) {
      currentSection = "whatsNew";
      i++;
      continue;
    }
    if (/^####\s+Improvements/i.test(line)) {
      currentSection = "improvements";
      i++;
      continue;
    }
    if (/^####\s+Bug\s+Fixes/i.test(line)) {
      currentSection = "bugFixes";
      i++;
      continue;
    }

    // List items
    if (current && currentSection && /^-\s+/.test(line)) {
      const item = line.replace(/^-\s+/, "").replace(/\*\*/g, "").trim();
      current[currentSection].push(item);
    }

    i++;
  }

  if (current) entries.push(current);
  return entries;
}

function buildChangelogDoc(entry: ChangelogEntry): Record<string, unknown> {
  const id = deterministicId("changelog", entry.version);

  const toBulletBlocks = (items: string[]): PortableTextBlock[] =>
    items.map((text) => makeBlock(text, "normal", "bullet", 1));

  // Map label strings to schema values
  let label: string | undefined;
  if (entry.label === "Latest") label = "Latest";
  else if (entry.label === "Nutrition Overhaul" || entry.label === "Personalization Update" || entry.label === "Brick Workouts")
    label = "Major Update";
  else if (entry.label === "Initial Release") label = "New Feature";
  else label = entry.label;

  return {
    _id: id,
    _type: "changelog",
    version: entry.version,
    title: entry.title || entry.label || undefined,
    label,
    whatsNew: entry.whatsNew.length > 0 ? toBulletBlocks(entry.whatsNew) : undefined,
    improvements:
      entry.improvements.length > 0
        ? toBulletBlocks(entry.improvements)
        : undefined,
    bugFixes:
      entry.bugFixes.length > 0 ? toBulletBlocks(entry.bugFixes) : undefined,
  };
}

// ---------------------------------------------------------------------------
// Legal document migration
// ---------------------------------------------------------------------------

function buildLegalDoc(
  title: string,
  slug: string,
  lastUpdated: string,
  body: PortableTextBlock[]
): Record<string, unknown> {
  const id = deterministicId("legal", slug);
  return {
    _id: id,
    _type: "legalDoc",
    title,
    slug: { _type: "slug", current: slug },
    lastUpdated,
    body,
  };
}

// ---------------------------------------------------------------------------
// Sanity transaction runner
// ---------------------------------------------------------------------------

async function upsertDocuments(
  docs: Record<string, unknown>[],
  label: string
): Promise<void> {
  if (docs.length === 0) {
    console.log(`  [${label}] No documents to migrate.`);
    return;
  }

  if (DRY_RUN) {
    console.log(`  [${label}] DRY RUN — would create/update ${docs.length} document(s):`);
    for (const doc of docs) {
      console.log(`    - ${doc._type}: ${(doc as Record<string, unknown>).title || (doc as Record<string, unknown>).name || (doc as Record<string, unknown>).version || doc._id}`);
    }
    return;
  }

  let transaction = client.transaction();
  for (const doc of docs) {
    transaction = transaction.createOrReplace(doc);
  }
  const result = await transaction.commit();
  console.log(
    `  [${label}] Committed ${docs.length} document(s). Transaction ID: ${result.transactionId}`
  );
}

// ---------------------------------------------------------------------------
// Main migration pipeline
// ---------------------------------------------------------------------------

async function migrateBlogPosts(): Promise<void> {
  console.log("\n=== Migrating Blog Posts ===\n");

  const postsDir = path.join(JEKYLL_ROOT, "_posts");
  if (!fs.existsSync(postsDir)) {
    console.error(`Posts directory not found: ${postsDir}`);
    return;
  }

  const files = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  console.log(`Found ${files.length} post(s) in ${postsDir}`);

  // Collect all unique authors and categories first
  const authorSet = new Set<string>();
  const categorySet = new Set<string>();
  const parsed: Array<{
    fileName: string;
    data: FrontMatter;
    body: string;
  }> = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { data, body } = parseFrontMatter(raw);
    parsed.push({ fileName: file, data, body });

    if (data.author) authorSet.add(data.author);
    if (data.categories) {
      for (const cat of data.categories) categorySet.add(cat);
    }
  }

  // Build and upsert authors
  const authorDocs = [...authorSet].map(buildAuthorDoc);
  await upsertDocuments(authorDocs, "Authors");

  // Build and upsert categories
  const categoryDocs = [...categorySet].map(buildCategoryDoc);
  await upsertDocuments(categoryDocs, "Categories");

  // Build and upsert posts
  const postDocs: Record<string, unknown>[] = [];
  for (const { fileName, data, body: rawBody } of parsed) {
    console.log(`  Processing: ${fileName}`);
    const portableText = markdownToPortableText(rawBody);
    const authorId = data.author
      ? deterministicId("author", data.author)
      : deterministicId("author", "Mealvana Team");
    const categoryIds = (data.categories || []).map((cat) =>
      deterministicId("category", cat)
    );

    const doc = buildBlogPostDoc(data, portableText, fileName, authorId, categoryIds);
    postDocs.push(doc);
  }

  await upsertDocuments(postDocs, "Blog Posts");
}

async function migrateChangelog(): Promise<void> {
  console.log("\n=== Migrating Changelog ===\n");

  const changelogPath = path.join(JEKYLL_ROOT, "_pages", "changelog.md");
  if (!fs.existsSync(changelogPath)) {
    console.log("  No changelog.md found — skipping.");
    return;
  }

  const raw = fs.readFileSync(changelogPath, "utf-8");
  const { body } = parseFrontMatter(raw);
  const entries = parseChangelog(body);

  console.log(`  Found ${entries.length} changelog entries.`);

  const docs = entries.map(buildChangelogDoc);
  await upsertDocuments(docs, "Changelog");
}

async function migrateLegalDocs(): Promise<void> {
  console.log("\n=== Migrating Legal Documents ===\n");

  // Privacy Policy
  const privacyPath = path.join(JEKYLL_ROOT, "_pages", "privacypolicy.md");
  if (fs.existsSync(privacyPath)) {
    const raw = fs.readFileSync(privacyPath, "utf-8");
    const { body } = parseFrontMatter(raw);
    const portableText = markdownToPortableText(body);
    const doc = buildLegalDoc("Privacy Policy", "privacy-policy", "2025-05-07", portableText);
    await upsertDocuments([doc], "Privacy Policy");
  } else {
    console.log("  No privacypolicy.md found — skipping.");
  }

  // Terms of Use
  const termsPath = path.join(JEKYLL_ROOT, "_pages", "terms.md");
  if (fs.existsSync(termsPath)) {
    const raw = fs.readFileSync(termsPath, "utf-8");
    const { body } = parseFrontMatter(raw);
    const portableText = markdownToPortableText(body);
    const doc = buildLegalDoc("Terms of Use", "terms-of-use", "2025-05-07", portableText);
    await upsertDocuments([doc], "Terms of Use");
  } else {
    console.log("  No terms.md found — skipping.");
  }
}

async function main(): Promise<void> {
  console.log("============================================================");
  console.log("  Mealvana Jekyll -> Sanity Content Migration");
  console.log("============================================================");
  console.log(`  Project:  ${SANITY_PROJECT_ID}`);
  console.log(`  Dataset:  ${SANITY_DATASET}`);
  console.log(`  Jekyll:   ${JEKYLL_ROOT}`);
  console.log(`  Dry Run:  ${DRY_RUN}`);
  console.log("============================================================");

  try {
    await migrateBlogPosts();
    await migrateChangelog();
    await migrateLegalDocs();

    console.log("\n============================================================");
    console.log("  Migration complete!");
    console.log("============================================================\n");
  } catch (err) {
    console.error("\nMigration failed:", err);
    process.exit(1);
  }
}

main();
