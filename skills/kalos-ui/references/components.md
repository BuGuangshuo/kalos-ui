# Components and APIs

Use the slug with the Base UI registry URL in SKILL.md. React named exports use PascalCase (`kalos-avatar-stack` → `KalosAvatarStack`). Install paths follow `components.json` aliases.

| Slug             | Shared purpose and props                            |
| ---------------- | --------------------------------------------------- |
| kalos-button       | `loading`, `disabled`, underlying Button attributes |
| kalos-command-menu | grouped commands, optional context, controlled query, onRun/onClose |
| kalos-hover-card | `content`, one focusable child, side/align/offset, delays, width, controlled open, disabled |
| kalos-dropdown-menu | `trigger`, `triggerProps`, recursive `items`, icons/shortcuts, controlled radio/checkbox choices, `keepOpen`, submenus, danger/disabled/divider, `onAction`, controlled open |
| kalos-popover | trigger, items, optional custom content, controlled open, action callback |
| kalos-form         | `fields`, `defaultValues`, `validate`, async `onSubmit`, `onCancel`; built-in required/email/length validation |
| kalos-input        | `label`, `hint`, `error`, native input attributes; a single trailing action: password reveal for password, hover clear for other inputs; `clearable` defaults to true   |
| kalos-number-input | `label`, value/defaultValue (`number \| null`), `onValueChange`, min/max/step/largeStep, prefix/unit, locale/formatOptions, disabled/readOnly/required, hint/error; raw numeric form values |
| kalos-date-picker | Date/null value, onChange(local midnight), min/max, isDateDisabled, locale, weekStartsOn (Monday default), today, label/hint/error, name submits local YYYY-MM-DD |
| kalos-date-range-picker | start/end Date range or null, presets, min/max/today, dual calendars and hover preview; onChange on Apply, or null immediately on clear; clearable defaults true; closing discards uncommitted changes; inline embedding, responsive single month |
| kalos-time-picker | HH:mm/null value, onChange, step/min/max, 12/24 hour display, typed time normalization, label/hint/error, readOnly/disabled; Base UI editable Combobox |
| kalos-card         | `title`, optional `description` / `icon` / `action` / content / `footer`; `interactive`, `selected`, `as`, `titleAs` |
| kalos-table        | `columns`, controlled `rows` or `defaultRows`, `title`/`icon`, colored `tagTones`, `editable`, `selectable`, `sortable`, `footer`, `rowActions`/`rowActionsLabel`/`rowActionsWidth`, `onRowsChange`/`onSelectionChange` |
| kalos-badge        | `status`: neutral / success / warning               |
| kalos-switch       | `label`, `description`, `error`, disabled/name               |
| kalos-checkbox     | `label`, `description`, `error`, disabled/name               |
| kalos-segmented-control | options; value/defaultValue; onChange; buttons/tray/underline; sm/md/lg; radio/tabs |
| kalos-accordion    | items with question/answer, single open item        |
| kalos-alert-dialog | `trigger`, `title`, `description`, `actionLabel`, `cancelLabel`, `onConfirm`, `open`, `onOpenChange` |
| kalos-dialog       | `trigger`, `title`, `description`, `footer`, `open`, `onOpenChange`                   |
| kalos-select       | `label`, `placeholder`, items with value/label      |
| kalos-tooltip      | `content`, single ref-forwarding child, `shortcut`, side/align/offset, hover delay, disabled, controlled open; `KalosTooltipProvider` shares neighbour timing |
| kalos-progress     | `label`, `value` clamped 0–100, `description`       |
| kalos-skeleton     | `KalosSkeleton`: width/height/radius, optional `line` preserves text line height; `KalosLoading`: label, children and layout, one busy status with delayed fade-in |
| kalos-spinner      | `size` (14px), optional `label`, native SVG props; currentColor ring/arc rotates every 800ms; unlabeled icons are decorative |
| kalos-avatar-stack | `KalosAvatar`: name/src, size (20/24/32/40), shape, status, kind, seed, color, working; `KalosAvatarStack` / `KalosAvatarGroup`: people (name/image or src and avatar props), max, total, size |

## React

