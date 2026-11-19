// Generated from design/component-tokens.json and design/pagination.css.
/*
Activity and Tooltip examples, Skeleton and Spinner components and previews adapted from [affectUI Hover Card](https://www.affectui.com/components/hover-card), [Tooltip](https://www.affectui.com/components/tooltip), [Skeleton](https://www.affectui.com/components/skeleton) and [Spinner](https://www.affectui.com/components/spinner). Badge visuals and the Chinese task-list preview reference the free [Badge](https://www.affectui.com/components/badge). Date and time picker visuals and interactions reference the free [Date Picker](https://www.affectui.com/components/date-picker) and [Time Picker](https://www.affectui.com/components/time-picker). Kalos UI's Range Picker is independently implemented from the public preview.

Pagination visuals and the Chinese document-list preview reference the free [Pagination](https://www.affectui.com/components/pagination); the implementation uses Base UI buttons and the existing Kalos Select.

Notification card art, stacking and preview reference the free [Notification Stack](https://www.affectui.com/components/notification-stack); the implementation adds Base UI controls, custom icons and four-corner floating placement.

Text Area visuals and the two-field preview reference the free [Text Area](https://www.affectui.com/components/text-area); height dragging and its keyboard controls are implemented for Kalos UI.

OTP Input state motion and the email verification preview reference the free [OTP Input](https://www.affectui.com/components/otp-input). Input and form behavior use Base UI OTP Field.

Color Picker interaction and the live color preview reference the free [Color Picker](https://www.affectui.com/components/color-picker). Kalos UI uses Base UI popovers, sliders and radio groups and a document activity example.

[Dropzone](https://www.affectui.com/components/dropzone) informed the public demo flow and API. Kalos Dropzone uses an independent implementation and Lucide icons.

Combobox interaction and the reviewer-picker preview reference the public [Combobox demo and documentation](https://www.affectui.com/components/combobox). Kalos implements the component with Base UI and shared Kalos styles.

Stepper Form follows the public [Stepper Form preview and API documentation](https://www.affectui.com/components/stepper-form). Kalos UI implements the flow and components independently.

The [Select](https://www.affectui.com/components/select) preview, option layout, and animated checkmark reference affectUI. Kalos UI uses Base UI for selection, keyboard navigation, and positioning.

The [Command Menu preview](https://www.affectui.com/components/command-menu) informed the example's command groups. Kalos uses its own menu implementation and reuses the Table preview icons. The Slack and Notion icons are sourced from [SVG Logos](https://github.com/gilbarbara/logos). Logos remain the property of their respective owners.

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
export const paginationCss = ".kalos-pagination{font-family:Roboto, \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", ByteSans, Arial, \"Helvetica Neue\", -apple-system, BlinkMacSystemFont, \"noto sans\", Helvetica, sans-serif;font-size:13px;line-height:20px;--pg-ink:rgba(0, 0, 0, 0.88);--pg-muted:rgba(0, 0, 0, 0.55);--pg-hover:rgba(0, 0, 0, 0.035);--pg-selected:rgba(0, 0, 0, 0.055);--pg-focus:rgba(0, 96, 226, 0.7);--pg-size:32px;--pg-radius:6px;--pg-gap:2px;--pg-duration:140ms}\n:where(.dark,[data-theme=dark]) .kalos-pagination{--pg-ink:rgba(255, 255, 255, 0.9);--pg-muted:rgba(255, 255, 255, 0.55);--pg-hover:rgba(255, 255, 255, 0.06);--pg-selected:rgba(255, 255, 255, 0.09);--pg-focus:rgba(77, 141, 255, 0.8)}\n.kalos-pagination{display:flex;flex-wrap:wrap;align-items:center;gap:12px;container-type:inline-size;width:100%;min-width:0;font-variant-numeric:tabular-nums;color:var(--pg-ink)}\n.kalos-pagination-size{flex-shrink:0}\n.kalos-pagination-size>[data-slot=field]{width:auto;flex-direction:row;align-items:center;gap:0}\n.kalos-pagination-size label{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}\n.kalos-pagination-size [data-slot=select-control]{width:auto;min-width:80px}\n.kalos-pagination-size [data-slot=select-trigger]{gap:8px}\n.kalos-pagination-summary{flex:1;white-space:nowrap;color:var(--pg-muted)}\n.kalos-pagination-pages{display:flex;align-items:center;gap:var(--pg-gap);list-style:none;margin:0;padding:0;margin-inline-start:auto}\n.kalos-pagination-button,.kalos-pagination-ellipsis{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;flex-shrink:0;min-width:max(var(--pg-size),calc(var(--pg-digits)*1ch + 12px));height:var(--pg-size);padding:0 6px;border:0;border-radius:var(--pg-radius);background:transparent;color:var(--pg-muted);font:inherit;font-variant-numeric:tabular-nums;line-height:20px;outline:none;user-select:none;transition:background-color var(--pg-duration),color var(--pg-duration),opacity var(--pg-duration)}\n.kalos-pagination-button{cursor:pointer}\n.kalos-pagination-button:hover:not([data-disabled]){background:var(--pg-hover);color:var(--pg-ink)}\n.kalos-pagination-button[aria-current=page]{background:var(--pg-selected);color:var(--pg-ink);font-weight:500}\n.kalos-pagination-button:focus-visible{outline:2px solid var(--pg-focus);outline-offset:2px}\n.kalos-pagination-button[data-disabled]{cursor:default;opacity:.35}\n.kalos-pagination-button svg,.kalos-pagination-ellipsis svg{width:14px;height:14px;pointer-events:none}\n.kalos-pagination-button:dir(rtl) svg{transform:rotate(180deg)}\n@container (max-width:520px){.kalos-pagination-number{display:none}}\n";
