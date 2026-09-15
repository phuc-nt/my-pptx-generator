# Layout reference (1280 × 720 canvas, px @ 96 dpi → 13.33 × 7.5 in)

## Grid

| Token | Value |
|---|---|
| Side margin `M` | 72 |
| Content width `CW` | 1136 (= 1280 − 2·72) |
| Eyebrow y | 56 (15px, weight 600, `$muted`, letterSpacing 1.5) |
| Title y | 106–140 (46–52px heading, lineHeight 1.15) |
| Body start y | ≥ 200 |
| Bottom safe y | ≤ 650 |
| Card padding | 24–32 |
| Column gap | 24–25 |

Font scale (px): title 52 · section 46 · card heading 22–28 · body 16–17 · caption 13–15. Minimum 12.

## Text height (the same formula the checker uses)

```
capacity = floor(width / (fontSize × 0.52))      # characters per line
lines    = greedy word wrap at `capacity` (explicit \n always breaks)
height   = fontSize + (lines − 1) × fontSize × lineHeight   # lineHeight default 1.3
box.height = ceil(height) + 6                     # keep ≥ 6px slack
```

Python helper to paste into a build script:

```python
import math
def wrapped(v, w, s):
    cap = max(1, math.floor(w / (s * 0.52))); out = []
    for para in v.split('\n'):
        if not para: out.append(''); continue
        line = ''
        for word in para.split():
            if line and len(line) + len(word) + 1 > cap: out.append(line); line = ''
            line = f'{line} {word}'.strip() if line else word
        out.append(line)
    return out
def text_h(v, w, s, lh=1.3):
    n = len(wrapped(v, w, s)); return s + (n - 1) * s * lh
```

Stacking rule: `next.y = prev.y + text_h(prev) + gap` — never a fixed offset.

## Named layouts

**Cover** — accent bar `(0,0,14,720)`; eyebrow; title 72–78px at y=190 (2 lines max); subtitle 26px `$muted` at y≈430 (width 900); rule `(72,560,1136,3,$accent)`; goal line 19px bold at y=588.

**Claim + two cards** — title at 140 (2 lines); cards `(72,330,548,230)` and `(660,330,548,230)` fill `$surface`; card heading 26px at card.y+36; body 17px `$muted` at card.y+80, width 484; footer 16px at 604.

**Numbered list (5 rows)** — start y=212, row pitch 90: number 30px `$accent` at x=72 (w 54); heading 22px bold at x=142 (w 400); body 17px `$muted` at x=562 (w 646); 1px `$border` divider at row.y+68.

**Three columns** — width 362, gap 25, x = 72 + i·387; card `(x,240,362,340)` with 5px `$accent` top bar; name 28px at +32; zone 16px `$muted` at +74; body 17px at +140; divider at +228; label 13px at +246; note 16px `$muted` at +268.

**Table** — header row 13px `$muted` letterSpacing 1 at y=200 with 2px `$text` rule under it; rows pitch 52, alternating `$surface` bands for emphasised rows; column x: 72 / 334 / 778 / 1022.

**Timeline (5 stages)** — cards width 200, gap 34, x = 72 + i·234, `(x,238,200,140)` with 4px `$accent` top; stage label 12px; name 20px bold; owner 13px `$accent`; body 13px `$muted`; `▶` 14px `$border` between cards at y=300.

**Decision list** — like numbered list with pitch 74, heading width 380, body at x=520 width 688; closing rule at 650 and one bold sentence at 668 (only if it fits ≤ 700).

## Colour tokens

`$background $surface $text $muted $accent $secondary $border` — resolved from the theme. Light text on `$accent` blocks passes contrast on every built-in theme; `$muted` on `$surface` passes at ≥ 16px.
