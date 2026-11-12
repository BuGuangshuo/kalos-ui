---
name: kalos-ui
description: Install, compose, and customize Kalos UI components in Next.js, Vite or React Router projects, including forms, settings panels, dialogs, and restrained UI motion. Use when a project uses Kalos UI or the user asks to build with Kalos UI.
---

# Kalos UI

Kalos UI is a React source registry for Next.js, Vite and React Router. Its components inherit the host project's shadcn semantic variables. Documentation: https://kalos-ui-six.vercel.app/docs/getting-started

## Unified installer

The website serves `https://kalos-ui-six.vercel.app/cli/kalos-ui-0.2.0.tgz`.

- **New project:** `npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.2.0.tgz init`. Select the scaffold (Next.js, Vite or React Router), primitive base, project name and package manager. In automation, supply `init my-app --template vite --base radix --package-manager npm --yes`. The installer creates a new subdirectory and configures TypeScript, Tailwind CSS, aliases, all components and the Kalos theme. Existing destinations are refused.
- **Existing project:** `npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.2.0.tgz add [components...]`. Detect the framework and preserve the existing theme, directories, aliases and primitive base. Use `add button card` for individual components and `--base radix`, `--base base` or `--base aria` for noninteractive installs. Do not apply the optional theme unless requested.

Without a subcommand, the terminal offers both modes. `--dry-run` previews without modifying files or creating directories. Never run `init` to add components to an existing app; do not change frameworks or silently migrate primitive bases.

Direct registry URLs below remain supported for explicit installs and advanced configuration.

## Detect the project, then choose its registry

Read `package.json`, `components.json`, and nearby component imports. Follow the project's package manager and aliases. All supported frameworks share the React registry. Do not change frameworks to install a component. For manual detection overrides, use `--framework next`, `--framework vite` or `--framework react-router`.

| Framework          | CLI                 | Registry URL                                             | Source import                                        |
| ------------------ | ------------------- | -------------------------------------------------------- | ---------------------------------------------------- |
| React / Radix      | `shadcn@latest`     | `https://kalos-ui-six.vercel.app/r/radix/{name}.json`      | named TSX export                                     |
| React / Base UI    | `shadcn@latest`     | `https://kalos-ui-six.vercel.app/r/base-ui/{name}.json`    | named TSX export                                     |
| React / React Aria | `shadcn@latest`     | `https://kalos-ui-six.vercel.app/r/react-aria/{name}.json` | named TSX export                                     |

For a new project, use Kalos init to configure the scaffold. For an existing project, check its TypeScript, Tailwind and alias configuration before running Kalos add. Detect the React primitive base from components.json style (radix-_, base-_, aria-\*), package dependencies and imports. Use `init --template next|vite|react-router --base radix|base|aria --name my-app` to create a project with the chosen library. Prefer an existing project’s base; do not silently migrate it. Preserve an existing theme and configuration. Read [references/components.md](references/components.md) for the component names and framework-specific APIs before composing a screen.

### Framework setup

- Next.js: App Router and Pages Router are supported. Add `"use client"` only to page components that use state, callbacks or browser APIs; the interactive registry components already declare their client boundary.
- React + Vite: configure Tailwind CSS, import global CSS in the entry point and resolve aliases in both TypeScript and Vite.
- React Router: framework and library modes share the same React components. Preserve the existing `~/` or `@/` aliases and global CSS path.

The installer delegates framework-specific initialization to shadcn. Existing `components.json`, aliases, theme and primitive base must be preserved. The examples below use `@/`; adapt application imports to the host alias.

Install only the needed component, for example:

```sh
# React / Radix
npx shadcn@latest add https://kalos-ui-six.vercel.app/r/radix/kalos-button.json
# React / Base UI
npx shadcn@latest add https://kalos-ui-six.vercel.app/r/base-ui/kalos-button.json
# React / React Aria
npx shadcn@latest add https://kalos-ui-six.vercel.app/r/react-aria/kalos-button.json
```

Each backend provides all components, `kalos-all.json`, and `kalos-theme.json`. Choose one backend per project: the Kalos filenames are shared. Base UI and React Aria bundle their matching foundation source under collision-free `kalos-base-*` / `kalos-aria-*` names and do not depend on Radix. Legacy `/r/{name}.json` URLs still resolve to Radix. `kalos-all.json` installs all components. `kalos-theme.json` installs the optional neutral theme; apply it only when the user wants a theme change. Read the installed source before editing. Keep the host project's import aliases and existing component choices.

## Compose and customize

Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining. Omit `hint` and `description` in default examples when the control label, grouping, or visible state already explains the task. Add supporting text only for non-obvious constraints, consequences, validation, or recovery. Keep essential field labels, accessible names, dialog titles, and status/error feedback.

Use semantic classes such as `bg-background`, `text-foreground`, `border-border`, and `text-muted-foreground`; keep black/neutral light and dark states. Buttons and inputs use 32px height, avatars 32px, 6px button corners, 7px field corners, and 12px container corners by default. These are defaults, not constraints on a user's chosen design.

React inputs use controlled props and callbacks; dialogs use `open` and `onOpenChange`. Do not add focus outlines or outer focus rings; keep selected backgrounds, normal borders and semantic keyboard behavior. Keep visible labels connected to unique control IDs, keyboard navigation, focus management, and loading/disabled semantics. Avoid nested labels, interactive elements inside triggers, and narrow flex children that wrap Chinese labels one character per line.

For motion requests, read [references/motion.md](references/motion.md). Use the host's existing animation library; these registry components do not require a separate Kalos UI animation runtime. Explain proposed effects through real user actions, implement them in source.

## Verify the actual flow

Run the project's typecheck/build and exercise the affected interaction: click the label, toggle the control, open and close the dialog with Escape, or submit the form. Check narrow layouts and light/dark colors when relevant. Report what was implemented and tested. Do not present a simulated homepage scenario as an AI service executing inside the site.
