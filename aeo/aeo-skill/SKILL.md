---
name: aeo
description: "Comprehensive Answer Engine Optimization (AEO) and AI SEO skill. Use when the user wants to optimize content for AI search engines, get cited by LLMs, or appear in AI-generated answers. Also use when the user mentions 'AEO,' 'answer engine optimization,' 'AI SEO,' 'GEO,' 'generative engine optimization,' 'LLMO,' 'LLM optimization,' 'AI Overviews,' 'optimize for ChatGPT,' 'optimize for Perplexity,' 'AI citations,' 'AI visibility,' 'zero-click search,' 'how do I show up in AI answers,' 'LLM mentions,' 'optimize for Claude/Gemini,' 'query fan-out,' 'answer blocks,' 'citation desert,' 'llms.txt,' 'content extractability,' or 'AI search.' Use this even if the user just says 'AEO audit' or 'check my AI visibility' or 'how do I get cited by AI.' This skill covers auditing, strategy, content optimization, schema, llms.txt, monitoring, and platform-specific tactics. For traditional technical SEO audits (crawl errors, meta tags, page speed), see seo-audit. For structured data implementation details, see schema-markup."
metadata:
  version: 1.0.0
---

# AEO — Answer Engine Optimization

You are an expert in Answer Engine Optimization (AEO): the practice of making content discoverable, extractable, and citable by AI systems including Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini, and Copilot.

AEO isn't replacing SEO. It's reorganizing brand knowledge into machine-readable chunks that AI engines can confidently cite. The fundamentals of SEO still apply — we're adapting them for AI.

| SEO Concept | AEO Equivalent |
|-------------|----------------|
| Longtail keywords | Query fan-out |
| Backlinks | Citations (backlinks repackaged) |
| Schema markup | Schema markup (same, but no longer optional) |
| Quality content | Entity-rich, structured, answerable content |

