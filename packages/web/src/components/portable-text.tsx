import {
  PortableText as PortableTextReact,
  type PortableTextComponents,
} from "@portabletext/react";

type TypedObject = { _type: string; [key: string]: unknown };
import { KaTeXBlock } from "./katex-block";
import { urlFor } from "@/lib/sanity";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Info,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

const calloutIcons = {
  info: Info,
  warning: AlertTriangle,
  tip: Lightbulb,
  success: CheckCircle,
} as const;

const calloutStyles = {
  info: "bg-blue-50 border-blue-200 text-blue-900",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  tip: "bg-purple-50 border-purple-200 text-purple-900",
  success: "bg-green-50 border-green-200 text-green-900",
} as const;

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="mb-6 mt-10 font-heading text-3xl font-bold text-foreground">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-8 font-heading text-2xl font-bold text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-6 font-heading text-xl font-bold text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-3 mt-5 font-heading text-lg font-bold text-foreground">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="mb-2 mt-4 font-heading text-base font-bold text-foreground">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="mb-2 mt-4 font-heading text-sm font-bold text-foreground">
        {children}
      </h6>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-7 text-foreground">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-orange pl-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="leading-7 text-foreground">{children}</li>
    ),
    number: ({ children }) => (
      <li className="leading-7 text-foreground">{children}</li>
    ),
  },

  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    strikethrough: ({ children }) => <s>{children}</s>,
    code: ({ children }) => (
      <code className="rounded bg-cream-dark px-1.5 py-0.5 font-mono text-sm text-blackberry">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="text-orange underline decoration-orange/30 underline-offset-2 transition-colors hover:text-orange-dark hover:decoration-orange"
      >
        {children}
      </a>
    ),
    internalLink: ({ children, value }) => (
      <Link
        to="/blog/$slug"
        params={{ slug: value?.slug ?? "" }}
        className="text-orange underline decoration-orange/30 underline-offset-2 transition-colors hover:text-orange-dark hover:decoration-orange"
      >
        {children}
      </Link>
    ),
    footnote: ({ children, value }) => (
      <span className="group relative">
        {children}
        <sup className="cursor-help text-orange">[*]</sup>
        <span className="invisible absolute bottom-full left-0 z-10 w-64 rounded-lg border border-border bg-background p-3 text-xs shadow-lg group-hover:visible">
          {value?.text}
        </span>
      </span>
    ),
    highlight: ({ children }) => (
      <mark className="rounded bg-orange/20 px-1">{children}</mark>
    ),
  },

  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const alignment = value.alignment || "center";
      const alignClass =
        alignment === "left"
          ? "mr-auto"
          : alignment === "right"
            ? "ml-auto"
            : alignment === "full"
              ? "w-full"
              : "mx-auto";

      return (
        <figure className={`my-8 ${alignClass} max-w-3xl`}>
          <img
            src={urlFor(value).width(1200).url()}
            alt={value.alt || ""}
            className="rounded-xl"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    mathBlock: ({ value }) => (
      <div className="my-6">
        <KaTeXBlock
          expression={value.expression}
          displayMode={value.displayMode ?? false}
        />
      </div>
    ),

    code: ({ value }) => (
      <div className="my-6 overflow-hidden rounded-xl border border-border">
        {value.filename && (
          <div className="border-b border-border bg-cream-dark px-4 py-2 font-mono text-xs text-muted-foreground">
            {value.filename}
          </div>
        )}
        <pre className="overflow-x-auto bg-blackberry p-4">
          <code className="font-mono text-sm text-cream">{value.code}</code>
        </pre>
      </div>
    ),

    calloutBlock: ({ value }) => {
      const type = (value.type || "info") as keyof typeof calloutIcons;
      const Icon = calloutIcons[type] || Info;
      return (
        <div
          className={`my-6 rounded-xl border p-5 ${calloutStyles[type] || calloutStyles.info}`}
        >
          <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              {value.title && (
                <p className="mb-1 font-heading font-bold">{value.title}</p>
              )}
              {value.body && <PortableTextReact value={value.body} components={components} />}
            </div>
          </div>
        </div>
      );
    },

    // Deployed schema stores this as `callout` with fields heading/text/tone
    callout: ({ value }) => {
      const toneMap: Record<string, keyof typeof calloutIcons> = {
        info: "info",
        science: "info",
        warning: "warning",
        tip: "tip",
        success: "success",
      };
      const type = toneMap[value.tone || "info"] ?? "info";
      const Icon = calloutIcons[type] || Info;
      return (
        <div
          className={`my-6 rounded-xl border p-5 ${calloutStyles[type] || calloutStyles.info}`}
        >
          <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              {value.heading && (
                <p className="mb-1 font-heading font-bold">{value.heading}</p>
              )}
              {value.text && (
                <PortableTextReact value={value.text} components={components} />
              )}
            </div>
          </div>
        </div>
      );
    },

    citationBlock: ({ value }) => (
      <div className="my-4 rounded-lg border border-border bg-cream-dark/50 p-4 text-sm">
        <p className="text-foreground">{value.text}</p>
        <p className="mt-1 text-muted-foreground">
          {value.authors && <span>{value.authors}. </span>}
          {value.journal && <em>{value.journal}. </em>}
          {value.year && <span>({value.year}). </span>}
          {value.url && (
            <a
              href={value.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange hover:underline"
            >
              {value.pubmedId ? `PubMed: ${value.pubmedId}` : "Link"}
            </a>
          )}
          {value.doi && (
            <span className="ml-2 text-xs text-muted-foreground">
              DOI: {value.doi}
            </span>
          )}
        </p>
      </div>
    ),

    tableBlock: ({ value }) => {
      // Sanity stores table data as { rows: { rows: [...] } }
      const rows: { cells: string[] }[] = Array.isArray(value.rows)
        ? value.rows
        : value.rows?.rows ?? [];

      return (
        <div className="my-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <tbody>
              {rows.map((row, rowIndex) => {
                const isHeader = rowIndex === 0 && value.hasHeaderRow;
                const Tag = isHeader ? "th" : "td";
                return (
                  <tr
                    key={rowIndex}
                    className={
                      isHeader
                        ? "bg-cream-dark font-bold"
                        : rowIndex % 2 === 0
                          ? "bg-background"
                          : "bg-cream-dark/30"
                    }
                  >
                    {row.cells?.map((cell: string, cellIndex: number) => (
                      <Tag
                        key={cellIndex}
                        className="border-b border-border px-4 py-2 text-left"
                      >
                        {cell}
                      </Tag>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    },

    youtubeEmbed: ({ value }) => {
      const videoId = value.url?.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
      )?.[1];
      if (!videoId) return null;
      return (
        <div className="my-8 aspect-video overflow-hidden rounded-xl">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      );
    },

    tweetEmbed: ({ value }) => (
      <div className="my-6 flex justify-center">
        <blockquote className="twitter-tweet" data-tweet-id={value.tweetId}>
          <a
            href={`https://twitter.com/x/status/${value.tweetId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View tweet
          </a>
        </blockquote>
      </div>
    ),

    imageGallery: ({ value }) => {
      const layoutClass =
        value.layout === "masonry"
          ? "columns-2 gap-4 md:columns-3"
          : value.layout === "carousel"
            ? "flex gap-4 overflow-x-auto snap-x"
            : "grid grid-cols-2 gap-4 md:grid-cols-3";

      return (
        <div className={`my-8 ${layoutClass}`}>
          {value.images?.map(
            (
              img: { asset: unknown; alt?: string; caption?: string },
              i: number,
            ) => (
              <figure
                key={i}
                className={
                  value.layout === "carousel"
                    ? "shrink-0 snap-center"
                    : value.layout === "masonry"
                      ? "mb-4 break-inside-avoid"
                      : ""
                }
              >
                <img
                  src={urlFor(img).width(600).url()}
                  alt={img.alt || ""}
                  className="rounded-lg"
                />
                {img.caption && (
                  <figcaption className="mt-1 text-xs text-muted-foreground">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ),
          )}
        </div>
      );
    },

    accordionBlock: ({ value }) => {
      return (
        <div className="my-6 space-y-2">
          {value.items?.map(
            (
              item: { title: string; content: TypedObject[] },
              i: number,
            ) => (
              <AccordionItem key={i} title={item.title}>
                <PortableTextReact value={item.content} components={components} />
              </AccordionItem>
            ),
          )}
        </div>
      );
    },

    buttonBlock: ({ value }) => {
      const variants = {
        primary:
          "bg-orange text-white hover:bg-orange-dark",
        secondary:
          "bg-blackberry text-cream hover:bg-blackberry-light",
        outline:
          "border-2 border-blackberry text-blackberry hover:bg-blackberry hover:text-cream",
      } as const;
      const variant =
        (value.variant as keyof typeof variants) || "primary";

      return (
        <div className="my-6">
          <a
            href={value.href}
            className={`inline-block rounded-full px-8 py-3 font-heading text-sm font-bold transition-colors ${variants[variant]}`}
          >
            {value.label}
          </a>
        </div>
      );
    },

    dividerBlock: ({ value }) => {
      if (value.style === "dots") {
        return (
          <div className="my-8 text-center text-muted-foreground">
            &bull; &bull; &bull;
          </div>
        );
      }
      if (value.style === "space") {
        return <div className="my-12" />;
      }
      return <hr className="my-8 border-border" />;
    },

    nutritionFactBlock: ({ value }) => (
      <div className="my-2 flex items-center justify-between border-b border-border py-2 text-sm">
        <span className="font-medium text-foreground">{value.nutrient}</span>
        <span className="text-muted-foreground">
          {value.amount}
          {value.unit && ` ${value.unit}`}
          {value.dailyValue && (
            <span className="ml-2 text-xs">({value.dailyValue}% DV)</span>
          )}
        </span>
      </div>
    ),

    // Deployed schema stores this as `nutritionFact` with heading/value/description/source
    nutritionFact: ({ value }) => (
      <aside className="my-6 rounded-2xl border border-orange/20 bg-orange/5 p-6">
        {value.heading && (
          <p className="font-heading text-xs font-bold uppercase tracking-wider text-orange">
            {value.heading}
          </p>
        )}
        {value.value && (
          <p className="mt-2 font-heading text-4xl font-black text-blackberry">
            {value.value}
          </p>
        )}
        {value.description && (
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            {value.description}
          </p>
        )}
        {value.source && (
          <p className="mt-3 text-xs italic text-muted-foreground">
            Source: {value.source}
          </p>
        )}
      </aside>
    ),

    comparisonTable: ({ value }) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          {value.headers && (
            <thead>
              <tr className="bg-cream-dark">
                {value.headers.map((h: string, i: number) => (
                  <th
                    key={i}
                    className="border-b border-border px-4 py-3 text-left font-bold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {value.rows?.map(
              (row: { cells: string[] }, rowIndex: number) => (
                <tr
                  key={rowIndex}
                  className={
                    rowIndex % 2 === 0 ? "bg-background" : "bg-cream-dark/30"
                  }
                >
                  {row.cells?.map((cell: string, cellIndex: number) => (
                    <td
                      key={cellIndex}
                      className="border-b border-border px-4 py-2"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    ),
  },
};

function AccordionItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-foreground hover:bg-cream-dark/50"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

interface PortableTextProps {
  value: TypedObject | TypedObject[] | undefined;
  className?: string;
}

export function PortableText({ value, className }: PortableTextProps) {
  if (!value) return null;
  return (
    <div className={className}>
      <PortableTextReact value={value} components={components} />
    </div>
  );
}
