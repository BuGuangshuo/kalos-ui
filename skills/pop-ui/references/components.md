# Components and APIs

Use the slug with the framework's registry URL in SKILL.md. React named exports and Vue default exports use PascalCase (`pop-avatar-stack` → `PopAvatarStack`). Install paths follow `components.json` aliases.

| Slug             | Shared purpose and props                            | Vue differences                                                  |
| ---------------- | --------------------------------------------------- | ---------------------------------------------------------------- |
| pop-button       | `loading`, `disabled`, underlying Button attributes | default slot; `:loading="saving"`                                |
| pop-input        | `label`, `hint`, `error`, native input attributes   | `v-model` is string or number                                    |
| pop-card         | `title`, `description`, content and footer          | default and `footer` slots                                       |
| pop-badge        | `status`: neutral / success / warning               | default slot                                                     |
| pop-switch       | `label`, `description`, disabled/name               | `v-model` boolean                                                |
| pop-checkbox     | `label`, `description`, disabled/name               | `v-model` boolean or `indeterminate`                             |
| pop-tabs         | items with value/label/content                      | string content or a slot named by item value; optional `v-model` |
| pop-accordion    | items with question/answer, single open item        | answers are strings                                              |
| pop-dialog       | `trigger`, `title`, `description`                   | `v-model:open`; default and footer slots                         |
| pop-select       | `label`, `placeholder`, items with value/label      | optional `v-model` string                                        |
| pop-progress     | `label`, `value` clamped 0–100, `description`       | `:value="68"`                                                    |
| pop-avatar-stack | people with name/image, `max`                       | `:people="members"`                                              |

## React

```tsx
import { PopButton } from '@/components/ui/pop-button'
import { PopInput } from '@/components/ui/pop-input'

<PopInput label="邮箱" value={email} onChange={event => setEmail(event.target.value)} />
<PopButton loading={saving} onClick={save}>保存更改</PopButton>
```

## React backend differences

- Radix: Button uses `onClick`, `disabled`; Checkbox supports `checked="indeterminate"`.
- Base UI: Button also supports `render`; Checkbox uses boolean `checked` and `indeterminate`.
- React Aria: Button uses `onPress`, `isDisabled` (`disabled` and zero-argument `onClick` are convenience aliases). Switch/Checkbox accept `checked`, `defaultChecked`, `disabled`, `onCheckedChange` and the native `isSelected`, `defaultSelected`, `isDisabled`, `onChange` aliases. Use `isIndeterminate` on Checkbox.
- Tabs, Select, Accordion, Dialog, Progress, Card, Badge and Avatar Stack keep their Pop props across all three backends; internal composition follows the selected primitive’s API.

```tsx
// React Aria
<PopButton onPress={save} loading={saving}>保存</PopButton>
<PopCheckbox label="部分选择" isIndeterminate />
// Base UI
<PopCheckbox label="部分选择" indeterminate />
```

## Vue

```vue
<script setup lang="ts">
import { ref } from "vue";
import PopInput from "@/components/ui/pop-input.vue";
import PopSwitch from "@/components/ui/pop-switch.vue";

const email = ref("");
const notifications = ref(false);
</script>

<template>
  <PopInput v-model="email" label="邮箱" type="email" />
  <PopSwitch v-model="notifications" label="消息通知" />
</template>
```

Documentation and source for each component: `https://pop-ui-six.vercel.app/components/{slug}`. The framework and React primitive selectors switch its installation URL, source, example, and API.
