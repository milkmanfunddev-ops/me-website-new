# Query Fan-Out, Answer Blocks & Entity-Rich Language

## Contents
- [Query Fan-Out](#query-fan-out)
- [The AEO Answer Block Formula](#the-aeo-answer-block-formula)
- [FAQs: The Secret Weapon](#faqs-the-secret-weapon)
- [Entity-Rich Language](#entity-rich-language)
- [Structural Rules](#structural-rules)

---

## Query Fan-Out

Query fan-out is how AI systems expand a single user query into multiple sub-queries to capture different aspects of what the user might need. When someone asks "What's the best project management tool?", an AI system might internally decompose that into:

- What are the top-rated project management tools?
- What features matter most in project management software?
- How do project management tools compare on pricing?
- What do users say about [specific tools]?

Understanding fan-out tells you what content to create. Each sub-query is an opportunity for your content to be retrieved and cited.

### The 5 + 3 + 3 Formula

From a single base question, generate 11 variations:

- **Core question**: Restate the base question clearly
- **What/Why/How variations (5)**: Questions exploring definition, reasoning, and process
- **Contextual variations (3)**: Questions tied to specific use cases, industries, or scenarios
- **Industry-specific variations (3)**: Questions using terminology from the target sector

### Example

Base question: "What is the best project management tool?"

Fan-out:
- "What is the best project management tool for a 15-person team?"
- "...that integrates with Slack?"
- "...that can have multiple people assigned to the same task?"
- "How many team members can use [tool]?"
- "What's the pricing for a 20-person team?"
- "How long does setup take?"

### Where to Find Fan-Out Topics

- Google People Also Ask
- Support tickets and customer emails
- Sales call recordings and chat transcripts
- Reddit and community threads
- Google Search Console keyword data
- Tools: AlsoAsked, AnswerThePublic, Profound, Scrunch, PromptWatch

---

## The AEO Answer Block Formula

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

### Guidelines

- Keep Answer Blocks under 200 words
- Focus on one question per block
- Use entity-rich language throughout
- Always include the follow-up questions (fan-out)

---

## FAQs: The Secret Weapon

FAQs on product pages are one of the most powerful AEO tactics because:
- They directly match how people ask questions to LLMs
- They naturally address query fan-out (initial question + follow-ups)
- They provide structured, easily parseable content for AI engines
- They help humans AND LLMs simultaneously
- They can be wrapped in FAQPage schema for additional signal

Where to add FAQs: bottom of product pages, pillar pages, service pages, anywhere you're answering questions your audience actually asks.

Use real customer language from support tickets, sales calls, and community forums. Not the questions you want customers to ask — the questions they actually ask.

---

## Entity-Rich Language

AI engines need specifics to cite you confidently. Vague language gets skipped; entity-rich language gets cited.

| Instead of... | Try... |
|---------------|--------|
| "Our solution helps businesses" | "Our [specific product name] helps [specific industry] companies reduce [specific problem] by [specific method]" |
| "We offer great customer service" | "[Company] provides 24/7 technical support with average response times under 2 hours" |
| "Industry-leading technology" | "[Product] uses [specific technology] to achieve [specific measurable outcome]" |

Entity-rich language includes:
- Proper nouns (product names, company names, industry terms)
- Specific numbers and measurements
- Named technologies and methodologies
- Industry-specific terminology
- Named standards and regulations

---

## Structural Rules

AI systems chunk content into ~200-500 token passages and retrieve the most relevant ones independently. Each passage is evaluated on its own.

This means:
- Every section needs to work as a standalone unit
- A brilliant answer buried in a rambling paragraph gets skipped
- Clear headings help the system match passages to queries
- Short, self-contained paragraphs beat long, flowing prose

**Formatting rules:**
- Lead every section with a direct answer (don't bury it)
- Keep key answer passages to 40-60 words (optimal for snippet extraction)
- Use H2/H3 headings that match how people phrase queries
- Tables beat prose for comparison content
- Numbered lists beat paragraphs for process content
- Each paragraph should convey one clear idea
