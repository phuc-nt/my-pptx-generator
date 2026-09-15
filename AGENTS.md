# my-pptx-generator — agent instructions

Purpose: an agent (you) reads documents in any format, curates them, writes a
canonical deck JSON, and this CLI validates, previews and exports an **editable**
PPTX. No browser, no Chromium, no markdown converter.

- Making a deck? Follow `.claude/skills/pptx-deck/SKILL.md`. It is the workflow; the CLI is only the compiler.
- `examples/` is reference material, never output. `examples/orgf.json` is built from the same documents as a folder; building it and reporting it as the answer skips the entire job. Write a new deck JSON every time.
- Run `npm test` after changing anything under `src/`. Tests encode real defects that earlier checks missed; do not weaken them.
- The wrap model in `src/text.js` is shared by checks, SVG preview and PPTX box sizing. Change it in one place or not at all.
- Never rasterise slides into images. `ppt/media/` in an exported file must stay empty unless the deck has image nodes.
- Themes only name fonts that ship with macOS/Windows/Office. Add a theme rather than editing an existing one's colours.
- Conventional commits, no AI attribution lines.
