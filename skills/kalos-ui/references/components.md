# Components and APIs

Use the slug with the selected primitive registry URL in SKILL.md. React named exports use PascalCase (`kalos-avatar-stack` → `KalosAvatarStack`). Install paths follow `components.json` aliases.

| Slug             | Shared purpose and props                            |
| ---------------- | --------------------------------------------------- |
| kalos-button       | `loading`, `disabled`, underlying Button attributes |
| kalos-command-menu | grouped commands, optional context, controlled query, onRun/onClose |
| kalos-popover | trigger, items, optional custom content, controlled open, action callback |
| kalos-form         | `fields`, `defaultValues`, `validate`, async `onSubmit`, `onCancel`; built-in required/email/length validation |
| kalos-input        | `label`, `hint`, `error`, native input attributes; a single trailing action: password reveal for password, hover clear for other inputs; `clearable` defaults to true   |
| kalos-card         | `title`, `description`, content and footer          |
| kalos-badge        | `status`: neutral / success / warning               |
| kalos-switch       | `label`, `description`, `error`, disabled/name               |
| kalos-checkbox     | `label`, `description`, `error`, disabled/name               |
| kalos-tabs         | items with value/label/content                      |
| kalos-accordion    | items with question/answer, single open item        |
| kalos-alert-dialog | `trigger`, `title`, `description`, `actionLabel`, `cancelLabel`, `onConfirm`, `open`, `onOpenChange` |
| kalos-dialog       | `trigger`, `title`, `description`, `footer`, `open`, `onOpenChange`                   |
| kalos-select       | `label`, `placeholder`, items with value/label      |
| kalos-progress     | `label`, `value` clamped 0–100, `description`       |
| kalos-avatar-stack | people with name/image, `max`                       |

## React

```tsx
import { KalosButton } from '@/components/ui/kalos-button'
import { KalosInput } from '@/components/ui/kalos-input'

<KalosInput label="邮箱" value={email} onChange={event => setEmail(event.target.value)} />
<KalosButton loading={saving} onClick={save}>保存更改</KalosButton>
```

## React backend differences

- Radix: Button uses `onClick`, `disabled`; Checkbox supports `checked="indeterminate"`.
- Base UI: Button also supports `render`; Checkbox uses boolean `checked` and `indeterminate`.
- React Aria: Button uses `onPress`, `isDisabled` (`disabled` and zero-argument `onClick` are convenience aliases). Switch/Checkbox accept `checked`, `defaultChecked`, `disabled`, `onCheckedChange` and the native `isSelected`, `defaultSelected`, `isDisabled`, `onChange` aliases. Use `isIndeterminate` on Checkbox.
- Tabs, Select, Accordion, Dialog, Progress, Card, Badge and Avatar Stack keep their Kalos props across all three backends; internal composition follows the selected primitive’s API.

```tsx
// React Aria
<KalosButton onPress={save} loading={saving}>保存</KalosButton>
<KalosCheckbox label="部分选择" isIndeterminate />
// Base UI
<KalosCheckbox label="部分选择" indeterminate />
```

Documentation and source for each component: `https://kalos-ui-six.vercel.app/components/{slug}`. The primitive selector switches its source, example and API. Next.js, Vite and React Router share these React components.

Form fields use unique `name` keys and `type`: `text`, `email`, `password`, `select`, `checkbox`, or `switch`. Add `required`, `minLength`, `items`, `hint`, `autoComplete`, and `disabled` only when needed. Errors replace hints and are linked to their controls. Cancel restores initial or last successfully saved values; changing `defaultValues` later requires remounting with a new key. Keep password values out of logs and persistent storage.
