import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseDeck } from '../src/schema.js';
import { resolveTheme } from '../src/themes.js';
import { exportPptx } from '../src/export-pptx.js';
import { renderPagePng } from '../src/render-png.js';

const raw = JSON.parse(readFileSync(new URL('../examples/minimal.json', import.meta.url), 'utf8'));

test('pptx is a zip with one slide per page, no raster media, real text runs', async () => {
  const deck = parseDeck(raw);
  const buf = await exportPptx(deck, resolveTheme(deck.theme));
  assert.equal(buf.subarray(0, 2).toString(), 'PK');
  const dir = mkdtempSync(join(tmpdir(), 'mpg-'));
  const file = join(dir, 'd.pptx');
  writeFileSync(file, buf);
  const listing = execFileSync('unzip', ['-l', file]).toString();
  assert.equal((listing.match(/ppt\/slides\/slide\d+\.xml/g) ?? []).length, deck.pages.length);
  // pptxgenjs always emits an empty ppt/media/ directory entry; only files matter
  assert.ok(!/ppt\/media\/\S+/.test(listing), 'no media files expected');
  const slide1 = execFileSync('unzip', ['-p', file, 'ppt/slides/slide1.xml']).toString();
  assert.ok(slide1.includes('<a:t>'), 'text runs present');
  assert.ok(!slide1.includes('<p:pic>'), 'no pictures');
  assert.ok(/typeface="Arial"/.test(slide1));
});

test('png preview renders', () => {
  const deck = parseDeck(raw);
  const png = renderPagePng(deck, deck.pages[0], resolveTheme(deck.theme), { width: 640 });
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
});
