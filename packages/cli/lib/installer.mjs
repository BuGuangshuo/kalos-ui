import { readFile, access } from "node:fs/promises";
import { resolve, join } from "node:path";
import prompts from "prompts";
import spawn from "cross-spawn";

export const manifest = JSON.parse(await readFile(new URL("../manifest.json", import.meta.url), "utf8"));
const bases = [
  { value: "radix", title: "Radix UI" },
  { value: "base", title: "Base UI" },
  { value: "aria", title: "React Aria" },
];
const backend = { radix: "radix", base: "base-ui", aria: "react-aria" };
const aliases = { radix: "radix", base: "base", "base-ui": "base", aria: "aria", "react-aria": "aria" };

async function readJson(path, required = false) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT" && !required) return undefined;
    if (error.code === "ENOENT") throw new Error("请在 React 或 Vue 项目根目录执行安装命令，或使用 --cwd 指定项目。");
    throw new Error(`无法读取 ${path}：${error.message}`);
  }
}

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

export function detectBase(config, pkg) {
  const style = config?.style || "";
  for (const base of bases) if (style.startsWith(`${base.value}-`)) return base.value;
  if (["default", "new-york"].includes(style)) return "radix";
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const detected = [
    deps["@base-ui/react"] && "base",
    deps["react-aria-components"] && "aria",
    (deps["radix-ui"] || Object.keys(deps).some((key) => key.startsWith("@radix-ui/"))) && "radix",
  ].filter(Boolean);
  return detected.length === 1 ? detected[0] : undefined;
}

export function detectFramework(pkg, config) {
  const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
  const react = ["react", "next", "@vitejs/plugin-react", "@astrojs/react"].some((key) => deps[key]);
  const vue = ["vue", "nuxt", "@vitejs/plugin-vue", "@astrojs/vue"].some((key) => deps[key]);
  if (react !== vue) return react ? "react" : "vue";
  if (config?.style?.startsWith("reka-")) return "vue";
  return undefined;
}

export async function detectManager(cwd, pkg) {
  const declared = pkg.packageManager?.split("@")[0];
  if (["npm", "pnpm", "yarn", "bun"].includes(declared)) return declared;
  for (const [file, manager] of [["pnpm-lock.yaml", "pnpm"], ["yarn.lock", "yarn"], ["bun.lock", "bun"], ["bun.lockb", "bun"], ["package-lock.json", "npm"]]) {
    if (await exists(join(cwd, file))) return manager;
  }
  return "npm";
}

export async function choose({ message, choices, initial = 0 }) {
  const answer = await prompts({ type: "select", name: "value", message, choices, initial }, {
    onCancel() { throw Object.assign(new Error("已取消安装"), { code: "CANCELLED" }); },
  });
  if (answer.value === undefined) throw Object.assign(new Error("已取消安装"), { code: "CANCELLED" });
  return answer.value;
}

function runner(manager, tool, args) {
  const prefix = {
    npm: ["npx", "--yes"],
    pnpm: ["pnpm", "dlx"],
    yarn: ["yarn", "dlx"],
    bun: ["bun", "x"],
  }[manager];
  return { command: prefix[0], args: [...prefix.slice(1), `${tool}@latest`, ...args] };
}

