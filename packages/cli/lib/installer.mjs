import { readFile, lstat, mkdtemp, rename, rm } from "node:fs/promises";
import { resolve, join } from "node:path";
import prompts from "prompts";
import spawn from "cross-spawn";

export const manifest = JSON.parse(await readFile(new URL("../manifest.json", import.meta.url), "utf8"));
function requireBase(value) {
  if (value !== undefined && value !== "base" && value !== "base-ui") {
    throw new Error("Kalos UI 仅支持 Base UI；--base 可省略或设为 base。");
  }
  return "base";
}
const frameworks = [
  { value: "next", title: "Next.js" },
  { value: "vite", title: "React + Vite" },
  { value: "react-router", title: "React Router" },
];
const templates = frameworks;
const frameworkOptions = frameworks.map(item => item.value).join("、");
const managers = ["npm", "pnpm", "yarn", "bun"];

async function readJson(path, required = false) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT" && !required) return undefined;
    if (error.code === "ENOENT") throw new Error("请在已有 React 项目根目录执行 add，或使用 init 创建前端项目。");
    throw new Error(`无法读取 ${path}：${error.message}`);
  }
}

async function exists(path) {
  try { await lstat(path); return true; } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

export function detectBase(config, pkg) {
  const style = config?.style || "";
  for (const base of ["base", "radix", "aria"]) if (style.startsWith(`${base}-`)) return base;
  if (["default", "new-york"].includes(style)) return "radix";
  const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
  const detected = [
    deps["@base-ui/react"] && "base",
    deps["react-aria-components"] && "aria",
    (deps["radix-ui"] || Object.keys(deps).some((key) => key.startsWith("@radix-ui/"))) && "radix",
  ].filter(Boolean);
  return detected.length === 1 ? detected[0] : undefined;
}

function unsupportedFramework(pkg) {
  const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
  return ["@tanstack/react-start", "laravel-vite-plugin", "astro"].some(key => deps[key]);
}

export function detectFramework(pkg) {
  const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
  if (unsupportedFramework(pkg)) return undefined;
  if (deps.next) return "next";
  if (["@react-router/dev", "react-router", "react-router-dom"].some((key) => deps[key])) return "react-router";
  const react = ["react", "@vitejs/plugin-react", "@vitejs/plugin-react-swc"].some((key) => deps[key]);
  if (react && (deps.vite || deps["@vitejs/plugin-react"] || deps["@vitejs/plugin-react-swc"])) return "vite";
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

export async function input({ message, initial, validate }) {
  const answer = await prompts({ type: "text", name: "value", message, initial, validate }, {
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
  return { command: prefix[0], args: [...prefix.slice(1), `${tool}@latest`, ...args], manager };
}

export async function selectMode(options = {}, hooks = {}) {
  if (options.mode) {
    if (!["init", "add"].includes(options.mode)) throw new Error("安装方式仅支持 init 或 add。");
    return options.mode;
  }
  const interactive = hooks.interactive ?? Boolean(process.stdin.isTTY && process.stdout.isTTY);
  const hasProject = await exists(join(resolve(options.cwd || process.cwd()), "package.json"));
  if (!interactive) {
    if (hasProject) return "add";
    throw new Error("新建项目请使用 init，并指定 --template 和 --name。");
  }
  return (hooks.choose || choose)({
    message: "选择安装方式",
    choices: [{ title: "新建项目", value: "init" }, { title: "安装到已有项目", value: "add" }],
    initial: hasProject ? 1 : 0,
  });
}

function componentNames(requested) {
  const allowed = new Set([...manifest.components, "kalos-all", "kalos-theme"]);
  const components = [...new Set((requested?.length ? requested : ["all"]).map((name) => name.startsWith("kalos-") ? name : `kalos-${name}`))];
  for (const name of components) if (!allowed.has(name)) throw new Error(`未知组件 ${name}。可安装：${[...allowed].join(", ")}`);
  return components;
}

function registryOrigin(value) {
  const url = new URL(value || manifest.registry);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error("--registry 必须是 http(s) 站点地址。");
  }
  return url.href.replace(/\/$/, "");
}

function validateName(value) {
  return typeof value === "string" && value.length <= 128 && /^[a-z0-9][a-z0-9._-]*$/.test(value) && value !== "node_modules"
    ? true
    : "项目名使用小写字母、数字、连字符、下划线或点，不能包含目录路径。";
}

async function createProjectPlan(options, hooks) {
  const cwd = resolve(options.cwd || process.cwd());
  if (!await exists(cwd)) throw new Error("--cwd 指定的父目录不存在。");
  const interactive = hooks.interactive ?? Boolean(process.stdin.isTTY && process.stdout.isTTY);
  const select = hooks.choose || choose;
  const registry = registryOrigin(options.registry);
  const components = componentNames(options.components);
  if (!components.includes("kalos-theme")) components.push("kalos-theme");
  let framework = options.template || options.framework;
  if (!framework && interactive) framework = await select({ message: "选择前端脚手架", choices: templates });
  if (!templates.some((item) => item.value === framework)) throw new Error("新建项目请通过 --template next、vite 或 react-router 选择脚手架。");
  const base = requireBase(options.base);
  let name = options.name;
  if (name === undefined && interactive) name = await (hooks.input || input)({ message: "项目名称", initial: "my-app", validate: validateName });
  if (name === undefined) throw new Error("新建项目请通过 --name 指定项目名称。");
  const valid = validateName(name);
  if (valid !== true) throw new Error(valid);
  const projectDir = join(cwd, name);
  if (await exists(projectDir)) throw new Error(`目标目录 ${projectDir} 已存在。请选择新的项目名，或使用 add 安装到已有项目。`);
  let manager = options.packageManager;
  if (manager === undefined && interactive) manager = await select({ message: "选择包管理器", choices: managers.map(value => ({ title: value, value })) });
  manager ??= "npm";
  if (!managers.includes(manager)) throw new Error("--package-manager 仅支持 npm、pnpm、yarn 或 bun。");
  const urls = components.map(component => `${registry}/r/${component}.json`);
  const init = ["init", ...urls, "--name", name, "--template", framework, "--base", base, "--preset", "nova", "--no-monorepo", "--no-reinstall"];
  if (options.yes) init.push("--yes");
  return {
    mode: "init", cwd, projectDir, name, framework, base, manager, registry, components,
    commands: [{ ...runner(manager, "shadcn", init), cwd }],
  };
}

export async function createInstallPlan(options = {}, hooks = {}) {
  if (options.mode === "init") return createProjectPlan(options, hooks);
  if (options.mode && options.mode !== "add") throw new Error("安装方式仅支持 init 或 add。");
  if (options.template || options.name || options.packageManager) throw new Error("--template、--name 和 --package-manager 用于 init；已有项目请直接使用 add。");
  const cwd = resolve(options.cwd || process.cwd());
  const pkg = await readJson(join(cwd, "package.json"), true);
  const config = await readJson(join(cwd, "components.json"));
  const select = hooks.choose || choose;
  const interactive = hooks.interactive ?? Boolean(process.stdin.isTTY && process.stdout.isTTY);
  const components = componentNames(options.components);
  const detectedFramework = detectFramework(pkg);
  const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
  if (config?.style?.startsWith("reka-") || (!detectedFramework && ["vue", "nuxt", "@vitejs/plugin-vue", "@astrojs/vue"].some((key) => deps[key]))) {
    throw new Error("当前版本提供 React 组件，不再支持 Vue / Nuxt。");
  }
  if (unsupportedFramework(pkg)) throw new Error("当前安装器仅支持 Next.js、Vite 和 React Router 项目。");
  let framework = options.framework || detectedFramework;
  if (!framework) {
    if (!interactive) throw new Error(`无法识别 React 项目，请通过 --framework ${frameworkOptions} 指定。`);
    framework = await select({ message: "你的项目使用什么框架？", choices: frameworks });
  }
  if (!frameworks.some((item) => item.value === framework)) throw new Error(`--framework 仅支持 ${frameworkOptions}。`);

  const base = requireBase(options.base);
  const current = detectBase(config, pkg);
  if (current && current !== base) {
    const label = current === "radix" ? "Radix UI" : "React Aria";
    throw new Error(`当前项目已配置 ${label}，Kalos UI 仅支持 Base UI。请先完成基础库迁移，再运行安装器。`);
  }
  if (config && !current) throw new Error("无法确认现有 components.json 使用 Base UI。请先将项目迁移并配置为 base-* 风格，再运行安装器。");

  const registry = registryOrigin(options.registry);
  const manager = await detectManager(cwd, pkg);
  const commands = [];
  if (!config) {
    const init = ["init", "--base", base, "--preset", "nova", "--no-reinstall"];
    init.push("--template", framework);
    if (options.yes) init.push("--yes");
    commands.push(runner(manager, "shadcn", init));
  }
  const urls = components.map((name) => `${registry}/r/${name}.json`);
  commands.push(runner(manager, "shadcn", ["add", ...urls, ...(options.yes ? ["--yes"] : [])]));
  return { mode: "add", cwd, framework, base, manager, registry, components, commands };
}

export function runCommand({ command, args, manager }, cwd) {
  return new Promise((done, reject) => {
    const child = spawn(command, args, {
      cwd, stdio: "inherit",
      env: manager ? { ...process.env, npm_config_user_agent: `${manager}/kalos-ui` } : process.env,
    });
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
  log(`\nKalos UI · ${frameworks.find((item) => item.value === plan.framework).title} · Base UI\n`);
  if (plan.mode === "init") log(`新建项目：${plan.projectDir}\n`);
  let staging;
  try {
    if (!options.dryRun && plan.mode === "init") {
      // An empty staging directory keeps shadcn from initializing the parent project.
      staging = await mkdtemp(join(plan.cwd, ".kalos-init-"));
    }
    for (const [index, command] of plan.commands.entries()) {
      log([command.command, ...command.args.map((arg) => /\s/.test(arg) ? JSON.stringify(arg) : arg)].join(" "));
      if (!options.dryRun) {
        const cwd = staging ? (index === 0 ? staging : join(staging, plan.name)) : plan.cwd;
        await (hooks.run || runCommand)(command, cwd);
      }
    }
    if (staging) {
      if (await exists(plan.projectDir)) throw new Error(`目标目录 ${plan.projectDir} 已存在，未覆盖。`);
      await rename(join(staging, plan.name), plan.projectDir);
    }
  } finally {
    if (staging) await rm(staging, { recursive: true, force: true });
  }
  log(options.dryRun ? "\n预览完成，未修改项目。" : plan.mode === "init" ? `\n项目已创建：${plan.projectDir}\n进入项目后运行 ${plan.manager === "npm" ? "npm run" : plan.manager} dev。` : "\nKalos UI 安装完成。组件源码已添加到项目。");
  return plan;
}
