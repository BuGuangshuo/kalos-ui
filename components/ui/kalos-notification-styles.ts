// Generated from design/component-tokens.json and design/notification.css.
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
export const notificationDefaults = {"width":400,"textInsetRight":64,"radius":12,"offset":24,"layer":60,"peek":12,"scaleStep":0.05,"duration":460,"exitDuration":320} as const;
export const notificationStyleHref = "kalos-notification-36377938338d";
export const notificationCss = ".kalos-notification{font-family:Roboto, \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", ByteSans, Arial, \"Helvetica Neue\", -apple-system, BlinkMacSystemFont, \"noto sans\", Helvetica, sans-serif;font-size:13px;line-height:20px;--nt-surface:#ffffff;--nt-ink:rgba(0, 0, 0, 0.88);--nt-muted:rgba(0, 0, 0, 0.61);--nt-art:rgba(0, 0, 0, 0.09);--nt-accent:rgba(0, 96, 226, 0.7);--nt-accent-wash:rgba(0, 96, 226, 0.05);--nt-shadow:0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05);--nt-width:400px;--nt-text-inset-right:64px;--nt-radius:12px;--nt-offset:24px;--nt-layer:60}\n:where(.dark,[data-theme=dark]) .kalos-notification{--nt-surface:#1c1c1e;--nt-ink:rgba(255, 255, 255, 0.9);--nt-muted:rgba(255, 255, 255, 0.62);--nt-art:rgba(255, 255, 255, 0.12);--nt-accent:rgba(77, 141, 255, 0.8);--nt-accent-wash:rgba(77, 141, 255, 0.1);--nt-shadow:0 0 0 0.5px rgba(255, 255, 255, 0.14), 0 1px 2px rgba(0, 0, 0, 0.4)}\n.kalos-notification {\n  position: relative;\n  isolation: isolate;\n  width: 100%;\n  max-width: var(--nt-width);\n  color: var(--nt-ink);\n  text-align: start;\n  outline: none;\n  -webkit-font-smoothing: antialiased;\n}\n.kalos-notification, .kalos-notification * { box-sizing: border-box; }\n.kalos-notification[data-variant=\"floating\"] {\n  --nt-card-max-height: calc(100dvh - 2 * var(--nt-offset) - 24px);\n  position: fixed;\n  z-index: var(--nt-layer);\n  width: min(var(--nt-width), calc(100vw - 32px));\n  max-height: calc(100dvh - 2 * var(--nt-offset));\n  pointer-events: none;\n}\n.kalos-notification[data-variant=\"floating\"][data-position^=\"top\"] { top: max(var(--nt-offset), env(safe-area-inset-top)); }\n.kalos-notification[data-variant=\"floating\"][data-position^=\"bottom\"] { bottom: max(var(--nt-offset), env(safe-area-inset-bottom)); }\n.kalos-notification[data-variant=\"floating\"][data-position$=\"right\"] { right: max(var(--nt-offset), env(safe-area-inset-right)); }\n.kalos-notification[data-variant=\"floating\"][data-position$=\"left\"] { left: max(var(--nt-offset), env(safe-area-inset-left)); }\n.kalos-notification__card {\n  position: absolute;\n  inset: 0 0 auto;\n  overflow: clip;\n  border: 0;\n  border-radius: var(--nt-radius);\n  background: var(--nt-surface);\n  box-shadow: var(--nt-shadow);\n  transform-origin: 50% 100%;\n  pointer-events: auto;\n  will-change: transform, opacity;\n}\n.kalos-notification[data-position^=\"bottom\"] .kalos-notification__card { inset: auto 0 0; transform-origin: 50% 0%; }\n.kalos-notification__card[inert] { pointer-events: none; }\n.kalos-notification[data-variant=\"floating\"] .kalos-notification__body { max-height: var(--nt-card-max-height); overflow-y: auto; overscroll-behavior: contain; }\n.kalos-notification__body, .kalos-notification__pattern { transition: opacity 260ms ease; }\n.kalos-notification__card:not([data-depth=\"0\"]) > * { opacity: 0; }\n.kalos-notification__pattern {\n  position: absolute;\n  inset: 0 0 auto auto;\n  width: 220px;\n  height: 160px;\n  stroke: var(--nt-art);\n  stroke-width: 0.75;\n  pointer-events: none;\n  mask-image: radial-gradient(120% 110% at 100% 0%, #000 20%, transparent 70%);\n}\n.kalos-notification__dot { fill: var(--nt-accent); stroke: none; }\n.kalos-notification__fill { fill: var(--nt-accent-wash); }\n.kalos-notification__body { position: relative; padding: 16px; }\n.kalos-notification__top { display: flex; align-items: center; gap: 8px; min-height: 28px; margin-bottom: 8px; }\n.kalos-notification__close[data-slot=\"button\"] { position: absolute; top: 12px; right: 12px; width: 28px; height: 28px; color: var(--nt-muted); }\n.kalos-notification__title { display: flex; align-items: flex-start; gap: 8px; margin: 0; padding-right: var(--nt-text-inset-right); font-size: 15px; font-weight: 500; line-height: 22px; overflow-wrap: anywhere; }\n.kalos-notification__icon { display: inline-flex; align-items: center; height: 22px; flex-shrink: 0; }\n.kalos-notification__icon svg { width: 16px; height: 16px; }\n.kalos-notification__text { margin: 4px 0 0; padding-right: var(--nt-text-inset-right); color: var(--nt-muted); font-size: 13px; line-height: 20px; overflow-wrap: anywhere; }\n.kalos-notification__action { display: flex; margin-top: 12px; }\n.kalos-notification__error { margin: 8px 0 0; color: var(--destructive); font-size: 12px; line-height: 18px; }\n.kalos-notification__announcement { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }\n@media (max-width: 600px) { .kalos-notification[data-variant=\"floating\"] { --nt-offset: 16px; } }\n";