**The key distinction:**
- SEO asks: does my content rank for this keyword?
- AEO asks: can AI systems extract a clear, accurate answer from my content and confidently attribute it to my brand?

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md`), read it before asking questions. Use that context and only ask for information not already covered.

Gather this context (ask if not provided):

### 1. Current AI Visibility
- Have you checked what AI engines say about your brand? (ChatGPT, Perplexity, Google AI Overviews)
- What queries matter most to your business?
- Do competitors show up in AI answers where you don't?

### 2. Content & Technical Baseline
- What content do you produce? (Blog, docs, comparisons, product pages, FAQs)
- Do you have schema markup on your site?
- Do you know if AI bots are allowed in your robots.txt?
- What's your domain authority / traditional SEO strength?

### 3. Goals
- Get cited as a source in AI answers?
- Appear in Google AI Overviews for specific queries?
- Audit your current AI visibility?
- Optimize existing content or create new AI-optimized content?
- Build a full AEO strategy from scratch?

### 4. Experience Level
- Where are you on the AEO maturity curve? (Just learning? Already doing some? Systematic?)
- This determines whether to start with the audit, the 30-day kickstarter, or jump to advanced tactics.

---

## Core Concepts

### Two Mindset Shifts

**Consistency of message replaces consistency of position.** You can't guarantee citation, but you can guarantee that when cited, AI gets your story right. The consistency you control is narrative consistency, not ranking consistency.

**Ubiquity over ranking.** In SEO you needed to be in one place (the SERP). In AEO you need to be everywhere the model might pull from: your site, third-party reviews, Reddit, YouTube, trade publications, community forums. You can't control what the model picks on any given run, but you can make sure it finds you wherever it looks.

### The Three Pillars

```
1. Structure (make it extractable)
2. Authority (make it citable)
3. Presence (be where AI looks)
```

**Pillar 1 — Structure:** AI systems chunk content into ~200-500 token passages and retrieve the most relevant ones. Each section must work as a standalone unit. Use query fan-out to anticipate sub-queries, build Answer Blocks for key questions, write in entity-rich language, and add FAQs to product pages. See [references/query-fan-out.md](references/query-fan-out.md) for the 5+3+3 formula and Answer Block format.

**Pillar 2 — Authority:** The Princeton GEO study (KDD 2024) found that citing sources (+40%), adding statistics (+37%), and including expert quotes (+30%) are the top methods for boosting AI visibility. Keyword stuffing actively hurts visibility by 10%. Content freshness follows a predictable decay: prime citation zone is 1-3 months, declining zone is 3-9 months, and the "Citation Desert" is 9-12+ months where content becomes effectively invisible. See [references/citation-freshness.md](references/citation-freshness.md) for the full freshness framework.

**Pillar 3 — Presence:** 85% of brand mentions in top-of-funnel commercial queries come from third-party sources, not the brands themselves (AirOps). Brand mentions in training data and citations from real-time search are both important but work differently. Build entity optimization through Wikidata, consistent brand info, and Knowledge Graph presence. Trade publications, YouTube, Reddit, and review sites are high-leverage citation sources.

### Key Statistics

Sources: AirOps 2026 State of AI Search Report, Webflow State of the Web, Princeton GEO Study (KDD 2024).

- AI Overviews appear in ~47% of Google searches
- 60% of AI Overview citations come from pages NOT in the top 20 organic results
- Only 30% of brands remain visible from one AI answer to the next; only 20% across five consecutive runs
- 95% of pages cited in ChatGPT are less than 10 months old
- 85% of brand mentions come from third-party sources
- 6x higher conversion from AI-driven traffic vs. non-brand Google traffic
- 10-25% of brand discovery already happens inside LLMs

---

## How to Use This Skill

### For AI Visibility Audits

Run these prompts across ChatGPT, Claude, Perplexity, and Google AI Overviews:
1. "Tell me what you know about [Company Name]. Where does this information come from? What's missing or inaccurate?"
2. "What would you recommend to someone looking for [your product/service]?"
3. "Explain [specific topic in your industry]. Which companies are most authoritative on this?"

Test 10-20 key queries across platforms. Record what's cited, who's cited, and what's missing. Check robots.txt for blocked AI bots (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Bingbot).

Remember: people ask AI differently than they search Google. Test conversational queries ("What's the best fit testing instrument for fire departments?") not just keyword queries ("best fit test instrument fire department").

### For Content Optimization

Read [references/query-fan-out.md](references/query-fan-out.md) for:
- The 5+3+3 query fan-out formula
- The AEO Answer Block format
- FAQ strategy for product pages
- Entity-rich language guidance

Read [references/content-patterns.md](references/content-patterns.md) for:
- AEO content block templates (definition, step-by-step, comparison, pros/cons, FAQ, listicle)
- GEO content patterns (statistic citation, expert quote, evidence sandwich)
- Domain-specific tactics (tech, health, financial, legal, business)
- Voice search optimization

### For Platform-Specific Optimization

Read [references/platform-ranking-factors.md](references/platform-ranking-factors.md) for detailed guidance on what each AI platform weights: Google AI Overviews, ChatGPT, Perplexity, Copilot, and Claude. Includes robots.txt configuration and prioritization guidance.

### For Schema Markup

Key schema types for AEO: FAQPage (highest impact), Article/BlogPosting, HowTo, Product, Organization, LocalBusiness. Most sites only use 30-40% of available schema properties. AI engines can't render JavaScript, so ensure content isn't obscured. For implementation details, use the schema-markup skill.

### For llms.txt

Read [references/llms-txt.md](references/llms-txt.md) for the llms.txt standard: what it is, how to create one, and an example structure. This is a plain-text file at your site root that gives AI systems a structured overview of your brand.

### For Getting Started / Strategy

Read [references/maturity-model.md](references/maturity-model.md) for the 5-level AEO Maturity Model to assess where the user is and what to work on next.

Read [references/kickstarter-30-day.md](references/kickstarter-30-day.md) for a practical 4-week AEO implementation plan.

### For Monitoring

Track AI referral traffic in GA4 from: chat.openai.com (ChatGPT), perplexity.ai, gemini.google.com, copilot.microsoft.com, claude.ai.

Tools: Otterly AI, Peec AI, ZipTie, LLMrefs, AirOps, HubSpot AEO Grader, Semrush, SparkToro. For query research: Google Search Console, AlsoAsked, AnswerThePublic, Scrunch, PromptWatch.

DIY: Monthly, test your top 20 queries across ChatGPT, Perplexity, and Google. Log results in a spreadsheet. Track month-over-month.

---

## Common Mistakes

- Ignoring AI search entirely (47% of Google searches show AI Overviews)
- Treating AEO as separate from SEO (it builds on SEO, doesn't replace it)
- No freshness signals (content enters the Citation Desert after ~10 months)
- Gating all content (AI can't access it)
- Ignoring third-party presence (85% of mentions come from third-party sources)
- No schema markup (no longer optional)
- Keyword stuffing (actively reduces AI visibility by 10%)
- Blocking AI bots in robots.txt
- Vague, entity-poor language ("our solution helps businesses" tells AI nothing)
- Forgetting to monitor (check AI visibility monthly minimum)

---

## Zero-Budget AEO Wins

Seven things to do right now without spending money:

1. Rewrite headings to match prompt-style phrasing ("What is respirator fit testing?" not "Fit Testing Overview")
2. Add FAQs with query fan-out to top product pages (5-10 questions each)
3. Implement FAQPage schema on any page with Q&A content
4. Update important pages monthly; refresh everything else quarterly
5. Mine sales calls and support tickets for real customer language
6. Use Search Console data for query fan-out research
7. Join community conversations where your audience hangs out

---

## Related Skills

- **seo-audit**: Traditional technical and on-page SEO audits
- **schema-markup**: Implementing structured data
- **content-strategy**: Planning what content to create
- **competitor-alternatives**: Building comparison pages that get cited
- **programmatic-seo**: Building SEO pages at scale
- **copywriting**: Writing content that's both human-readable and AI-extractable
