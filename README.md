# The Math Map

A playful journey through mathematics, from counting apples to calculus. Visitors follow a trail across a map; each stop teaches one idea by letting you **play with it first** and explaining second.

The tone grows up with the math:

| Region | Level | Feel |
| --- | --- | --- |
| The Sunny Lowlands | Primary | Bright, bubbly, with Pip the owl as a guide |
| The Wild Middle | Secondary | Clean, direct and friendly |
| The Starlit Heights | Advanced | Dark, elegant, precise |

## Stops

| Stop | Status |
| --- | --- |
| 🏡 Counting Village: counting, tens and ones | ✅ Playable |
| 🌼 Multiplication Meadows | Planned |
| 🍕 Fraction Falls: fair shares, halves, comparing | ✅ Playable |
| 🔺 Pattern Peaks | Planned |
| ⚖️ Equation Bridge: solving equations with a balance | ✅ Playable |
| 📈 Graph Grasslands | Planned |
| 📐 Geometry Gardens | Planned |
| 🌀 Trig Tower | Planned |
| ∞ Calculus Canyon: derivatives and integrals by zooming and slicing | ✅ Playable |

Progress is saved in the visitor's own browser.

## Run it locally

It's plain HTML, CSS and JavaScript with no build step. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
```

## Publish with GitHub Pages

Settings → Pages → *Deploy from a branch* → `main` / `(root)`.

## Adding a stop

1. Copy an existing page in `stops/` from the same level (it sets the tone through `class="tier-primary|secondary|advanced"` on `<body>`).
2. Each `<section class="step">` is one screen; call `Stop.unlock(section)` when the visitor completes its challenge.
3. Add an `href` to the stop's entry in `js/map.js`.
