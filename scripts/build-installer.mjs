import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { copyFile, mkdir, mkdtemp, readFile, readdir, rm, writeFile, chmod } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { catalog } from "../lib/catalog.ts";
import { site } from "../lib/site.ts";

const directory = resolve("packages/cli");
const pkg = JSON.parse(await readFile(join(directory, "package.json"), "utf8"));
await writeFile(join(directory, "manifest.json"), JSON.stringify({
  registry: site.url.replace(/\/$/, ""),
  components: catalog.map((item) => item.slug),
}, null, 2) + "\n");
await copyFile("LICENSE", join(directory, "LICENSE"));
await chmod(join(directory, "bin/kalos-ui.mjs"), 0o755);
const temporary = await mkdtemp(join(tmpdir(), "kalos-installer-"));
try {
  const { stdout } = await promisify(execFile)("npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", temporary], { cwd: directory });
  const [{ filename }] = JSON.parse(stdout);
  await mkdir("public/cli", { recursive: true });
  const output = `public/cli/kalos-ui-${pkg.version}.tgz`;
  await copyFile(join(temporary, filename), output);
  await Promise.all((await readdir("public/cli")).filter(name => /^kalos-ui-.*\.tgz$/.test(name) && name !== `kalos-ui-${pkg.version}.tgz`).map(name => rm(join("public/cli", name))));
  console.log(`Built interactive installer: ${output}`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
