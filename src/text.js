// Text measurement model. Deliberately simple and deterministic: the same
// function drives the overflow/collision checks, the SVG preview and the box
// sizes handed to PowerPoint, so what the check says matches what you see.
//
// capacity = characters per line ≈ width / (fontSize * CHAR_W)
// CHAR_W = 0.52 is a conservative average glyph advance for Latin sans fonts
// (Vietnamese diacritics do not widen glyphs). Real fonts wrap slightly
// earlier or later; keep ≥10 % slack in every text box.
export const CHAR_W = 0.52;

export function capacityFor(width, size) {
  return Math.max(1, Math.floor(width / (size * CHAR_W)));
}

export function wrappedLines(value, width, size) {
  const cap = capacityFor(width, size);
  const out = [];
  for (const para of String(value ?? '').split('\n')) {
    if (!para) { out.push(''); continue; }
    let line = '';
    for (const word of para.split(/\s+/).filter(Boolean)) {
      if (line && line.length + word.length + 1 > cap) { out.push(line); line = ''; }
      if (word.length > cap) {
        if (line) { out.push(line); line = ''; }
        for (let pos = 0; pos < word.length; pos += cap) {
          const chunk = word.slice(pos, pos + cap);
          if (pos + cap < word.length) out.push(chunk); else line = chunk;
        }
      } else {
        line = line ? `${line} ${word}` : word;
      }
    }
    out.push(line);
  }
  return out;
}

export function textMetrics(node) {
  const size = Number(node.style?.fontSize ?? 24);
  const lineHeight = Number(node.style?.lineHeight ?? 1.3);
  const lines = wrappedLines(node.text ?? '', node.width, size);
  const height = size + (lines.length - 1) * size * lineHeight;
  return { size, lineHeight, lines, height, bottom: node.y + height };
}

/** Height a text box needs; use when constructing nodes. */
export function textHeight(text, width, size, lineHeight = 1.3) {
  const n = wrappedLines(text, width, size).length;
  return size + (n - 1) * size * lineHeight;
}
