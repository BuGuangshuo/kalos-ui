# Kalos UI installer

Run the installer from an existing React or Vue project. React users select
Radix UI, Base UI, or React Aria in the terminal. Vue uses Reka UI.
The installer initializes shadcn only when `components.json` is missing and
does not migrate an existing project's primitive base or overwrite files silently.

The website serves this package at `/cli/kalos-ui-0.1.1.tgz`, so its command works
without publishing a new npm package. The registry address is embedded at build
time; `--registry http://localhost:3000` can target a local preview.

```sh
kalos-ui
kalos-ui add button card
kalos-ui add theme
kalos-ui --base base --yes
kalos-ui --base aria --dry-run
```

Run `kalos-ui --help` for all flags. Existing theme and alias configuration is
preserved. `--dry-run` only prints the delegated commands and does not write files.
