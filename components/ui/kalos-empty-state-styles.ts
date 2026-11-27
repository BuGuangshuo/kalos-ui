// Generated from design/component-tokens.json and design/empty-state.css.
/*
The empty state and its preview are adapted from the Clean version of [affectUI Empty State](https://www.affectui.com/components/empty-state). The interface glyphs are from [Hugeicons Free](https://github.com/hugeicons/hugeicons/blob/main/LICENSE.md).

MIT License

Copyright (c) 2026 Florian Höller (adfects)
Copyright (c) 2025 Hugeicons

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
export const emptyStateStyleHref = "kalos-empty-state-0a6353c0465c";
export const emptyStateCss = ".kalos-empty-state{font-family:Roboto, \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", ByteSans, Arial, \"Helvetica Neue\", -apple-system, BlinkMacSystemFont, \"noto sans\", Helvetica, sans-serif;font-size:13px;line-height:20px;font-weight:400;--est-radius:12px;--est-padding:48px 24px 52px;--est-compact-padding:36px 18px 40px;--est-tile-size:42px;--est-tile-radius:11px;--est-icon-size:18px;--est-title-gap:16px;--est-text-gap:4px;--est-text-width:430px;--est-action-gap:18px;--est-button-gap:8px;--est-title:#000000;--est-muted:rgba(0, 0, 0, 0.45);--est-tile:rgba(0, 0, 0, 0.04);--est-frame:rgba(0, 0, 0, 0.02);--est-edge:rgba(0, 0, 0, 0.06)}\n:where(.dark,[data-theme=dark]) .kalos-empty-state{--est-title:#ffffff;--est-muted:rgba(255, 255, 255, 0.45);--est-tile:rgba(255, 255, 255, 0.06);--est-frame:rgba(255, 255, 255, 0.03);--est-edge:rgba(255, 255, 255, 0.08)}\n.kalos-empty-state {\n  display: flex;\n  flex: initial;\n  flex-direction: column;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0;\n  box-sizing: border-box;\n  min-width: 0;\n  width: 100%;\n  padding: var(--est-padding);\n  border: 0;\n  border-radius: var(--est-radius);\n  background: var(--est-frame);\n  box-shadow: inset 0 0 0 .5px var(--est-edge);\n  text-align: center;\n  -webkit-font-smoothing: antialiased;\n}\n.kalos-empty-state[data-bare] { padding: 0; background: none; box-shadow: none; }\n.kalos-empty-state[data-tall] { justify-content: center; min-height: 100%; }\n\n.kalos-empty-state > [data-slot=empty-icon] {\n  display: grid;\n  flex: none;\n  place-items: center;\n  width: var(--est-tile-size);\n  height: var(--est-tile-size);\n  margin: 0;\n  border-radius: var(--est-tile-radius);\n  background: var(--est-tile);\n  color: var(--est-muted);\n}\n.kalos-empty-state > [data-slot=empty-icon] > :is(svg, img) {\n  display: block;\n  width: var(--est-icon-size);\n  height: var(--est-icon-size);\n}\n.kalos-empty-state > [data-slot=empty-title] {\n  max-width: 100%;\n  margin: 0;\n  color: var(--est-title);\n  font: inherit;\n  font-weight: 500;\n  letter-spacing: normal;\n  overflow-wrap: anywhere;\n}\n.kalos-empty-state > [data-slot=empty-icon] + [data-slot=empty-title] { margin-top: var(--est-title-gap); }\n.kalos-empty-state > [data-slot=empty-description] {\n  max-width: min(100%, var(--est-text-width));\n  margin: var(--est-text-gap) 0 0;\n  color: var(--est-muted);\n  font: inherit;\n  text-wrap: balance;\n  overflow-wrap: anywhere;\n}\n.kalos-empty-state > [data-slot=empty-content] {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: var(--est-button-gap);\n  width: auto;\n  max-width: 100%;\n  margin-top: var(--est-action-gap);\n}\n@media (max-width: 560px) {\n  .kalos-empty-state:not([data-bare]) { padding: var(--est-compact-padding); }\n}\n";
