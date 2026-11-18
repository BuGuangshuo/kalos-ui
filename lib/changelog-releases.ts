type Release = {
  releasedOn: string | null;
  newComponents: readonly string[];
};

// Keep releases newest first. Set releasedOn after verifying the production deployment.
export const changelogReleases = {
  "0.3.5": {
    releasedOn: "2026-11-18",
    newComponents: [
      "kalos-stepper-form",
      "kalos-otp-input",
      "kalos-color-picker",
      "kalos-dropzone",
      "kalos-combobox",
      "kalos-toast",
      "kalos-text-area",
      "kalos-drawer",
      "kalos-notification",
    ],
  },
  "0.3.4": { releasedOn: "2026-11-16", newComponents: [] },
  "0.3.3": { releasedOn: "2026-11-16", newComponents: ["kalos-pagination"] },
  "0.3.2": { releasedOn: "2026-11-16", newComponents: [] },
  "0.3.1": {
    releasedOn: "2026-11-13",
    newComponents: [
      "kalos-date-picker",
      "kalos-date-range-picker",
      "kalos-time-picker",
      "kalos-skeleton",
      "kalos-spinner",
      "kalos-table",
      "kalos-dropdown-menu",
      "kalos-number-input",
      "kalos-hover-card",
      "kalos-tooltip",
    ],
  },
} satisfies Record<string, Release>;

export function getNewComponentSlugs(releases: Readonly<Record<string, Release>>) {
  const release = Object.values(releases).find(({ releasedOn, newComponents }) => releasedOn && newComponents.length > 0);
  return new Set(release?.newComponents);
}

export const newComponentSlugs = getNewComponentSlugs(changelogReleases);
