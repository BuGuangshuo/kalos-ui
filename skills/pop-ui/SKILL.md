---
name: pop-ui
description: Install, compose, and customize Pop UI components in React or Vue projects, including forms, settings panels, dialogs, and restrained UI motion. Use when a project uses Pop UI or the user asks to build with Pop UI.
---

# Pop UI

Pop UI is a source registry with 12 components in React and Vue. Its components inherit the host project's shadcn semantic variables. Documentation: https://pop-ui-six.vercel.app/docs/getting-started

## Detect the project, then choose its registry

Read `package.json`, `components.json`, and nearby component imports. Follow the project's package manager and aliases. Use React for React/Next.js; use Vue for Vue/Nuxt. Do not change frameworks to install a component.

| Framework | CLI                 | Registry URL                                      | Source import                                        |
| --------- | ------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| React     | `shadcn@latest`     | `https://pop-ui-six.vercel.app/r/{name}.json`     | named export from `@/components/ui/pop-button`       |
| Vue 3.5+  | `shadcn-vue@latest` | `https://pop-ui-six.vercel.app/r/vue/{name}.json` | default export from `@/components/ui/pop-button.vue` |

If the project is uninitialized, configure Tailwind and the matching shadcn CLI using its framework guide. React uses the Radix base (`npx shadcn@latest init --base radix`); Vue uses `npx shadcn-vue@latest init` and Reka UI. Preserve an existing theme and configuration. Read [references/components.md](references/components.md) for the component names and framework-specific APIs before composing a screen.

Install only the needed component, for example:

```sh
# React
npx shadcn@latest add https://pop-ui-six.vercel.app/r/pop-button.json
# Vue
npx shadcn-vue@latest add https://pop-ui-six.vercel.app/r/vue/pop-button.json
```

`pop-all.json` installs all 12 components. `pop-theme.json` installs the optional neutral theme; apply it only when the user wants a theme change. Read the installed source before editing. Keep the host project's import aliases and existing component choices.

## Compose and customize

Use semantic classes such as `bg-background`, `text-foreground`, `border-border`, and `text-muted-foreground`; keep black/neutral light and dark states. Buttons and inputs use 32px height, avatars 32px, pill buttons, 12px element corners, and 16px container corners by default. These are defaults, not constraints on a user's chosen design.

React inputs use controlled props and callbacks. Vue inputs use `v-model`; dialogs use `v-model:open`. Keep visible labels connected to unique control IDs, keyboard navigation, focus management, and loading/disabled semantics. Avoid nested labels, interactive elements inside triggers, and narrow flex children that wrap Chinese labels one character per line.

For motion requests, read [references/motion.md](references/motion.md). Use the host's existing animation library; these registry components do not require a separate Pop UI animation runtime. Explain proposed effects through real user actions, implement them in source, and preserve reduced-motion behavior.

## Verify the actual flow

Run the project's typecheck/build and exercise the affected interaction: click the label, toggle the model, open and close the dialog with Escape, or submit the form. Check narrow layouts and light/dark colors when relevant. Report what was implemented and tested. Do not present a simulated homepage scenario as an AI service executing inside the site.
