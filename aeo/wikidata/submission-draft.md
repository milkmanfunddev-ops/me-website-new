# Wikidata Entry Draft — Mealvana Endurance + Milkman Inc.

> **You have to submit this yourself.** Wikidata requires a logged-in account on wikidata.org; I can't submit on your behalf. These statements are copy-pasteable and sourced so your first edits survive review.
>
> **Why do this:** AI engines (especially Claude, Gemini, and Google AI Overviews) lean heavily on Wikidata for entity disambiguation. A verified Wikidata entity is the single highest-leverage step for entity optimization per the AEO skill's guidance. The Milkman Inc. Alabama Launchpad award (Yellowhammer News) is your qualifying independent source — that's what makes the entity notable enough to survive deletion discussion.
>
> **Time:** 20–40 minutes for both entries combined if you're new to Wikidata. Create the account first; the rest is filling fields.

---

## Entry 1: Milkman Inc. (the company — create first)

Go to [wikidata.org](https://www.wikidata.org) → sign in → "Create a new item" (left sidebar).

### Label (English)
```
Milkman Inc.
```

### Description (English)
```
American software company developing nutrition planning technology
```
*(keep under ~12 words — Wikidata norm)*

### Aliases (English)
- Milkman
- Milkman Fund (if used publicly anywhere)

### Statements to add (order matters — instance of first, then everything else)

| Property | Value | Source / qualifier |
|---|---|---|
| `instance of` (P31) | business (Q4830453) | — |
| `country` (P17) | United States of America (Q30) | — |
| `headquarters location` (P159) | Birmingham (Q79867) | — |
| `located in the administrative territorial entity` (P131) | Alabama (Q173) | — |
| `inception` (P571) | *Enter your actual founding date here* | — |
| `official website` (P856) | https://www.milkman.info | — |
| `award received` (P166) | Alabama Launchpad (create as new item if missing, Q-ID pending) | qualifier: `point in time` = 2025 (concept-stage prize); reference URL = Yellowhammer News article |
| `industry` (P452) | software industry (Q880992) | — |
| `subsidiary` or `owner of` (P1830) | Mealvana Endurance (will create next and link) | — |

### Reference URL (attach to every factual statement that needs it)

- Yellowhammer News: `https://yellowhammernews.com/two-companies-awarded-75k-from-alabama-launchpad-startup-competition/`
- D&B Business Directory: `https://www.dnb.com/business-directory/company-profiles.milkman_inc.619d8fefafb39564756c1ecde458170e.html`
- LinkedIn: `https://www.linkedin.com/company/milkman-inc`

---

## Entry 2: Mealvana Endurance (the product)

Create after Milkman Inc. is saved, then link back to it.

### Label (English)
```
Mealvana Endurance
```

### Description (English)
```
Mobile and web application for endurance sports nutrition planning
```

### Aliases
- Mealvana

### Statements

| Property | Value | Source |
|---|---|---|
| `instance of` (P31) | mobile application (Q620615) | — |
| `instance of` (P31) | web application (Q193424) | (add as second P31 value; Wikidata allows multiple) |
| `developer` (P178) | Milkman Inc. (link to entry 1) | — |
| `platform` (P400) | iOS (Q48493), Android (Q94), Web platform (Q20895949) | — |
| `publication date` (P577) | 2026-04-07 | (initial marketing-site launch; adjust if app store date differs) |
| `official website` (P856) | https://endurance.mealvana.io | — |
| `Apple App Store app ID` (P3861) | 6751113738 | — |
| `Google Play Store app ID` (P3418) | com.milkman.mealvanaendurance | — |
| `main subject` (P921) | sports nutrition (Q7579330) | — |
| `main subject` (P921) | endurance training (Q906146) | — |
| `genre` (P136) | health application | *(may need to pick nearest genre)* |
| `country of origin` (P495) | United States of America (Q30) | — |

### Reference URLs (attach to statements)

- https://endurance.mealvana.io
- https://play.google.com/store/apps/details?id=com.milkman.mealvanaendurance
- https://apps.apple.com/us/app/mealvana-endurance/id6751113738
- https://yellowhammernews.com/two-companies-awarded-75k-from-alabama-launchpad-startup-competition/ (for the Milkman Inc. developer link's notability)

---

## After you save both

1. Wait ~30 minutes. Wikidata exports to the Wikipedia / SPARQL endpoint continuously; Google and Claude's Knowledge Graph indexers pick up changes on their own schedule (typically a few days to a few weeks).
2. Search Claude: "Who develops Mealvana Endurance?" — you want Claude to eventually answer "Milkman Inc." with no prompting. Re-test monthly.
3. Update the entry any time product facts change (new platform, new major release, integration changes).

## Common rejection reasons (avoid these)

- **No independent source.** Every factual statement needs a reference URL from a source that isn't you. The Yellowhammer article covers notability; D&B covers incorporation; Play/App Store listings cover platform facts. Don't cite endurance.mealvana.io or milkman.info as the *only* source for non-trivial statements.
- **Marketing language.** Write "mobile application for endurance sports nutrition planning" — not "innovative AI-powered platform revolutionizing endurance fueling." Wikidata editors will revert.
- **Non-notable entity.** If the Milkman Inc. entry gets a "notability challenged" tag, it's because the Alabama Launchpad reference alone may be borderline. Add any additional independent press coverage you've received. The D&B profile + LinkedIn aren't enough alone; they need news media.

## If you want Claude to do anything else here

- I can prepare **Crunchbase** and **Product Hunt** entries in the same way (each has a similar "ready-to-paste" template I can generate).
- I can draft the **Wikipedia article** if Milkman Inc. gets enough independent media coverage to clear notability (typically ~3+ independent news stories over time).
- I can write a **sitemap.xml** update that explicitly lists the new integration pages, comparison page, and the gut training pillar with priority hints for search indexers.