```tsx
import { KalosButton } from '@/components/ui/kalos-button'
import { KalosInput } from '@/components/ui/kalos-input'

<KalosInput label="邮箱" value={email} onChange={event => setEmail(event.target.value)} />
<KalosButton loading={saving} onClick={save}>保存更改</KalosButton>
```

## Base UI APIs

- Button uses `onClick`, `disabled` and the native `render` prop. Use `nativeButton={false}` when rendering a link.
- Checkbox uses boolean `checked` and a separate `indeterminate` prop.
- Tabs, Select, Accordion, Dialog, Progress, Card, Badge and Avatar Stack use their Kalos props with Base UI composition.
- Table uses the data-driven `KalosTableProps` API, semantic HTML tables and Base UI checkboxes. `columns` support title/text/tag/link/number/date, optional icons, widths, locked columns, fixed tag options, per-column exact-value filters, horizontal cell merging via `colSpan`, and formatting. `reorderable` adds row handles with pointer, touch and keyboard sorting; Motion handles row displacement. The action column follows the same width allocation as data columns: `rowActionsWidth` defaults to 160px; the compact previews explicitly use 84px. Row actions use 13px icons with a 16px gap. All columns align left by default. Each row needs a stable unique `id`. Editing, paste and clear respect column restrictions. Use `rows` with `onRowsChange` for controlled data; replacing an entire dataset resets editing/history by remounting with a new `key`. `editable`, `selectable` and `sortable` default to false. No spreadsheet dependency is required. The row-action example composes `kalos-dialog`, `kalos-alert-dialog`, `kalos-input` and `kalos-button` for editing and confirmed deletion. Dialog and Alert Dialog accept a ReactNode `trigger` and optional `triggerProps` (`variant`, `size`, `aria-label`) for icon buttons; always name icon triggers.

```tsx
<KalosButton onClick={save} loading={saving}>保存</KalosButton>
<KalosCheckbox label="部分选择" indeterminate />
```

Documentation and source: `https://kalos-ui-six.vercel.app/components/{slug}`. Next.js, Vite and React Router share these Base UI components.

Form fields use unique `name` keys and `type`: `text`, `email`, `password`, `select`, `checkbox`, or `switch`. Add `required`, `minLength`, `items`, `hint`, `autoComplete`, and `disabled` only when needed. Errors replace hints and are linked to their controls. Cancel restores initial or last successfully saved values; changing `defaultValues` later requires remounting with a new key. Keep password values out of logs and persistent storage.

Hover Card uses Base UI PreviewCard. The child must forward its ref and event handlers. Keep essential information outside the preview. Hover and keyboard focus respect `openDelay`; touch does not open a preview. `disabled` preserves the child's own action. Empty content renders only the child.

Dropdown Menu uses Base UI Menu primitives. Items require stable `value` and `label`; `checked` defaults to an independent checkbox; items in the same group can be selected together. Use explicit `type="radio"` only for single selection within a group. Update controlled choices in `onSelect`; `keepOpen` supports repeated selections. `shortcut` only displays a hint. `trigger` is button content; use `triggerProps={{ size: "icon", "aria-label": "文件操作" }}` for icon triggers. Submenu parents only expand; actions run on leaf items.

Number Input uses Base UI NumberField. Keep `null` for an empty field. Base UI retains the second event-details argument on `onValueChange` and its native `onValueCommitted`; typing can call `onValueChange` before blur. Arrows step once, Page Up/Down use `largeStep`, Home/End reach configured bounds, and Escape restores uncommitted text. Percent formats use fractions (`0.25` → `25%`). Labels stay associated with controls without focusing them on click.

Tooltip uses Base UI Tooltip with `KalosTooltipProvider` for shared delay groups. Wrap a single ref-forwarding element in `KalosTooltip content="提示" shortcut="⌘K"`; the trigger keeps its own accessible name. Hover delay defaults to 500ms; keyboard focus opens immediately. Shortcut text does not register a shortcut. Keep content noninteractive. Table supports `variant="bordered"`; merged examples use the same grid lines. Cell text truncates at column width and uses Tooltip only on actual overflow; editing hides it.
