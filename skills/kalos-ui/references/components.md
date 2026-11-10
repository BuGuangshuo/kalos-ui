# Components and APIs

Use the slug with the framework's registry URL in SKILL.md. React named exports and Vue default exports use PascalCase (`kalos-avatar-stack` → `KalosAvatarStack`). Install paths follow `components.json` aliases.

| Slug             | Shared purpose and props                            | Vue differences                                                  |
| ---------------- | --------------------------------------------------- | ---------------------------------------------------------------- |
| kalos-button       | `loading`, `disabled`, underlying Button attributes | default slot; `:loading="saving"`                                |
| kalos-command-menu | grouped commands, optional context, controlled query, onRun/onClose | `v-model:query`, `@run`, `@close`, `icon` / `description` slots |
| kalos-popover | trigger, items, optional custom content, controlled open, action callback | `v-model:open`, `@action`, default slot |
| kalos-input        | `label`, `hint`, `error`, native input attributes   | `v-model` is string or number                                    |
| kalos-card         | `title`, `description`, content and footer          | default and `footer` slots                                       |
| kalos-badge        | `status`: neutral / success / warning               | default slot                                                     |
| kalos-switch       | `label`, `description`, disabled/name               | `v-model` boolean                                                |
| kalos-checkbox     | `label`, `description`, disabled/name               | `v-model` boolean or `indeterminate`                             |
| kalos-tabs         | items with value/label/content                      | string content or a slot named by item value; optional `v-model` |
| kalos-accordion    | items with question/answer, single open item        | answers are strings                                              |
| kalos-dialog       | `trigger`, `title`, `description`                   | `v-model:open`; default and footer slots                         |
| kalos-select       | `label`, `placeholder`, items with value/label      | optional `v-model` string                                        |
| kalos-progress     | `label`, `value` clamped 0–100, `description`       | `:value="68"`                                                    |
| kalos-avatar-stack | people with name/image, `max`                       | `:people="members"`                                              |

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

## Vue

```vue
<script setup lang="ts">
import { ref } from "vue";
import KalosInput from "@/components/ui/kalos-input.vue";
import KalosSwitch from "@/components/ui/kalos-switch.vue";

const email = ref("");
const notifications = ref(false);
</script>

<template>
  <KalosInput v-model="email" label="邮箱" type="email" />
  <KalosSwitch v-model="notifications" label="消息通知" />
</template>
```

Documentation and source for each component: `https://kalos-ui-six.vercel.app/components/{slug}`. The framework and React primitive selectors switch its installation URL, source, example, and API.