export async function createInstallPlan(options = {}, hooks = {}) {
  const cwd = resolve(options.cwd || process.cwd());
  const pkg = await readJson(join(cwd, "package.json"), true);
  const config = await readJson(join(cwd, "components.json"));
  const select = hooks.choose || choose;
  const interactive = hooks.interactive ?? Boolean(process.stdin.isTTY && process.stdout.isTTY);
  const requested = options.components?.length ? options.components : ["all"];
  const allowed = new Set([...manifest.components, "kalos-all", "kalos-theme"]);
  const components = [...new Set(requested.map((name) => name.startsWith("kalos-") ? name : `kalos-${name}`))];
  for (const name of components) if (!allowed.has(name)) throw new Error(`未知组件 ${name}。可安装：${[...allowed].join(", ")}`);
  let framework = options.framework || detectFramework(pkg, config);
  if (!framework) {
    if (!interactive) throw new Error("无法识别框架，请通过 --framework react 或 --framework vue 指定。");
    framework = await select({ message: "你的项目使用什么框架？", choices: [{ title: "React", value: "react" }, { title: "Vue", value: "vue" }] });
  }
  if (!["react", "vue"].includes(framework)) throw new Error("--framework 仅支持 react 或 vue。");

  let base;
  if (framework === "react") {
    const current = config ? detectBase(config, pkg) : undefined;
    if (options.base) {
      base = aliases[options.base];
      if (!base) throw new Error("--base 仅支持 radix、base 或 aria。");
    } else if (interactive) {
      base = await select({
        message: "选择要安装的基础组件库",
        choices: bases.map((item) => ({ ...item, description: item.value === current ? "当前项目使用的基础库" : undefined })),
        initial: Math.max(0, bases.findIndex((item) => item.value === current)),
      });
    } else {
      base = current;
      if (!base) throw new Error("非交互环境请通过 --base radix、--base base 或 --base aria 指定基础库。");
    }
    if (!backend[base]) throw new Error("请选择有效的基础组件库。");
    if (current && current !== base) {
      const label = bases.find((item) => item.value === current).title;
      throw new Error(`当前项目已配置 ${label}，请选择同一基础库。切换基础库请先在目标项目完成迁移，再运行安装器。`);
    }
  } else if (options.base && options.base !== "reka") {
    throw new Error("Vue 组件使用 Reka UI；Radix UI、Base UI 和 React Aria 适用于 React。");
  }

  const registryUrl = new URL(options.registry || manifest.registry);
  if (!["http:", "https:"].includes(registryUrl.protocol) || registryUrl.username || registryUrl.password || registryUrl.search || registryUrl.hash) {
    throw new Error("--registry 必须是 http(s) 站点地址。");
  }
  const registry = registryUrl.href.replace(/\/$/, "");
  const manager = await detectManager(cwd, pkg);
  const tool = framework === "vue" ? "shadcn-vue" : "shadcn";
  const commands = [];
  if (!config) {
    const init = framework === "vue"
      ? ["init", "--preset", "reka-nova"]
      : ["init", "--base", base, "--preset", `${base}-nova`, "--no-reinstall"];
    if (options.yes) init.push("--yes");
    commands.push(runner(manager, tool, init));
  }
  const family = framework === "vue" ? "vue" : backend[base];
  const urls = components.map((name) => `${registry}/r/${family}/${name}.json`);
  commands.push(runner(manager, tool, ["add", ...urls, ...(options.yes ? ["--yes"] : [])]));
  return { cwd, framework, base: base || "reka", manager, registry, components, commands };
}

export function runCommand({ command, args }, cwd) {
  return new Promise((done, reject) => {
    const child = spawn(command, args, { cwd, stdio: "inherit" });
    child.once("error", reject);
    child.once("close", (code, signal) => {
      if (code === 0) done();
      else reject(Object.assign(new Error(signal ? `安装已中断（${signal}）。` : `安装命令退出，状态码 ${code}。`), { exitCode: code || 1 }));
    });
  });
}

export async function install(options = {}, hooks = {}) {
  const plan = await createInstallPlan(options, hooks);
  const log = hooks.log || console.log;
  const label = bases.find((item) => item.value === plan.base)?.title || "Reka UI";
  log(`\nKalos UI · ${plan.framework === "vue" ? "Vue" : "React"} · ${label}\n`);
  for (const command of plan.commands) {
    log([command.command, ...command.args.map((arg) => /\s/.test(arg) ? JSON.stringify(arg) : arg)].join(" "));
    if (!options.dryRun) await (hooks.run || runCommand)(command, plan.cwd);
  }
  log(options.dryRun ? "\n预览完成，未修改项目。" : "\nKalos UI 安装完成。组件源码已添加到项目。");
  return plan;
}
