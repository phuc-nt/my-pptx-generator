import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wrappedLines, textHeight, capacityFor } from '../src/text.js';

test('capacity follows width / (size * 0.52)', () => {
  assert.equal(capacityFor(400, 16), 48);
  assert.equal(capacityFor(10, 40), 1);
});

test('wraps on words, keeps explicit newlines', () => {
  const lines = wrappedLines('Skill gọi bằng lệnh, có bước, có rule, có khuôn', 380, 16);
  assert.deepEqual(lines, ['Skill gọi bằng lệnh, có bước, có rule, có', 'khuôn']);
  assert.deepEqual(wrappedLines('a\n\nb', 100, 10), ['a', '', 'b']);
});

test('height = size + (n-1) * size * lineHeight', () => {
  assert.equal(textHeight('one line', 400, 16), 16);
  assert.equal(textHeight('x'.repeat(10) + ' ' + 'y'.repeat(10), 100, 10, 1.5), 25);
});
