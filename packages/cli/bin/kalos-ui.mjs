#!/usr/bin/env node
import { parseArgs } from "node:util";
import { install } from "../lib/installer.mjs";

const help = `Kalos UI — 在终端选择组件基础库并安装源码

用法：kalos-ui [add] [组件名称...] [选项]

不指定组件时安装全部组件；也可使用 add button card 或 add theme。

选项：
  --base <radix|base|aria>  指定 React 基础库，跳过选择步骤
  --framework <react|vue>  指定框架，默认识别当前项目
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
    if (positionals[0] === "add") positionals.shift();
    await install({ ...values, components: positionals, dryRun: values["dry-run"] });
  }
} catch (error) {
  console.error(error.code === "CANCELLED" ? "已取消安装。" : `Kalos UI: ${error.message}`);
  process.exitCode = error.exitCode || (error.code === "CANCELLED" ? 130 : 1);
}
