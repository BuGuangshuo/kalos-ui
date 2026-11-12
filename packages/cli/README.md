# Kalos UI installer

## Create a project

```sh
kalos-ui init
kalos-ui init my-app --template vite --base radix --package-manager npm --yes
kalos-ui init --name my-app --template react-router --base base --dry-run
```

Choose Next.js, React + Vite or React Router, then a primitive base (Radix UI,
Base UI or React Aria), project name and package manager (npm, pnpm, yarn or bun).
Creates the scaffold with TypeScript, Tailwind CSS and aliases, then installs the
full Kalos library and theme. Noninteractive runs require `--template`, `--base`
and `--name` (or a positional name); the default package manager is npm.

New projects are staged outside the parent project's configuration and moved to
the requested subdirectory only after installation succeeds. Existing destinations
are refused; failed initialization cleans up only its own temporary directory.

## Add to an existing project

```sh
kalos-ui add
kalos-ui add button card
kalos-ui add theme
kalos-ui add --base base --yes
kalos-ui add --framework vite --base aria --dry-run
```

Detects Next.js, React + Vite (including SWC) and React Router framework
or library mode. Initializes component configuration only when missing. Preserves
configured themes, aliases and primitive bases; never scaffolds or migrates the
host framework. TypeScript, Tailwind CSS and aliases must already be configured.
Use `--framework next|vite|react-router` to override detection.

Running without a subcommand offers both installation modes. In noninteractive
existing projects it defaults to `add`. `--yes` skips upstream confirmations;
it does not supply missing scaffold, base or name choices. `--dry-run` prints
commands without creating directories, installing dependencies or writing files.

The website serves this package at `/cli/kalos-ui-0.2.0.tgz`; no npm publication
is required. The default registry is embedded at build time;
`--registry http://localhost:3000` targets a local preview. Run `kalos-ui --help`
for all flags.
