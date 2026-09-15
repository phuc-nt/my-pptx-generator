# my-pptx-generator — agent instructions

Purpose: an agent (you) reads documents in any format, curates them, writes a
canonical deck JSON, and this CLI validates, previews and exports an **editable**
PPTX. No browser, no Chromium, no markdown converter.

- Making a deck? Follow `.claude/skills/pptx-deck/SKILL.md`. It is the workflow; the CLI is only the compiler.
- `examples/` is reference material, never output. Building an example and reporting it as the answer skips the entire job, even when it looks like it matches the source. Write a new deck JSON every time.
- The CLI is not installed globally: run it as `npx mpg …` or `node bin/mpg.js …`. A bare `mpg` exits 127.
- Run `npm test` after changing anything under `src/`. Tests encode real defects that earlier checks missed; do not weaken them.
- The wrap model in `src/text.js` is shared by checks, SVG preview and PPTX box sizing. Change it in one place or not at all.
- It measures glyph advances, not character counts: CJK is full-width (1.0em) against ~0.52em for Latin. Never work around a CJK layout problem by inserting manual `\n` — the renderer wraps too, so hand-breaks break twice and strand punctuation. Cut words instead.
- Never rasterise slides into images. `ppt/media/` in an exported file must stay empty unless the deck has image nodes.
- Themes only name fonts that ship with macOS/Windows/Office. Add a theme rather than editing an existing one's colours.
- Conventional commits, no AI attribution lines.
