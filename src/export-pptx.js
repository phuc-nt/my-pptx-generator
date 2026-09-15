// Editable PPTX: every text node becomes a real text box, every shape a real
// shape. Nothing is rasterised, so the recipient can restyle in PowerPoint.
import PptxGenJS from 'pptxgenjs';
import { resolveColor, resolveFont } from './themes.js';

const PX = 96;                      // canvas px per inch
const hex = c => c.replace('#', '').toUpperCase();

export async function exportPptx(deck, theme, { baseDir = process.cwd() } = {}) {
  const pptx = new PptxGenJS();
  const first = deck.pages[0];
  pptx.defineLayout({ name: 'DECK', width: first.width / PX, height: first.height / PX });
  pptx.layout = 'DECK';
  pptx.title = deck.name;

  for (const page of deck.pages) {
    const slide = pptx.addSlide();
    slide.background = { color: hex(resolveColor(page.background, theme)) };
    // pages may differ in size; scale each into the deck's slide box
    const sx = first.width / page.width / PX, sy = first.height / page.height / PX;

    for (const node of page.nodes) {
      if (node.visible === false) continue;
      const base = { x: node.x * sx, y: node.y * sy, w: node.width * sx, h: node.height * sy, rotate: node.rotation ?? 0 };
      const transparency = Math.round((1 - (node.opacity ?? 1)) * 100);

      if (node.type === 'text') {
        const st = node.style ?? {};
        const weight = st.fontWeight === 'bold' ? 700 : Number(st.fontWeight ?? 400);
        slide.addText(node.text, {
          ...base,
          fontFace: resolveFont(st.fontFamily, theme),
          fontSize: Number(st.fontSize ?? 24) * 0.75,
          color: hex(resolveColor(st.fill ?? '$text', theme)),
          bold: weight >= 600, italic: st.fontStyle === 'italic',
          align: st.textAlign ?? 'left', valign: 'top',
          lineSpacingMultiple: Number(st.lineHeight ?? 1.3),
          charSpacing: st.letterSpacing ? Number(st.letterSpacing) * 0.75 : undefined,
          margin: 0, transparency, wrap: true, fit: 'none',
        });
      } else if (node.type === 'shape') {
        const st = node.style ?? {};
        const kind = st.shape ?? 'rect';
        if (kind === 'line') {
          slide.addShape(pptx.ShapeType.line, { ...base, line: { color: hex(resolveColor(st.stroke ?? st.fill ?? '$border', theme)), width: (st.strokeWidth ?? 1) * 0.75, transparency } });
          continue;
        }
        const radius = st.borderRadius ?? theme.radius ?? 0;
        const type = kind === 'ellipse' ? pptx.ShapeType.ellipse : radius > 0 ? pptx.ShapeType.roundRect : pptx.ShapeType.rect;
        const opts = { ...base, fill: st.fill === 'none' ? { type: 'none' } : { color: hex(resolveColor(st.fill ?? '$surface', theme)), transparency } };
        if (st.stroke) opts.line = { color: hex(resolveColor(st.stroke, theme)), width: (st.strokeWidth ?? 1) * 0.75 };
        else opts.line = { type: 'none' };
        if (type === pptx.ShapeType.roundRect) opts.rectRadius = Math.min(radius * sx, Math.min(base.w, base.h) / 2);
        slide.addShape(type, opts);
      } else if (node.type === 'image') {
        const src = node.src.startsWith('data:') ? { data: node.src } : { path: new URL(node.src, `file://${baseDir}/`).pathname };
        const sizing = node.fit ? { sizing: { type: node.fit, w: base.w, h: base.h } } : {};
        slide.addImage({ ...base, ...src, ...sizing, transparency });
      }
    }
    if (page.notes) slide.addNotes(page.notes);
  }
  return Buffer.from(await pptx.write({ outputType: 'nodebuffer' }));
}
