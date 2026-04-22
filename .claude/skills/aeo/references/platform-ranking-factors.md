# How Each AI Platform Picks Sources

## Contents
- [The Fundamentals](#the-fundamentals)
- [Google AI Overviews](#google-ai-overviews)
- [ChatGPT](#chatgpt)
- [Perplexity](#perplexity)
- [Microsoft Copilot](#microsoft-copilot)
- [Claude](#claude)
- [Allowing AI Bots in robots.txt](#allowing-ai-bots-in-robotstxt)
- [Where to Start](#where-to-start)

---

## The Fundamentals

Every AI platform shares three baseline requirements:

1. **Your content must be in their index.** Each platform uses a different search backend (Google, Bing, Brave, or their own). If you're not indexed, you can't be cited.
2. **Your content must be crawlable.** AI bots need access via robots.txt. Block the bot, lose the citation.
3. **Your content must be extractable.** AI systems pull passages, not pages. Clear structure and self-contained paragraphs win.

---

## Google AI Overviews

Google AI Overviews pull from Google's own index and lean heavily on E-E-A-T signals. They appear in roughly 47% of Google searches (AirOps, early 2026).

**What makes them different:** They already have your traditional SEO signals — backlinks, page authority, topical relevance. The AI layer adds a preference for content with cited sources and structured data. Including authoritative citations correlates with a 132% visibility boost, and an authoritative (not salesy) tone adds another 89%.

**AI Overviews don't just recycle the Top 10.** Only about 15% of sources overlap with conventional organic results. Pages outside page 1 can still get cited with strong structured data and extractable answers.

**What to focus on:**
- Schema markup is the single biggest lever (Article, FAQPage, HowTo, Product — 30-40% visibility boost)
- Build topical authority through content clusters with strong internal linking
- Include named, sourced citations in your content
- Author bios with real credentials (E-E-A-T is weighted heavily)
- Get into Google's Knowledge Graph (an accurate Wikipedia entry helps)
- Target "how to" and "what is" query patterns — these trigger AI Overviews most often

---

## ChatGPT

ChatGPT's web search draws from a Bing-based index, combining training knowledge with web sources.

**What makes it different:** Domain authority matters more here. SE Ranking's analysis of 129,000 domains found authority/credibility signals account for ~40% of citation determination, content quality ~35%, platform trust ~25%. Sites with 350K+ referring domains average 8.4 citations per response.

**Freshness is a major differentiator.** Content updated within 30 days gets cited ~3.2x more often than older content.

**Content-answer fit is the most important signal.** ZipTie's analysis of 400,000 pages found that matching ChatGPT's own response format accounts for ~55% of citation likelihood — far more than domain authority (12%) or on-page structure (14%). Write the way ChatGPT would answer the question.

**Third-party sources:** Wikipedia = 7.8% of citations, Reddit = 1.8%, Forbes = 1.1%.

**What to focus on:**
- Invest in backlinks and domain authority
- Update competitive content at least monthly
- Structure content conversationally, matching how ChatGPT formats responses
- Include verifiable statistics with named sources
- Clean heading hierarchy (H1 > H2 > H3) with descriptive headings

---

## Perplexity

Always cites sources with clickable links. Combines its own index with Google's, running results through multiple reranking passes.

**What makes it different:** Most "research-oriented" AI search engine. Maintains curated lists of authoritative domains that get ranking boosts. Uses time-decay algorithm that evaluates new content quickly.

**Unique content preferences:**
- **FAQ Schema (JSON-LD)** — Pages with FAQ structured data get cited more often
- **PDF documents** — Publicly accessible PDFs are prioritized. Consider ungating authoritative PDF content.
- **Publishing velocity** — How frequently you publish matters more than keyword targeting
- **Self-contained paragraphs** — Prefers atomic, semantically complete paragraphs

**What to focus on:**
- Allow PerplexityBot in robots.txt
- Implement FAQPage schema on Q&A content
- Host PDF resources publicly (whitepapers, guides, reports)
- Add Article schema with publication and modification timestamps
- Write self-contained paragraphs that work as standalone answers
- Build deep topical authority in your niche

---

## Microsoft Copilot

Embedded across Edge, Windows, Microsoft 365, and Bing Search. Relies entirely on Bing's index.

**What makes it different:** LinkedIn and GitHub mentions provide ranking boosts. Page speed matters more — sub-2-second load times are a clear threshold.

**What to focus on:**
- Submit your site to Bing Webmaster Tools
- Use IndexNow protocol for faster indexing
- Optimize page speed to under 2 seconds
- Write clear, explicit entity definitions
- Build presence on LinkedIn and GitHub if relevant
- Ensure Bingbot has full crawl access

---

## Claude

Uses Brave Search as its search backend — not Google, not Bing. A completely different index.

**What makes it different:** Extremely selective about what it cites. Very low citation rate. Looks for the most factually accurate, well-sourced content on a topic. Data-rich content with specific numbers and clear attribution significantly outperforms general content.

**What to focus on:**
- Verify your content appears in Brave Search (search.brave.com)
- Allow ClaudeBot and anthropic-ai in robots.txt
- Maximize factual density — specific numbers, named sources, dated statistics
- Clear, extractable structure with descriptive headings
- Cite authoritative sources within your content
- Aim to be the most factually accurate source on your topic

---

## Allowing AI Bots in robots.txt

Each AI platform has its own bot. If blocked, that platform can't cite you.

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

**Training vs. search:** Some bots handle both training and search citation. GPTBot does both for OpenAI. You can safely block **CCBot** (Common Crawl) without affecting AI search citations — it's only used for training dataset collection.

---

## Where to Start

**Priority order based on reach:**

1. **Google AI Overviews** — 47%+ of Google searches. Add schema, cited sources, E-E-A-T signals.
2. **ChatGPT** — Most-used standalone AI search tool. Focus on freshness, domain authority, content-answer fit.
3. **Perplexity** — Valuable for researchers and early adopters. FAQ schema, PDF resources, self-contained paragraphs.
4. **Copilot and Claude** — Lower priority unless audience skews enterprise/Microsoft or developer/analyst.

**Actions that help everywhere:**
1. Allow all AI bots in robots.txt
2. Implement schema markup (FAQPage, Article, Organization minimum)
3. Include statistics with named sources
4. Update content monthly for competitive topics
5. Clear heading structure (H1 > H2 > H3)
6. Page load time under 2 seconds
7. Author bios with credentials
