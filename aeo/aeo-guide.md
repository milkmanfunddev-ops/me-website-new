# AEO & AI SEO Guide: Getting Cited by AI Search Engines

A comprehensive guide to Answer Engine Optimization (AEO) and AI SEO. The goal: make your content discoverable, extractable, and citable by AI systems including Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini, and Copilot.

---

## Table of Contents

- [AEO Is Rebranded SEO](#aeo-is-rebranded-seo)
- [How AI Search Works](#how-ai-search-works)
- [AI Visibility Audit](#ai-visibility-audit)
- [Optimization Strategy: The Three Pillars](#optimization-strategy)
- [Schema Markup for AEO](#schema-markup-for-aeo)
- [llms.txt: A New Standard for AI Discoverability](#llmstxt)
- [Content Types That Get Cited Most](#content-types-that-get-cited-most)
- [AI SEO for Different Content Types](#ai-seo-for-different-content-types)
- [The AEO Maturity Model](#the-aeo-maturity-model)
- [The 30-Day AEO Kickstarter](#the-30-day-aeo-kickstarter)
- [Zero-Budget AEO Wins](#zero-budget-aeo-wins)
- [How Each AI Platform Picks Sources](#how-each-ai-platform-picks-sources)
- [Monitoring AI Visibility](#monitoring-ai-visibility)
- [AEO & GEO Content Patterns](#aeo--geo-content-patterns)
- [Common Mistakes](#common-mistakes)
- [Deep Research Prompts for AEO Audits](#deep-research-prompts-for-aeo-audits)
- [Tools & Resources](#tools--resources)
- [Further Reading](#further-reading)

---

## AEO Is Rebranded SEO

AEO isn't replacing SEO. It's reorganizing your brand knowledge into machine-readable chunks that AI engines can confidently cite. The fundamentals of SEO still apply. We just need to adapt for AI.

**The translations:**

| SEO Concept | AEO Equivalent |
|-------------|----------------|
| Longtail keywords | Query fan-out |
| Backlinks | Citations (backlinks repackaged) |
| Schema markup | Schema markup (same thing, but no longer optional) |
| Quality content | Entity-rich, structured, answerable content |

### The Key Distinction

- **SEO asks:** Does my content rank for this keyword?
- **AEO asks:** Can AI systems extract a clear, accurate answer from my content and confidently attribute it to my brand?

SEO success = rankings, traffic, position.
AEO success = citation frequency, consistency of appearance, how often your content is reused inside generated answers.

### Two Mindset Shifts

**Consistency of message replaces consistency of position.** You can't guarantee you'll be cited, but you can guarantee that when you are cited, the AI gets your story right. The consistency you control now is narrative consistency, not ranking consistency. Make your structured content so clear that models don't hallucinate your positioning or flatten your differentiation.

**Ubiquity over ranking.** In SEO you needed to be in one place (the SERP). In AEO you need to be everywhere the model might pull from: your site, third-party reviews, Reddit threads, YouTube, industry publications, community forums. You can't control what the model picks on any given run, but you can make sure that no matter where it looks, it finds you.

### The Shift from Deterministic to Probabilistic

There's no algorithm update playbook for AEO the way there is for Google. No Search Console equivalent. No rank tracker that means what it used to mean. The shift is from deterministic marketing (I did X, I got Y) to probabilistic marketing (I did X, I increased the odds of Y). The playbook isn't "here's how you guarantee visibility in AI answers." It's "here's how you maximize the probability you show up, across the most runs, with the most accurate representation of your brand."

---

## How AI Search Works

### The AI Search Landscape

| Platform | How It Works | Source Selection |
|----------|-------------|----------------|
| **Google AI Overviews** | Summarizes top-ranking pages | Strong correlation with traditional rankings + E-E-A-T |
| **ChatGPT (with search)** | Searches web via Bing, cites sources | Draws from wider range, not just top-ranked |
| **Perplexity** | Always cites sources with links | Favors authoritative, recent, well-structured content |
| **Gemini** | Google's AI assistant | Pulls from Google index + Knowledge Graph |
| **Copilot** | Bing-powered AI search | Bing index + authoritative sources |
| **Claude** | Brave Search (when enabled) | Training data + Brave search results |

### Key Difference from Traditional SEO

Traditional SEO gets you ranked. AI SEO gets you **cited**.

In traditional search, you need to rank on page 1. In AI search, a well-structured page can get cited even if it ranks on page 2 or 3. AI systems select sources based on content quality, structure, and relevance, not just rank position.

### Key Statistics

Sources: AirOps 2026 State of AI Search Report, Webflow State of the Web, Princeton GEO Study (KDD 2024).

- AI Overviews appear in ~47% of Google searches (AirOps, early 2026)
- AI Overviews reduce clicks to websites by up to 58%
- **60%** of AI Overview citations come from pages that do NOT rank in the top 20 organic results (AirOps)
- **85%** of brand mentions in top-of-funnel commercial queries come from third-party sources, not the brands themselves (AirOps)
- Only **30%** of brands remain visible from one AI answer to the next; only **20%** stay visible across five consecutive runs (AirOps)
- **95%** of pages cited in ChatGPT are less than 10 months old (AirOps)
- **6x** higher conversion from AI-driven traffic vs. non-brand Google traffic (Webflow/Josh Grant)
- **10-25%** of brand discovery already happens inside LLMs (Webflow)
- Statistics and citations boost AI visibility by 40%+ across queries (Princeton GEO study)
- **52%** of marketing leaders will optimize for AI-driven search in 2026 (Webflow)

---

## AI Visibility Audit

Before optimizing, assess your current AI search presence.

### Step 1: Ask AI About Your Business

Run these prompts across ChatGPT, Claude, Perplexity, and Google AI Overviews:

1. "Tell me what you know about [Company Name]. Where does this information come from? What's missing or inaccurate?"
2. "What would you recommend to someone looking for [your product/service]? Which companies or solutions would you suggest?"
3. "Explain [specific topic in your industry]. Which companies or resources are most authoritative on this topic?"

Look for patterns in what's missing, what's wrong, and where competitors get recommended instead of you. Those are your priority gaps.

### Step 2: Test Your Key Queries

Test 10-20 of your most important queries across platforms:

| Query | Google AI Overview | ChatGPT | Perplexity | You Cited? | Competitors Cited? |
|-------|:-----------------:|:-------:|:----------:|:----------:|:-----------------:|
| [query 1] | Yes/No | Yes/No | Yes/No | Yes/No | [who] |
| [query 2] | Yes/No | Yes/No | Yes/No | Yes/No | [who] |

**Query types to test:**
- "What is [your product category]?"
- "Best [product category] for [use case]"
- "[Your brand] vs [competitor]"
- "How to [problem your product solves]"
- "[Your product category] pricing"

**Important:** People ask AI differently than they type into Google. A Google query looks like "best quantitative fit test instrument fire department." An AI query looks like "What's the best quantitative fit testing instrument for fire departments?" Test both formats.

### Step 3: Act Like a Customer

Ask what your customers ask, not what you want them to ask. Sources for real customer language:
- Support tickets and customer emails
- Sales call recordings and chat transcripts
- Reddit and community threads
- Google Search Console query data
- Forums and industry communities

This becomes your content roadmap.

### Step 4: Content Extractability Check

For each priority page, verify:

| Check | Pass/Fail |
|-------|-----------|
| Clear definition in first paragraph? | |
| Self-contained answer blocks (work without surrounding context)? | |
| Statistics with sources cited? | |
| Comparison tables for "[X] vs [Y]" queries? | |
| FAQ section with natural-language questions? | |
| Schema markup (FAQ, HowTo, Article, Product)? | |
| Expert attribution (author name, credentials)? | |
| Recently updated (within 6 months)? | |
| Heading structure matches query patterns? | |
| AI bots allowed in robots.txt? | |

### Step 5: AI Bot Access Check

Verify your robots.txt allows AI crawlers. Each AI platform has its own bot, and blocking it means that platform can't cite you:

- **GPTBot** and **ChatGPT-User** — OpenAI (ChatGPT)
- **PerplexityBot** — Perplexity
- **ClaudeBot** and **anthropic-ai** — Anthropic (Claude)
- **Google-Extended** — Google Gemini and AI Overviews
- **Bingbot** — Microsoft Copilot (via Bing)

Check your robots.txt for `Disallow` rules targeting any of these. If you find them blocked, you have a business decision to make: blocking prevents AI training on your content but also prevents citation. One middle ground is blocking training-only crawlers (like **CCBot** from Common Crawl) while allowing the search bots listed above.

---

## Optimization Strategy

### The Three Pillars

```
1. Structure (make it extractable)
2. Authority (make it citable)
3. Presence (be where AI looks)
```

---

### Pillar 1: Structure — Make Content Extractable

#### How AI Systems Retrieve Content

AI search systems use a process called retrieval-augmented generation (RAG). They don't read your entire page. They break content into passages (roughly 200-500 tokens, or 150-375 words) and retrieve the most relevant passages for a given query. Each passage is evaluated independently.

This means:
- Every section of your content needs to work as a standalone unit
- A brilliant answer buried in the middle of a rambling paragraph will get skipped
- Clear headings help the system understand what each passage is about
- Short, self-contained paragraphs beat long, flowing prose

#### Query Fan-Out

Query fan-out is how AI systems expand a single user query into multiple sub-queries to capture different aspects of what the user might need. When someone asks "What's the best project management tool?", an AI system might internally decompose that into:

- What are the top-rated project management tools?
- What features matter most in project management software?
- How do project management tools compare on pricing?
- What do users say about [specific tools]?

Understanding fan-out is critical because it tells you what content to create.

**The 5 + 3 + 3 Formula for Generating Fan-Out**

From a single base question, generate 11 variations:

- **Core question**: Restate the base question clearly
- **What/Why/How variations (5)**: Questions exploring definition, reasoning, and process
- **Contextual variations (3)**: Questions tied to specific use cases, industries, or scenarios
- **Industry-specific variations (3)**: Questions using terminology from the target sector

**Example:**

Base question: "What is the best project management tool?"

Fan-out:
- "What is the best project management tool for a 15-person team?"
- "...that integrates with Slack?"
- "...that can have multiple people assigned to the same task?"
- "How many team members can use [tool]?"
- "What's the pricing for a 20-person team?"
- "How long does setup take?"

**Where to find fan-out topics:**
- Google People Also Ask
- Support tickets and customer emails
- Sales call recordings and chat transcripts
- Reddit and community threads
- Google Search Console keyword data
- Tools: AlsoAsked, AnswerThePublic, Profound, Scrunch, PromptWatch

#### FAQs: The Secret Weapon for Fan-Out

FAQs on product pages are one of the most powerful AEO tactics because:
- They directly match how people ask questions to LLMs
- They naturally address query fan-out (initial question + follow-ups)
- They provide structured, easily parseable content for AI engines
- They help humans AND LLMs simultaneously
- They can be wrapped in FAQPage schema for additional signal

Where to add FAQs: bottom of product pages, pillar pages, service pages, anywhere you're answering questions your audience actually asks.

#### The AEO Answer Block Formula

A structured format for creating AI-ready content blocks:

```
[Question exactly as customers ask it]

Quick Answer (30-60 words):
[The distilled truth. No fluff.]

Why This Matters:
[3-5 sentences with entity-rich language: who it's for, when it applies, what problem it solves]

Common Follow-ups:
- [Question 1] — [Brief answer]
- [Question 2] — [Brief answer]
- [Question 3] — [Brief answer]

Example:
[Real scenario or use case]
```

Why this works:
1. **High-signal summary** — Models can quote the Quick Answer directly
2. **Context layer** — Teaches AI when/why/who this applies to
3. **Decision logic** — Gives AI reasoning patterns to reuse
4. **Follow-ups** — Captures fan-out queries on the same page

Guidelines:
- Keep Answer Blocks under 200 words
- Focus on one question per block
- Use entity-rich language throughout
- Always include the follow-up questions

#### Entity-Rich Language

AI engines need specifics to cite you confidently. Vague language gets skipped; entity-rich language gets cited.

| Instead of... | Try... |
|---------------|--------|
| "Our solution helps businesses" | "Our [specific product name] helps [specific industry] companies reduce [specific problem] by [specific method]" |
| "We offer great customer service" | "[Company] provides 24/7 technical support with average response times under 2 hours" |
| "Industry-leading technology" | "[Product] uses [specific technology] to achieve [specific measurable outcome]" |

#### Structural Rules

- Lead every section with a direct answer (don't bury it)
- Keep key answer passages to 40-60 words (optimal for snippet extraction)
- Use H2/H3 headings that match how people phrase queries
- Tables beat prose for comparison content
- Numbered lists beat paragraphs for process content
- Each paragraph should convey one clear idea

---

### Pillar 2: Authority — Make Content Citable

AI systems prefer sources they can trust. Build citation-worthiness.

#### Research-Backed Optimization Methods

The Princeton GEO research (KDD 2024, studied across Perplexity.ai) ranked 9 optimization methods:

| Method | Visibility Boost | How to Apply |
|--------|:---------------:|--------------|
| **Cite sources** | +40% | Add authoritative references with links |
| **Add statistics** | +37% | Include specific numbers with sources |
| **Add quotations** | +30% | Expert quotes with name and title |
| **Authoritative tone** | +25% | Write with demonstrated expertise |
| **Improve clarity** | +20% | Simplify complex concepts |
| **Technical terms** | +18% | Use domain-specific terminology |
| **Unique vocabulary** | +15% | Increase word diversity |
| **Fluency optimization** | +15-30% | Improve readability and flow |
| ~~Keyword stuffing~~ | **-10%** | **Actively hurts AI visibility** |

**Best combination:** Fluency + Statistics = maximum boost. Low-ranking sites benefit even more, with up to 115% visibility increase when adding citations.

#### The Citation Desert

Not all content ages equally in AI search. Content freshness follows a predictable decay pattern:

| Zone | Age | Citation Probability |
|------|-----|---------------------|
| **Prime Citation Zone** | 1-3 months | Highest probability of citation |
| **Declining Zone** | 3-9 months | Decreasing citation frequency |
| **Citation Desert** | 9-12+ months | Content effectively invisible to AI |

**Core stat:** 95% of pages cited in ChatGPT are less than 10 months old (AirOps). Pages not refreshed quarterly are 3x more likely to lose citations.

**What to do:**
- Update top-performing content monthly
- Refresh all content at minimum quarterly to stay out of the Citation Desert
- Add the current year to URLs and meta-titles to signal freshness
- "Refreshing" means more than changing the date: update statistics, add new examples, expand coverage, remove outdated information
- Prioritize refreshing pages that (a) currently get cited, (b) target high-value queries, or (c) have competitors getting cited instead

#### Statistics and Data (+37-40% citation boost)

- Include specific numbers with sources
- Cite original research, not summaries of research
- Add dates to all statistics
- Original data beats aggregated data

#### Expert Attribution (+25-30% citation boost)

- Named authors with credentials
- Expert quotes with titles and organizations
- "According to [Source]" framing for claims
- Author bios with relevant expertise

#### E-E-A-T Alignment

- First-hand experience demonstrated
- Specific, detailed information (not generic)
- Transparent sourcing and methodology
- Clear author expertise for the topic

---

### Pillar 3: Presence — Be Where AI Looks

AI systems don't just cite your website. They cite where you appear.

#### Brand Mentions vs. Citations

These are two different things:
- **Brand mention:** AI names your brand in its answer ("OHD makes fit testing instruments") without linking to your content. This comes from training data and third-party sources.
- **Citation:** AI links to your content as a source. This comes from real-time web search.

Both matter. Brand mentions build awareness and influence recommendations. Citations drive traffic. Optimize for both.

#### Brand Drives LLM Visibility

When people talk about you, cite you, and mention you across credible sources, LLMs pick it up. Brand mentions, interviews, podcasts, community discussions: they all contribute. Citation-building (the new link-building) in publications that consistently show up for your target queries is one of the highest-leverage AEO activities.

AirOps found that 85% of brand mentions in top-of-funnel commercial queries come from third-party sources, not the brands themselves.

#### Third-Party Sources That Matter

- Wikipedia mentions (7.8% of all ChatGPT citations)
- Reddit discussions (1.8% of ChatGPT citations)
- Industry and trade publications
- Review sites (G2, Capterra, TrustRadius for B2B)
- YouTube (frequently cited by Google AI Overviews)
- Quora answers
- Podcasts and interviews (transcripts get indexed)

#### Entity Optimization

Establish your brand as a recognized entity across platforms:
- Create or update your Wikidata entry
- Maintain a Wikipedia page if notable enough
- Ensure consistent brand information (name, description, category) across all platforms
- Build toward a Google Knowledge Panel through structured data and consistent entity signals
- Use the same brand name, product names, and descriptions everywhere

#### Actions

- Ensure your Wikipedia page is accurate and current
- Participate authentically in Reddit communities
- Get featured in industry roundups and comparison articles
- Maintain updated profiles on relevant review platforms
- Create YouTube content for key how-to queries
- Answer relevant Quora questions with depth
- Pitch trade publications for expert contributor opportunities (many are actively seeking contributors)

---

## Schema Markup for AEO

Schema markup is structured data that helps AI engines understand your content. Think of it as giving LLMs a cheat sheet about your page. LLMs can't interpret pages like humans do. Schema explicitly tells them "this is a product," "this is a review," "this is a FAQ."

### Key Schema Types

| Content Type | Schema | Why It Helps |
|-------------|--------|-------------|
| Articles/Blog posts | `Article`, `BlogPosting` | Author, date, topic identification |
| How-to content | `HowTo` | Step extraction for process queries |
| FAQs | `FAQPage` | Direct Q&A extraction. Huge for AEO. |
| Products | `Product` | Pricing, features, reviews |
| Comparisons | `ItemList` | Structured comparison data |
| Reviews | `Review`, `AggregateRating` | Trust signals |
| Organization | `Organization` | Establishes brand entity |
| Local businesses | `LocalBusiness` | Address, hours, service area |

Content with proper schema shows 30-40% higher AI visibility.

### Action Items

- Audit your current schema. Most sites only use 30-40% of available schema properties.
- Use Google's Schema Markup Validator and Rich Results Test to verify.
- For WordPress: Yoast handles schema well.
- Webflow has a dedicated AEO audit panel that checks schema alongside SEO.

### Other Technical Essentials

- Logical URL structure with clear subfolder organization
- Clean HTML structure with proper heading hierarchy (H1, H2, H3)
- Data in tables where appropriate (AI models scrape structured data more effectively)
- AI engines can't render JavaScript. Ensure your content isn't obscured behind JS rendering.
- Site speed and crawlability still matter. Sub-2-second load times are a clear threshold for Copilot.

---

## llms.txt: A New Standard for AI Discoverability

`llms.txt` is a proposed web standard that provides LLMs with a structured, plain-text summary of your website. Think of it as the AI equivalent of combining robots.txt (access instructions) with a sitemap (content map) into a format specifically designed for language models.

### How It Works

You place a plain-text file at your site root (`yoursite.com/llms.txt`) that gives AI systems a structured overview of who you are, what you do, and where your most important content lives. Unlike HTML pages that require parsing, llms.txt is immediately readable by any language model.

### llms.txt vs. llms-full.txt

| File | Purpose | Length |
|------|---------|--------|
| `llms.txt` | Summary overview. Key facts, main pages, product descriptions. | Short (1-2 pages) |
| `llms-full.txt` | Comprehensive reference. Full product details, documentation links, FAQs, technical specs. | As long as needed |

### What to Include

```
# [Company Name]

> [One-sentence description of what you do]

## About
[2-3 sentences: who you are, what you sell, who you serve]

## Products / Services
- [Product 1]: [Brief description, key differentiator]
- [Product 2]: [Brief description, key differentiator]

## Key Pages
- [Page title](URL): [What this page covers]
- [Page title](URL): [What this page covers]

## FAQs
- [Common question]: [Direct answer]
- [Common question]: [Direct answer]

## Contact
- Website: [URL]
- Email: [Email]
- Phone: [Phone]
```

### Current Status

llms.txt is an emerging standard, not yet universally adopted. However, early adopters gain an advantage: providing structured, LLM-optimized content at a known URL makes it easier for AI systems to understand and cite your brand accurately. The cost of implementation is minimal (it's a text file), and the downside risk is zero.

---

## Content Types That Get Cited Most

Not all content is equally citable. Prioritize these formats:

| Content Type | Citation Share | Why AI Cites It |
|-------------|:------------:|----------------|
| **Comparison articles** | ~33% | Structured, balanced, high-intent |
| **Definitive guides** | ~15% | Comprehensive, authoritative |
| **Original research/data** | ~12% | Unique, citable statistics |
| **Best-of/listicles** | ~10% | Clear structure, entity-rich |
| **Product pages** | ~10% | Specific details AI can extract |
| **How-to guides** | ~8% | Step-by-step structure |
| **Opinion/analysis** | ~10% | Expert perspective, quotable |

**Underperformers for AI citation:**
- Generic blog posts without structure
- Thin product pages with marketing fluff
- Gated content (AI can't access it)
- Content without dates or author attribution
- PDF-only content (harder for most AI to parse, though Perplexity specifically prioritizes publicly accessible PDFs like whitepapers and research reports)

---

## AI SEO for Different Content Types

### Product Pages

**Goal:** Get cited in "What is [category]?" and "Best [category]" queries.

**Optimize:**
- Clear product description in first paragraph (what it does, who it's for)
- Feature comparison tables (your product vs. category benchmarks)
- Specific metrics ("reduces testing time to under 3 minutes" not "fast testing")
- Customer count or social proof with numbers
- Pricing transparency (AI cites pages with visible pricing)
- FAQ section addressing common buyer questions with query fan-out

### Blog Content

**Goal:** Get cited as an authoritative source on topics in your space.

**Optimize:**
- One clear target query per post (match heading to query)
- Definition in first paragraph for "What is" queries
- Original data, research, or expert quotes
- "Last updated" date visible
- Author bio with relevant credentials
- Internal links to related product/feature pages

### Comparison/Alternative Pages

**Goal:** Get cited in "[X] vs [Y]" and "Best [X] alternatives" queries.

**Optimize:**
- Structured comparison tables (not just prose)
- Fair and balanced (AI penalizes obviously biased comparisons)
- Specific criteria with ratings or scores
- Updated pricing and feature data

### Documentation / Help Content

**Goal:** Get cited in "How to [X] with [your product]" queries.

**Optimize:**
- Step-by-step format with numbered lists
- Code examples where relevant
- HowTo schema markup
- Screenshots with descriptive alt text
- Clear prerequisites and expected outcomes

---

## The AEO Maturity Model

Source: Webflow, "AEO for the CMO: An Actionable Maturity Model"

Use this to assess where you are and what to work on next. The model has four dimensions (Content, Technical, Authority, Measurement) across five levels.

### Five Levels

**Level 1 — Keywords**
Traditional keyword-focused content, basic on-page SEO, building backlinks, tracking keyword rankings.

**Level 2 — Answers**
Starting to reorient around answers instead of just keywords. Creating some answer-oriented content, working on basic page structure, actively pursuing E-E-A-T principles, doing ad hoc mention checking.

**Level 3 — Structure**
Getting systematic. Creating answer question clusters, building consistent site structure on a fast site, doing proactive digital PR and thought leadership, systematically tracking LLM traffic, mentions, and sentiment.

**Level 4 — Pillar**
Optimizing for AEO as a thought leader. Creating answer-hierarchy-driven content, automated site structure, recognized as a pillar of thought leadership, tracking share of voice and accuracy.

**Level 5 — Authority**
Continuous adaptation to answer engine changes. Programmatic AEO with personalized content, adopted emerging standards (llms.txt, MCP), widespread positive citations, real-time analytics.

### Self-Assessment Questions

- **Content:** Do you target questions prospects ask as a primary way of choosing content topics?
- **Technical:** Does your website use schema.org structure widely?
- **Authority:** Does your team explicitly aim for Google's E-E-A-T?
- **Measurement:** Does your team measure mentions in LLMs?

Most companies are between Levels 1-3. That's fine. Progress beats perfection. Focus on getting to Level 3 solidly before trying to jump ahead.

---

## The 30-Day AEO Kickstarter

A practical 4-week plan for getting started with AEO. If time is minimal, focus just on Week 1 for a baseline.

### Week 1: Audit & Understand

Goal: Figure out where you stand.

- Test what AI knows about your company across ChatGPT, Claude, Perplexity, and Google AI Overviews (use the audit prompts from the [AI Visibility Audit](#ai-visibility-audit) section)
- Document what they say (or don't say) and where you're being mentioned
- Review existing content: which pages get most traffic, which topics are you known for, do you have clear answers to common industry questions
- Understand the Citation Desert: 95% of pages cited in ChatGPT are less than 10 months old

### Week 2: Content That AI Can Use

Goal: Make your content more digestible for AI.

- Audit your best content for answerability. Does it directly answer questions?
- Add FAQ sections to product pages, pillar pages, and service pages
- Create query fan-outs: map all related questions from 3-5 main keywords using the 5+3+3 formula
- Build Answer Blocks for your highest-priority questions
- Start a simple tracking spreadsheet: monitor when and where AI cites you

### Week 3: Schema and Site Structure

Goal: Make your site technically ready for AI.

- Add or update schema markup: Organization, Article, FAQPage at minimum
- For local businesses: add LocalBusiness schema
- Use Google's Schema Markup Validator to test
- Improve site structure: clean HTML, proper heading hierarchy, data tables
- Create an llms.txt file and host it at your site root

### Week 4: Build for Citations

Goal: Get other people to reference you.

- Identify citation opportunities: authoritative industry sites, trade publications, associations, educational institutions
- Create cite-worthy content: original research, data, case studies, definitive guides
- Pitch trade publications. Many are actively seeking expert contributors.
- Even articles that don't reference your product directly improve thought leadership and backlinks

### Measure Your Progress

Re-run the Week 1 audit after completing Week 4. See if AI models are citing you more and if the information has improved. Then repeat quarterly.

---

## Zero-Budget AEO Wins

Seven things you can do right now without spending money:

1. **Optimize existing content with prompt-style phrasing.** Rewrite headings to match how people ask questions to AI ("What is respirator fit testing?" not "Fit Testing Overview").
2. **Add FAQs with query fan-out to your top product pages.** 5-10 questions each, using real customer language.
3. **Implement FAQPage schema on any page with Q&A content.** This is the single highest-impact schema type for AEO.
4. **Keep content fresh.** Update your most important pages monthly. Refresh everything else quarterly. Change the "last updated" date only when you actually update the content.
5. **Mine sales calls and support tickets for real customer language.** These reveal the exact questions people ask, in the exact words they use.
6. **Use Search Console data for query fan-out.** Your existing search queries show you what people are already looking for.
7. **Join community conversations where your audience hangs out.** Authentic participation in Reddit, forums, and industry communities builds the third-party presence that AI draws from.

---

## How Each AI Platform Picks Sources

Every AI platform shares three baseline requirements:

1. **Your content must be in their index.** Each platform uses a different search backend (Google, Bing, Brave, or their own). If you're not indexed, you can't be cited.
2. **Your content must be crawlable.** AI bots need access via robots.txt. Block the bot, lose the citation.
3. **Your content must be extractable.** AI systems pull passages, not pages. Clear structure and self-contained paragraphs win.

Beyond these basics, each platform weights different signals.

### Google AI Overviews

Google AI Overviews pull from Google's own index and lean heavily on E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness). They appear in roughly 47% of Google searches (AirOps, early 2026).

**What makes Google AI Overviews different:** They already have your traditional SEO signals: backlinks, page authority, topical relevance. The additional AI layer adds a preference for content with cited sources and structured data. Research shows that including authoritative citations in your content correlates with a 132% visibility boost, and writing with an authoritative (not salesy) tone adds another 89%.

**AI Overviews don't just recycle the traditional Top 10.** Only about 15% of AI Overview sources overlap with conventional organic results. Pages that wouldn't crack page 1 in traditional search can still get cited if they have strong structured data and clear, extractable answers.

**What to focus on:**
- Schema markup is the single biggest lever: Article, FAQPage, HowTo, and Product schemas give AI Overviews structured context to work with (30-40% visibility boost)
- Build topical authority through content clusters with strong internal linking
- Include named, sourced citations in your content (not just claims)
- Author bios with real credentials matter. E-E-A-T is weighted heavily
- Get into Google's Knowledge Graph where possible (an accurate Wikipedia entry helps)
- Target "how to" and "what is" query patterns, as these trigger AI Overviews most often

### ChatGPT

ChatGPT's web search draws from a Bing-based index. It combines this with its training knowledge to generate answers, then cites the web sources it relied on.

**What makes ChatGPT different:** Domain authority matters more here than on other AI platforms. An SE Ranking analysis of 129,000 domains found that authority and credibility signals account for roughly 40% of what determines citation, with content quality at about 35% and platform trust at 25%. Sites with very high referring domain counts (350K+) average 8.4 citations per response, while sites with slightly lower trust scores (91-96 vs 97-100) drop from 8.4 to 6 citations.

**Freshness is a major differentiator.** Content updated within the last 30 days gets cited about 3.2x more often than older content. ChatGPT clearly favors recent information.

**The most important signal is content-answer fit.** A ZipTie analysis of 400,000 pages found that how well your content's style and structure matches ChatGPT's own response format accounts for about 55% of citation likelihood. This is far more important than domain authority (12%) or on-page structure (14%) alone. Write the way ChatGPT would answer the question, and you're more likely to be the source it cites.

**Where ChatGPT looks beyond your site:** Wikipedia accounts for 7.8% of all ChatGPT citations, Reddit for 1.8%, and Forbes for 1.1%. Brand official sites are cited frequently but third-party mentions carry significant weight.

**What to focus on:**
- Invest in backlinks and domain authority, the strongest baseline signal
- Update competitive content at least monthly
- Structure your content the way ChatGPT structures its answers (conversational, direct, well-organized)
- Include verifiable statistics with named sources
- Clean heading hierarchy (H1 > H2 > H3) with descriptive headings

### Perplexity

Perplexity always cites its sources with clickable links, making it the most transparent AI search platform. It combines its own index with Google's and runs results through multiple reranking passes: initial relevance retrieval, then traditional ranking factor scoring, then ML-based quality evaluation that can discard entire result sets if they don't meet quality thresholds.

**What makes Perplexity different:** It's the most "research-oriented" AI search engine. Perplexity maintains curated lists of authoritative domains (Amazon, GitHub, major academic sites) that get inherent ranking boosts. It uses a time-decay algorithm that evaluates new content quickly, giving fresh publishers a real shot at citation.

**Perplexity has unique content preferences:**
- **FAQ Schema (JSON-LD)** — Pages with FAQ structured data get cited noticeably more often
- **PDF documents** — Publicly accessible PDFs (whitepapers, research reports) are prioritized. If you have authoritative PDF content gated behind a form, consider making a version public.
- **Publishing velocity** — How frequently you publish matters more than keyword targeting
- **Self-contained paragraphs** — Perplexity prefers atomic, semantically complete paragraphs it can extract cleanly

**What to focus on:**
- Allow PerplexityBot in robots.txt
- Implement FAQPage schema on any page with Q&A content
- Host PDF resources publicly (whitepapers, guides, reports)
- Add Article schema with publication and modification timestamps
- Write in clear, self-contained paragraphs that work as standalone answers
- Build deep topical authority in your specific niche

### Microsoft Copilot

Copilot is embedded across Microsoft's ecosystem: Edge, Windows, Microsoft 365, and Bing Search. It relies entirely on Bing's index, so if Bing hasn't indexed your content, Copilot can't cite it.

**What makes Copilot different:** The Microsoft ecosystem connection creates unique optimization opportunities. Mentions and content on LinkedIn and GitHub provide ranking boosts that other platforms don't offer. Copilot also puts more weight on page speed, with sub-2-second load times as a clear threshold.

**What to focus on:**
- Submit your site to Bing Webmaster Tools (many sites only submit to Google Search Console)
- Use IndexNow protocol for faster indexing of new and updated content
- Optimize page speed to under 2 seconds
- Write clear entity definitions: when your content defines a term or concept, make the definition explicit and extractable
- Build presence on LinkedIn (publish articles, maintain company page) and GitHub if relevant
- Ensure Bingbot has full crawl access

### Claude

Claude uses Brave Search as its search backend when web search is enabled, not Google, not Bing. This is a completely different index, which means your Brave Search visibility directly determines whether Claude can find and cite you.

**What makes Claude different:** Claude is extremely selective about what it cites. Its citation rate is very low. It's looking for the most factually accurate, well-sourced content on a given topic. Data-rich content with specific numbers and clear attribution performs significantly better than general-purpose content.

**What to focus on:**
- Verify your content appears in Brave Search results (search for your brand and key terms at search.brave.com)
- Allow ClaudeBot and anthropic-ai user agents in robots.txt
- Maximize factual density: specific numbers, named sources, dated statistics
- Use clear, extractable structure with descriptive headings
- Cite authoritative sources within your content
- Aim to be the most factually accurate source on your topic

### Allowing AI Bots in robots.txt

If your robots.txt blocks an AI bot, that platform can't cite your content. Here are the user agents to allow:

```
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /
```

**Training vs. search:** Some AI bots are used for both model training and search citation. If you want to be cited but don't want your content used for training, your options are limited. GPTBot handles both for OpenAI. However, you can safely block **CCBot** (Common Crawl) without affecting any AI search citations, since it's only used for training dataset collection.

### Where to Start

If you're optimizing for AI search for the first time, focus your effort where your audience actually is:

**Start with Google AI Overviews.** They reach the most users (47%+ of Google searches) and you likely already have Google SEO foundations in place. Add schema markup, include cited sources in your content, and strengthen E-E-A-T signals.

**Then address ChatGPT.** It's the most-used standalone AI search tool for business audiences. Focus on freshness (update content monthly), domain authority, and matching your content structure to how ChatGPT formats its responses.

**Then expand to Perplexity.** Especially valuable if your audience includes researchers, early adopters, or tech professionals. Add FAQ schema, publish PDF resources, and write in clear, self-contained paragraphs.

**Copilot and Claude are lower priority** unless your audience skews enterprise/Microsoft (Copilot) or developer/analyst (Claude). But the fundamentals: structured content, cited sources, schema markup, help across all platforms.

---

## Monitoring AI Visibility

### What to Track

| Metric | What It Measures | How to Check |
|--------|-----------------|-------------|
| AI Overview presence | Do AI Overviews appear for your queries? | Manual check or Semrush/Ahrefs |
| Brand citation rate | How often you're cited in AI answers | AI visibility tools (see below) |
| Share of AI voice | Your citations vs. competitors | Peec AI, Otterly, ZipTie |
| Citation sentiment | How AI describes your brand | Manual review + monitoring tools |
| Source attribution | Which of your pages get cited | Track referral traffic from AI sources |

### Identifying AI Referral Traffic in GA4

AI platforms show up as referral sources in Google Analytics. Set up segments or filters for:
- `chat.openai.com` — ChatGPT
- `perplexity.ai` — Perplexity
- `gemini.google.com` — Gemini
- `copilot.microsoft.com` — Copilot
- `claude.ai` — Claude

Track these as a group to see your total AI-driven traffic and which pages AI users are landing on.

### AI Visibility Monitoring Tools

| Tool | Coverage | Best For |
|------|----------|----------|
| **Otterly AI** | ChatGPT, Perplexity, Google AI Overviews | Share of AI voice tracking |
| **Peec AI** | ChatGPT, Gemini, Perplexity, Claude, Copilot+ | Multi-platform monitoring at scale |
| **ZipTie** | Google AI Overviews, ChatGPT, Perplexity | Brand mention + sentiment tracking |
| **LLMrefs** | ChatGPT, Perplexity, AI Overviews, Gemini | SEO keyword to AI visibility mapping |
| **AirOps** | End-to-end content engineering | AEO audit checklists, structure analysis |
| **Profound** | AI visibility layer | Citation research and monitoring |
| **HubSpot AEO Grader** | Free tool | Quick AEO health check |
| **SparkToro** | Brand mentions | Topic coverage across AI engines |
| **Semrush** | AI overview tracking | Visibility metrics, keyword research |
| **seoClarity** | AI overview monitoring | Enterprise-scale tracking |

### Query Research Tools

| Tool | Best For |
|------|----------|
| **Google Search Console** | Query fan-out and keyword data |
| **AlsoAsked** | Mapping question clusters AI might pull from |
| **AnswerThePublic** | Fan-out question variations |
| **Scrunch** | Prompt query identification |
| **PromptWatch** | Prompt query opportunities |

### DIY Monitoring (No Tools)

Monthly manual check:
1. Pick your top 20 queries
2. Run each through ChatGPT, Perplexity, and Google
3. Record: Are you cited? Who is? What page?
4. Log in a spreadsheet, track month-over-month

---

## AEO & GEO Content Patterns

Reusable content block patterns optimized for answer engines and AI citation.

### Answer Engine Optimization (AEO) Patterns

These patterns help content appear in featured snippets, AI Overviews, voice search results, and answer boxes.

#### Definition Block

Use for "What is [X]?" queries.

```markdown
## What is [Term]?

[Term] is [concise 1-sentence definition]. [Expanded 1-2 sentence explanation with key characteristics]. [Brief context on why it matters or how it's used].
```

**Example:**
```markdown
## What is Answer Engine Optimization?

Answer Engine Optimization (AEO) is the practice of structuring content so AI-powered systems can easily extract and present it as direct answers to user queries. Unlike traditional SEO that focuses on ranking in search results, AEO optimizes for featured snippets, AI Overviews, and voice assistant responses. This approach has become essential as over 60% of Google searches now end without a click.
```

#### Step-by-Step Block

Use for "How to [X]" queries. Optimal for list snippets.

```markdown
## How to [Action/Goal]

[1-sentence overview of the process]

1. **[Step Name]**: [Clear action description in 1-2 sentences]
2. **[Step Name]**: [Clear action description in 1-2 sentences]
3. **[Step Name]**: [Clear action description in 1-2 sentences]
4. **[Step Name]**: [Clear action description in 1-2 sentences]
5. **[Step Name]**: [Clear action description in 1-2 sentences]

[Optional: Brief note on expected outcome or time estimate]
```

#### Comparison Table Block

Use for "[X] vs [Y]" queries. Optimal for table snippets.

```markdown
## [Option A] vs [Option B]: [Brief Descriptor]

| Feature | [Option A] | [Option B] |
|---------|------------|------------|
| [Criteria 1] | [Value/Description] | [Value/Description] |
| [Criteria 2] | [Value/Description] | [Value/Description] |
| [Criteria 3] | [Value/Description] | [Value/Description] |
| [Criteria 4] | [Value/Description] | [Value/Description] |
| Best For | [Use case] | [Use case] |

**Bottom line**: [1-2 sentence recommendation based on different needs]
```

#### Pros and Cons Block

Use for evaluation queries: "Is [X] worth it?", "Should I [X]?"

```markdown
## Advantages and Disadvantages of [Topic]

[1-sentence overview of the evaluation context]

### Pros

- **[Benefit category]**: [Specific explanation]
- **[Benefit category]**: [Specific explanation]
- **[Benefit category]**: [Specific explanation]

### Cons

- **[Drawback category]**: [Specific explanation]
- **[Drawback category]**: [Specific explanation]
- **[Drawback category]**: [Specific explanation]

**Verdict**: [1-2 sentence balanced conclusion with recommendation]
```

#### FAQ Block

Use for topic pages with multiple common questions. Essential for FAQ schema.

```markdown
## Frequently Asked Questions

### [Question phrased exactly as users search]?

[Direct answer in first sentence]. [Supporting context in 2-3 additional sentences].

### [Question phrased exactly as users search]?

[Direct answer in first sentence]. [Supporting context in 2-3 additional sentences].
```

**Tips for FAQ questions:**
- Use natural question phrasing ("How do I..." not "How does one...")
- Include question words: what, how, why, when, where, who, which
- Match "People Also Ask" queries from search results
- Keep answers between 50-100 words

#### Listicle Block

Use for "Best [X]", "Top [X]", "[Number] ways to [X]" queries.

```markdown
## [Number] Best [Items] for [Goal/Purpose]

[1-2 sentence intro establishing context and selection criteria]

### 1. [Item Name]

[Why it's included in 2-3 sentences with specific benefits]

### 2. [Item Name]

[Why it's included in 2-3 sentences with specific benefits]

### 3. [Item Name]

[Why it's included in 2-3 sentences with specific benefits]
```

### Generative Engine Optimization (GEO) Patterns

These patterns optimize content for citation by AI assistants like ChatGPT, Claude, Perplexity, and Gemini.

#### Statistic Citation Block

Statistics increase AI citation rates by 15-30%. Always include sources.

```markdown
[Claim statement]. According to [Source/Organization], [specific statistic with number and timeframe]. [Context for why this matters].
```

**Example:**
```markdown
Mobile optimization is no longer optional for SEO success. According to Google's 2024 Core Web Vitals report, 70% of web traffic now comes from mobile devices, and pages failing mobile usability standards see 24% higher bounce rates. This makes mobile-first indexing a critical ranking factor.
```

#### Expert Quote Block

Named expert attribution adds credibility and increases citation likelihood.

```markdown
"[Direct quote from expert]," says [Expert Name], [Title/Role] at [Organization]. [1 sentence of context or interpretation].
```

#### Authoritative Claim Block

Structure claims for easy AI extraction with clear attribution.

```markdown
[Topic] [verb: is/has/requires/involves] [clear, specific claim]. [Source] [confirms/reports/found] that [supporting evidence]. This [explains/means/suggests] [implication or action].
```

#### Self-Contained Answer Block

Create quotable, standalone statements that AI can extract directly.

```markdown
**[Topic/Question]**: [Complete, self-contained answer that makes sense without additional context. Include specific details, numbers, or examples in 2-3 sentences.]
```

#### Evidence Sandwich Block

Structure claims with evidence for maximum credibility.

```markdown
[Opening claim statement].

Evidence supporting this includes:
- [Data point 1 with source]
- [Data point 2 with source]
- [Data point 3 with source]

[Concluding statement connecting evidence to actionable insight].
```

### Domain-Specific GEO Tactics

Different content domains benefit from different authority signals.

**Technology Content**
- Emphasize technical precision and correct terminology
- Include version numbers and dates for software/tools
- Reference official documentation
- Add code examples where relevant

**Health/Medical Content**
- Cite peer-reviewed studies with publication details
- Include expert credentials (MD, RN, etc.)
- Note study limitations and context
- Add "last reviewed" dates

**Financial Content**
- Reference regulatory bodies (SEC, FTC, etc.)
- Include specific numbers with timeframes
- Note that information is educational, not advice
- Cite recognized financial institutions

**Legal Content**
- Cite specific laws, statutes, and regulations
- Reference jurisdiction clearly
- Include professional disclaimers
- Note when professional consultation is advised

**Business/Marketing Content**
- Include case studies with measurable results
- Reference industry research and reports
- Add percentage changes and timeframes
- Quote recognized thought leaders

### Voice Search Optimization

Voice queries are conversational and question-based. When optimizing for voice assistants:

- Lead with a direct answer (under 30 words ideal)
- Use natural, conversational language
- Phrase headings as full questions ("How do I...", "What is...", "Where can I find...")
- Avoid jargon unless targeting an expert audience
- Include local context where relevant

---

## Common Mistakes

- **Ignoring AI search entirely.** ~47% of Google searches now show AI Overviews, and ChatGPT/Perplexity are growing fast.
- **Treating AEO as separate from SEO.** Good traditional SEO is the foundation. AEO adds structure and authority on top.
- **Writing for AI, not humans.** If content reads like it was written to game an algorithm, it won't get cited or convert.
- **No freshness signals.** Undated content loses to dated content. AI systems weight recency heavily. Show when content was last updated.
- **Gating all content.** AI can't access gated content. Keep your most authoritative content open.
- **Ignoring third-party presence.** 85% of brand mentions in top-of-funnel queries come from third-party sources, not your own site.
- **No structured data.** Schema markup gives AI systems structured context about your content. It's no longer optional.
- **Keyword stuffing.** Unlike traditional SEO where it's just ineffective, keyword stuffing actively reduces AI visibility by 10% (Princeton GEO study).
- **Blocking AI bots.** If GPTBot, PerplexityBot, or ClaudeBot are blocked in robots.txt, those platforms can't cite you.
- **Generic content without data.** "We're the best" won't get cited. "Our customers see 3x improvement in [metric]" will.
- **Forgetting to monitor.** You can't improve what you don't measure. Check AI visibility monthly at minimum.
- **Vague, entity-poor language.** "Our solution helps businesses" tells AI nothing. Specific products, industries, and outcomes are what get cited.

---

## Deep Research Prompts for AEO Audits

Comprehensive audit prompts exist for running deep AEO assessments using AI research tools (Claude deep research, Perplexity Deep Research, or Gemini Deep Research). Two versions are available:

**B2B Version** — Designed for SaaS, manufacturing, professional services, and other B2B companies. Features a tiered source credibility system (high: major publications/analysts; medium: company sites/trade press; low: forum/blog/social), insistence on verbatim quotes with URLs and publication dates, misinformation detection, and a content gap plan deliverable. Covers 10 topic dimensions: definitions, how it works, performance and proof, comparisons, pricing, use cases, limitations, customer sentiment, thought leadership, and implementation.

**B2C Version** — Adapted for banks, insurance, healthcare, home services, legal, real estate, and other consumer-facing businesses. Uses different source tiers (NerdWallet, Bankrate, Consumer Reports, J.D. Power, Google Reviews vs. Gartner and Forrester), different topic dimensions (brand reputation, customer experience, local presence, life-event triggers), and a faster freshness window (1 year vs. 2 years, since rates, fees, and hours go stale faster).

Both versions include a quick-start stripped-down version for people who find the full prompt intimidating, plus tool-specific guidance (Claude, Perplexity, and Gemini handle deep research differently).

Contact the guide author for the full prompt text.

---

## Further Reading

### Key Reports and Research

- **AirOps 2026 State of AI Search Report** — Citation patterns, freshness data, brand visibility statistics
- **Princeton GEO Study (KDD 2024)** — Research-backed optimization methods and their measured impact on AI visibility
- **Webflow "AEO for the CMO: An Actionable Maturity Model"** — The five-level maturity framework
- **Webflow State of the Web Report** — Marketing leader survey data on AI search adoption
- **SE Ranking Domain Authority Study** — Analysis of 129,000 domains and ChatGPT citation patterns
- **ZipTie Content-Answer Fit Analysis** — 400,000-page study of what determines ChatGPT citation likelihood

### Industry Sources

- AirOps Blog (airops.com/blog) — AEO audit checklists, trend reports, expert roundups
- Webflow AEO Solutions Hub (webflow.com/solutions/aeo) — Maturity model, tooling, guides
- Josh Grant / Stacked GTM (stackedgtm.ai) — "The Definitive 2026 Guide to AEO," comprehension layer concept
