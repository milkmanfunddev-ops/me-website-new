# llms.txt: A Standard for AI Discoverability

## What It Is

`llms.txt` is a proposed web standard that provides LLMs with a structured, plain-text summary of your website. Think of it as the AI equivalent of combining robots.txt (access instructions) with a sitemap (content map) into a format specifically designed for language models.

You place a plain-text file at your site root (`yoursite.com/llms.txt`) that gives AI systems a structured overview of who you are, what you do, and where your most important content lives. Unlike HTML pages that require parsing, llms.txt is immediately readable by any language model.

---

## llms.txt vs. llms-full.txt

| File | Purpose | Length |
|------|---------|--------|
| `llms.txt` | Summary overview: key facts, main pages, product descriptions | Short (1-2 pages) |
| `llms-full.txt` | Comprehensive reference: full product details, documentation, FAQs, specs | As long as needed |

---

## What to Include

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

---

## Implementation Notes

- Host at your site root: `yoursite.com/llms.txt`
- Use plain text / markdown formatting (not HTML)
- Keep llms.txt concise — save comprehensive info for llms-full.txt
- Update when products, services, or key pages change
- Include the most important entity information (what you are, what you do, who you serve)
- Use the same terminology and product names you use everywhere else (narrative consistency)

---

## Current Status

llms.txt is an emerging standard, not yet universally adopted. Early adopters gain an advantage: providing structured, LLM-optimized content at a known URL makes it easier for AI systems to understand and cite your brand accurately. The cost of implementation is minimal (it's a text file), and the downside risk is zero.
