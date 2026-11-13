# Kalos UI CLI

统一安装 Base UI 组件源码，支持 Next.js、Vite 与 React Router。

```bash
kalos-ui init my-app --template vite --package-manager npm --yes
kalos-ui add
kalos-ui add button dialog
kalos-ui add --dry-run
```

`init` 选择脚手架、项目名与包管理器，在新目录创建项目并安装全部组件和主题。`add` 识别已有框架与包管理器，保留主题、目录和别名；已有项目需配置 TypeScript、Tailwind CSS 与路径别名。两种方式均默认使用 Base UI，`--base base` 为可选参数。

已有其他基础库的项目须先迁移。安装器不会自动改写其基础库配置。`--dry-run` 只显示命令，不修改项目。

`--framework next|vite|react-router` 可覆盖框架识别；`--registry URL` 指定注册表站点；`--cwd` 指定工作目录。运行 `kalos-ui --help` 查看完整参数。
