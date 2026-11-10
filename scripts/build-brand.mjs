import { mkdir, writeFile } from "node:fs/promises";
import {
  KALOS_LOGO_VIEWBOX,
  KALOS_WORDMARK,
} from "../lib/brand.ts";
import {
  BRAND_ICON_VIEWBOX,
  BRAND_ICON_PATHS,
  BRAND_ICON_STROKE_WIDTH,
} from "../lib/brand-icon.ts";

const mark = `<g fill="none" stroke="currentColor" stroke-width="${BRAND_ICON_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round">${BRAND_ICON_PATHS.map((d) => `<path d="${d}"/>`).join("")}</g>`;
const wordmark = `<path d="${KALOS_WORDMARK}"/>`;
const svg = (viewBox, fill, content, style = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="${fill}" color="${fill}">${style}${content}</svg>\n`;

await mkdir("public/brand", { recursive: true });
await Promise.all([
  ...[
    ["", "#0a0a0a"],
    ["-white", "#fafafa"],
  ].flatMap(([suffix, fill]) => [
    writeFile(
      `public/brand/kalos-ui-mark${suffix}.svg`,
      svg(BRAND_ICON_VIEWBOX, fill, mark),
    ),
    writeFile(
      `public/brand/kalos-ui-logo${suffix}.svg`,
      svg(KALOS_LOGO_VIEWBOX, fill, `<g transform="scale(${64 / 24})">${mark}</g>` + wordmark),
    ),
  ]),
  writeFile(
    "public/icon.svg",
    svg(
      BRAND_ICON_VIEWBOX,
      "#0a0a0a",
      mark,
      "<style>@media(prefers-color-scheme:dark){svg{color:#fafafa}}</style>",
    ),
  ),
]);
console.log(
  "Generated Kalos UI logos, marks, and adaptive favicon from lib/brand.ts.",
);
