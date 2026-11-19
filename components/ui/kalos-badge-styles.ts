// Generated from design/component-tokens.json and design/badge.css.
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
export const badgeCss = ".kalos-badge{font-family:Roboto, \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", ByteSans, Arial, \"Helvetica Neue\", -apple-system, BlinkMacSystemFont, \"noto sans\", Helvetica, sans-serif;--badge-neutral-ink:#666666;--badge-neutral-wash:#f3f3f3;--badge-info-ink:#2384ff;--badge-info-wash:#edf4ff;--badge-success-ink:#008a46;--badge-success-wash:#eef9f2;--badge-warning-ink:#9c5d15;--badge-warning-wash:#fef2e3;--badge-purple-ink:#8b2cff;--badge-purple-wash:#f6f0ff;--badge-pink-ink:#d6006e;--badge-pink-wash:#fff0f7;--badge-neutral-solid:#666666;--badge-info-solid:#2384ff;--badge-success-solid:#008a46;--badge-warning-solid:#f19021;--badge-purple-solid:#8b2cff;--badge-pink-solid:#d6006e;--badge-danger-solid:#c4320a;--badge-on-solid:#ffffff;--badge-warning-base:#f19021;--badge-danger-ink:#c4320a;--badge-danger-wash:rgba(240, 68, 56, 0.08);--badge-height-sm:18px;--badge-height-md:20px;--badge-font-sm:11px;--badge-font-md:12px;--badge-radius-sm:4px;--badge-radius-md:4px;--badge-live-duration:1800ms;--badge-padding-x:6px;--badge-gap:4px;--badge-line-height:20px;--badge-dot-size:5px;--badge-dot-space:1.5px}\n:where(.dark,[data-theme=dark]) .kalos-badge{--badge-neutral-ink:#b5b5bb;--badge-neutral-wash:#303034;--badge-info-ink:#8cbbff;--badge-info-wash:#202e43;--badge-success-ink:#82d7a6;--badge-success-wash:#20382c;--badge-warning-ink:#f4a64d;--badge-warning-wash:#3e2d19;--badge-purple-ink:#c398ff;--badge-purple-wash:#30223e;--badge-pink-ink:#ff8dc4;--badge-pink-wash:#3b2330;--badge-neutral-solid:#666666;--badge-info-solid:#2384ff;--badge-success-solid:#008a46;--badge-warning-solid:#f19021;--badge-purple-solid:#8b2cff;--badge-pink-solid:#d6006e;--badge-danger-solid:#c4320a;--badge-on-solid:#ffffff;--badge-warning-base:#f19021;--badge-danger-ink:#ff8a7a;--badge-danger-wash:rgba(255, 107, 95, 0.14)}\n.kalos-badge[data-slot=\"badge\"] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 1;\n  width: fit-content;\n  min-width: 0;\n  max-width: 100%;\n  height: var(--badge-height-sm);\n  gap: var(--badge-gap);\n  padding: 0 var(--badge-padding-x);\n  overflow: visible;\n  border: 0;\n  border-radius: var(--badge-radius-sm);\n  background: var(--badge-neutral-wash);\n  --badge-solid: var(--badge-neutral-solid);\n  color: var(--badge-neutral-ink);\n  font-size: var(--badge-font-sm);\n  font-weight: 400;\n  line-height: 16px;\n  white-space: nowrap;\n  vertical-align: middle;\n  box-shadow: none;\n  transition: color 160ms, background-color 160ms;\n}\n.kalos-badge[data-size=\"md\"] { height: var(--badge-height-md); border-radius: var(--badge-radius-md); font-size: var(--badge-font-md); line-height: var(--badge-line-height); }\n.kalos-badge[data-tone=\"info\"] { background: var(--badge-info-wash); color: var(--badge-info-ink); --badge-solid: var(--badge-info-solid); }\n.kalos-badge[data-tone=\"success\"] { background: var(--badge-success-wash); color: var(--badge-success-ink); --badge-solid: var(--badge-success-solid); }\n.kalos-badge[data-tone=\"warning\"] { background: var(--badge-warning-wash); color: var(--badge-warning-ink); --badge-solid: var(--badge-warning-solid); }\n.kalos-badge[data-tone=\"danger\"] { background: var(--badge-danger-wash); color: var(--badge-danger-ink); --badge-solid: var(--badge-danger-solid); }\n.kalos-badge[data-tone=\"purple\"] { background: var(--badge-purple-wash); color: var(--badge-purple-ink); --badge-solid: var(--badge-purple-solid); }\n.kalos-badge[data-tone=\"pink\"] { background: var(--badge-pink-wash); color: var(--badge-pink-ink); --badge-solid: var(--badge-pink-solid); }\n.kalos-badge[data-appearance=\"solid\"] { background: var(--badge-solid); color: var(--badge-on-solid); }\n.kalos-badge[data-appearance=\"ghost\"] { background: transparent; box-shadow: none; }\n.kalos-badge[data-lead] { padding-inline-start: 4px; }\n.kalos-badge[data-size=\"md\"][data-lead] { padding-inline-start: 4px; }\n.kalos-badge[data-count] { min-width: var(--badge-height-sm); padding-inline: 5px; border-radius: 999px; font-variant-numeric: tabular-nums; }\n.kalos-badge[data-size=\"md\"][data-count] { min-width: var(--badge-height-md); padding-inline: 6px; }\n.kalos-badge__label { min-width: 0; overflow: hidden; text-overflow: ellipsis; }\n.kalos-badge__dot { position: relative; flex: none; width: var(--badge-dot-size); height: var(--badge-dot-size); margin-inline: var(--badge-dot-space); border-radius: 50%; background: currentColor; }\n.kalos-badge[data-tone=\"warning\"] .kalos-badge__dot { background: var(--badge-warning-base); }\n.kalos-badge[data-tone=\"warning\"] .kalos-badge__dot::after { border-color: var(--badge-warning-base); }\n.kalos-badge__dot[data-live]::after { position: absolute; inset: -3px; border: 1px solid currentColor; border-radius: inherit; content: \"\"; animation: kalos-badge-live var(--badge-live-duration) ease-out infinite; }\n.kalos-badge[data-appearance=\"solid\"] .kalos-badge__dot { background: currentColor; }\n.kalos-badge[data-appearance=\"solid\"] .kalos-badge__dot::after { border-color: currentColor; }\n.kalos-badge__icon { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 12px; height: 12px; }\n.kalos-badge__icon svg { width: 100%; height: 100%; pointer-events: none; }\n.kalos-badge[data-size=\"md\"] .kalos-badge__icon { width: 13px; height: 13px; }\n@keyframes kalos-badge-live { 0% { opacity: 0.5; transform: scale(0.5); } 80%, 100% { opacity: 0; transform: scale(1.3); } }\n";
