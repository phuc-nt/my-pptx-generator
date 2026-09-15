---
name: pptx-deck
description: Turn source material in any format (markdown, HTML, Confluence pages, pasted text, PDFs you have read) into an editable PowerPoint deck. You are the editor; `mpg` is the compiler. Use when asked to make slides, a deck, a presentation, or a PPTX from documents.
---

# pptx-deck

You read the source, decide what the audience needs, write the deck as canonical JSON, and let `mpg` validate, preview and export it. **There is no markdown→slides converter and there should not be**: a deck is a rewrite, not a reflow.

## Workflow (do not skip steps)

1. **Read all source material first.** Note the audience, the decision they must make, and the 5–12 claims that support it. If the source has tables, they are usually the best slide content.
2. **Outline before layout.** One line per slide: `n. <headline as a claim> — <layout>`. Headlines state conclusions ("Ba vùng gần như không chồng nhau"), never topics ("Tools"). Aim for 8–14 slides for a 400-line source.
3. **Write the JSON** (`mpg init deck.json` for a starter). Use a build script (Python/Node) when the deck has repeated structures; compute text box heights with the formula in [references/layout.md](references/layout.md) instead of guessing.
4. **`mpg validate deck.json --fit`** — fix every error and read every warning. `text-collision` and `text-tight-card` are real defects even though each box "fits".
5. **`mpg render deck.json --out out/`** then **Read `out/sheet.png`** and every page PNG that has dense content. Look for: lines wrapping where you did not intend, text touching card edges, orphan words, uneven card heights. The checker cannot see everything; you can.
6. Fix → validate → render again until the sheet is clean. Shorten copy before shrinking fonts.
7. **`mpg export deck.json --out deck.pptx`** (or `mpg build` for 4–7 in one command). Report the path, slide count, and any warnings you deliberately accepted.

## Rules that come from real failures

- **Fonts**: only use families that exist on the target machine (theme defaults are safe). A missing family renders as serif in previews and substitutes unpredictably in PowerPoint.
- **Copy length is a layout decision.** If a heading wraps to 3 lines, cut words; do not drop the font size below the page's scale.
- **Stacked text needs measured spacing.** Two rows 30px apart collide as soon as the upper one wraps. Slot rows by `textHeight()` + gap, never by eye.
- **Cards are shapes; text sits over them.** Leave ≥10px between the last text bottom and the card bottom, ≥24px padding on the sides.
- **Never rasterise.** Do not screenshot pages into image nodes; the whole point of the pipeline is that the recipient can edit text and shapes.
- **Vietnamese and other diacritics** are fine everywhere (PNG, PPTX); the wrap model treats them as single characters.
- **Speaker notes** (`page.notes`) are where the nuance goes; the slide keeps the claim.

## Layouts that work at 1280×720 (see references/layout.md for coordinates)

cover · claim + two cards · numbered list (5 rows) · three columns · table (4 cols × ≤8 rows) · timeline (5 stages) · decision list. Mixing 4–5 of these across a deck is enough; more variety reads as noise.

## Commands

```
mpg themes                      # carbon | ink | paper | slate
mpg init deck.json --theme carbon
mpg validate deck.json --fit    # exit 1 on errors; --strict also on warnings
mpg render deck.json --out out/ [--page 6] [--svg]
mpg export deck.json --out deck.pptx
mpg build deck.json --out out/  # validate + render + export
```
