#!/usr/bin/env node
import { parseArgs } from "node:util";
import { install, selectMode } from "../lib/installer.mjs";

const help = `Kalos UI — 在终端选择组件基础库并安装源码

用法：
  kalos-ui init [项目名] [选项]    创建前端项目并安装组件库
  kalos-ui add [组件名称...] [选项] 安装到已有项目
  kalos-ui                        交互选择安装方式

不指定组件时安装全部组件；也可使用 add button card 或 add theme。

选项：
  --base <radix|base|aria>  指定 React 基础库，跳过选择步骤
  --template <名称>         init 脚手架：next / vite / react-router
  --name <项目名>           init 新项目名称
  --package-manager <名称>  init 包管理器：npm / pnpm / yarn / bun
  --framework <名称>        next / vite / react-router
  --cwd <目录>             项目目录，默认为当前目录
  --registry <URL>         注册表站点，默认使用安装包所属站点
  --dry-run                只显示将执行的命令，不修改项目
  --yes, -y                跳过 shadcn 的安装确认
  --help, -h               显示帮助
`;

try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      base: { type: "string" },
      framework: { type: "string" },
      template: { type: "string", short: "t" },
      name: { type: "string", short: "n" },
      "package-manager": { type: "string" },
      cwd: { type: "string" },
      registry: { type: "string" },
      "dry-run": { type: "boolean" },
      yes: { type: "boolean", short: "y" },
      help: { type: "boolean", short: "h" },
    },
  });
  if (values.help) {
    console.log(help);
  } else {
    const command = ["init", "add"].includes(positionals[0]) ? positionals.shift() : undefined;
    let name = values.name;
    if (command === "init" && positionals.length) {
      if (positionals.length > 1 || name) throw new Error("init 仅接受一个项目名，请使用位置参数或 --name 指定。");
      name = positionals.shift();
    }
    const options = { ...values, name, packageManager: values["package-manager"], dryRun: values["dry-run"] };
    const mode = await selectMode({ ...options, mode: command || (positionals.length ? "add" : undefined) });
    await install({ ...options, mode, components: positionals });
  }
} catch (error) {
  console.error(error.code === "CANCELLED" ? "已取消安装。" : `Kalos UI: ${error.message}`);
  process.exitCode = error.exitCode || (error.code === "CANCELLED" ? 130 : 1);
}
