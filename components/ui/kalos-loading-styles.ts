// Generated from design/component-tokens.json, design/skeleton.css and design/spinner.css.
/*
Activity and Tooltip examples, Skeleton and Spinner components and previews adapted from [affectUI Hover Card](https://www.affectui.com/components/hover-card), [Tooltip](https://www.affectui.com/components/tooltip), [Skeleton](https://www.affectui.com/components/skeleton) and [Spinner](https://www.affectui.com/components/spinner). Date and time picker visuals and interactions reference the free [Date Picker](https://www.affectui.com/components/date-picker) and [Time Picker](https://www.affectui.com/components/time-picker); the Date Range Picker is independently implemented from its public preview.

MIT License

Copyright (c) 2026 Florian Höller (adfects)

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
export const skeletonDefaults = {"height":12,"radius":6,"duration":1600,"ease":"cubic-bezier(0.22, 1, 0.36, 1)","delay":150,"fadeDuration":300} as const;
export const spinnerDefaults = {"size":14,"duration":800,"trackOpacity":0.18,"strokeWidth":1.8} as const;
export const skeletonCss = ".kalos-skeleton,.kalos-loading{--kalos-skeleton-fill:rgba(0, 0, 0, 0.06);--kalos-skeleton-sheen:rgba(255, 255, 255, 0.7);--kalos-skeleton-radius:6px;--kalos-skeleton-duration:1600ms;--kalos-skeleton-ease:cubic-bezier(0.22, 1, 0.36, 1);--kalos-skeleton-delay:150ms;--kalos-skeleton-fade-duration:300ms}\n:where(.dark,[data-theme=dark]) :is(.kalos-skeleton,.kalos-loading){--kalos-skeleton-fill:rgba(255, 255, 255, 0.09);--kalos-skeleton-sheen:rgba(255, 255, 255, 0.06)}\n.kalos-skeleton {\n  position: relative;\n  display: block;\n  flex: none;\n  box-sizing: border-box;\n  max-width: 100%;\n  overflow: hidden;\n  border-radius: var(--kalos-skeleton-radius);\n  background: var(--kalos-skeleton-fill);\n}\n.kalos-skeleton::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  background: linear-gradient(90deg, transparent, var(--kalos-skeleton-sheen), transparent);\n  translate: -100% 0;\n  animation: kalos-skeleton-sweep var(--kalos-skeleton-duration) var(--kalos-skeleton-ease) infinite;\n}\n.kalos-skeleton-line {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  max-width: 100%;\n}\n.kalos-loading {\n  animation: kalos-skeleton-enter var(--kalos-skeleton-fade-duration) ease var(--kalos-skeleton-delay) both;\n}\n@keyframes kalos-skeleton-sweep {\n  60%, 100% { translate: 100% 0; }\n}\n@keyframes kalos-skeleton-enter {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n";
export const spinnerCss = ".kalos-spinner{--kalos-spinner-duration:800ms}\n.kalos-spinner {\n  display: inline-block;\n  flex: none;\n  vertical-align: middle;\n  animation: kalos-spinner-turn var(--kalos-spinner-duration) linear infinite;\n}\n@keyframes kalos-spinner-turn {\n  to { rotate: 360deg; }\n}\n";
