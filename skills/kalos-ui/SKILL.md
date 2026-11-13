---
name: kalos-ui
description: Install, compose, and customize Kalos UI components in Next.js, Vite or React Router projects, including forms, settings panels, dialogs, and restrained UI motion. Use when a project uses Kalos UI or the user asks to build with Kalos UI.
---

# Kalos UI

Kalos UI is a Base UI React source registry for Next.js, Vite and React Router. Its components inherit the host project's shadcn semantic variables. Documentation: https://kalos-ui-six.vercel.app/docs/getting-started

## Unified installer

The website serves `https://kalos-ui-six.vercel.app/cli/kalos-ui-0.3.1.tgz`.

- **New project:** `npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.3.1.tgz init`. Select the scaffold (Next.js, Vite or React Router), project name and package manager. In automation, supply `init my-app --template vite --package-manager npm --yes`. The installer creates a new subdirectory and configures TypeScript, Tailwind CSS, aliases, all components and the Kalos theme. Existing destinations are refused.
- **Existing project:** `npx https://kalos-ui-six.vercel.app/cli/kalos-ui-0.3.1.tgz add [components...]`. Detect the framework and preserve the existing theme, directories and aliases. Use `add button card` for individual components. Interactive and noninteractive installs default to Base UI. Do not apply the optional theme unless requested.

Without a subcommand, the terminal offers both modes. `--dry-run` previews without modifying files or creating directories. Never run `init` to add components to an existing app; do not change frameworks or silently migrate primitive bases.

Direct registry URLs below remain supported for explicit installs and advanced configuration.

## Detect the project, then choose its registry

Read `package.json`, `components.json`, and nearby component imports. Follow the project's package manager and aliases. All supported frameworks share the React registry. Do not change frameworks to install a component. For manual detection overrides, use `--framework next`, `--framework vite` or `--framework react-router`.

All components use Base UI and the canonical registry URL `https://kalos-ui-six.vercel.app/r/{name}.json`. The `/r/base-ui/` path is an alias for the same source.

For a new project, use `init my-app --template next|vite|react-router --yes`. For an existing project, check TypeScript, Tailwind, aliases and Base UI configuration before running `add`. Other primitive configurations must be migrated before installation; never silently rewrite them. Read [references/components.md](references/components.md) before composing a screen.

### Framework setup

- Next.js: App Router and Pages Router are supported. Add `"use client"` only to page components that use state, callbacks or browser APIs; the interactive registry components already declare their client boundary.
- React + Vite: configure Tailwind CSS, import global CSS in the entry point and resolve aliases in both TypeScript and Vite.
- React Router: framework and library modes share the same React components. Preserve the existing `~/` or `@/` aliases and global CSS path.

The installer delegates framework-specific initialization to shadcn. Existing `components.json`, aliases, theme and primitive base must be preserved. The examples below use `@/`; adapt application imports to the host alias.

Install only the needed component, for example:

```sh
npx shadcn@latest add https://kalos-ui-six.vercel.app/r/kalos-button.json
```

`kalos-all.json` installs all components and their Base UI foundations. `kalos-theme.json` installs the optional neutral theme; apply it only when requested. Read the installed source before editing. Preserve the host project's aliases and configuration.

## Compose and customize

Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining. Omit `hint` and `description` in default examples when the control label, grouping, or visible state already explains the task. Add supporting text only for non-obvious constraints, consequences, validation, or recovery. Keep essential field labels, accessible names, dialog titles, and status/error feedback.

Use semantic classes such as `bg-background`, `text-foreground`, `border-border`, and `text-muted-foreground`; keep black/neutral light and dark states. Buttons and inputs use 32px height, avatars 32px, 6px button corners, 7px field corners, and 12px container corners by default. These are defaults, not constraints on a user's chosen design.

React inputs use controlled props and callbacks; dialogs use `open` and `onOpenChange`. Do not add focus outlines or outer focus rings; keep selected backgrounds, normal borders and semantic keyboard behavior. Keep visible labels connected to unique control IDs, keyboard navigation, focus management, and loading/disabled semantics. Avoid nested labels, interactive elements inside triggers, and narrow flex children that wrap Chinese labels one character per line.

For motion requests, read [references/motion.md](references/motion.md). Use the host's existing animation library; these registry components do not require a separate Kalos UI animation runtime. Explain proposed effects through real user actions, implement them in source.

## Verify the actual flow

Run the project's typecheck/build and exercise the affected interaction: click the label, toggle the control, open and close the dialog with Escape, or submit the form. Check narrow layouts and light/dark colors when relevant. Report what was implemented and tested. Do not present a simulated homepage scenario as an AI service executing inside the site.
