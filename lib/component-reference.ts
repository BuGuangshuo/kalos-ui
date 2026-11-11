import type { Primitive } from "@/lib/use-primitive";

type Row = [name: string, type: string, initial: string, detail: string];
type Reference = { props: Row[]; keyboard: [key: string, action: string][] };

const optionalDescription: Row = ["description", "string", "—", "仅在需要补充信息时显示"];
const label: Row = ["label", "string", "—", "控件的可见标签"];

const references: Record<string, Reference> = {
  "kalos-command-menu": { props: [
    ["groups", "KalosCommandGroup[]", "—", "分组与操作项；每项包含唯一值、名称、可选上下文、图标与禁用状态"],
    ["query", "string", "—", "受控搜索词"], ["defaultQuery", "string", '\"\"', "非受控时的初始搜索词"],
    ["onQueryChange", "(query: string) => void", "—", "搜索词变化时调用"], ["onRun", "(value: string) => void", "—", "执行可用操作后回调"], ["onClose", "() => void", "—", "搜索词为空时按 Esc 触发，可用于关闭外层对话框"],
    ["filter", "boolean", "true", "按名称、字符串上下文与关键词过滤；外部全文搜索时设为 false"], ["autoFocus", "boolean", "false", "挂载时聚焦搜索框"], ["placeholder", "string", "搜索命令…", "空输入提示"], ["label", "string", "命令菜单", "搜索框及结果列表的可访问名称"], ["emptyMessage", "string", "没有找到匹配的内容", "没有匹配项时的文案"],
  ], keyboard: [["↑ / ↓", "在可用项之间移动，跳过禁用项"], ["Tab / Shift+Tab", "跳到下一组或上一组"], ["Ctrl / ⌘ + Home / End", "移动到首项或末项"], ["Enter", "执行当前操作"], ["Esc", "先清空搜索词，再请求关闭"]] },
  "kalos-button": { props: [["variant", '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"', "default", "按钮样式"], ["size", '"default" | "sm" | "lg" | "icon"', "default", "尺寸；同时支持基础组件的其他尺寸"], ["loading", "boolean", "false", "显示加载状态并禁用操作"], ["disabled", "boolean", "false", "禁用按钮"], ["onClick", "() => void", "—", "点击或键盘激活时调用"]], keyboard: [["Enter / Space", "激活按钮"], ["Tab", "移动到下一个可操作元素"]] },
  "kalos-popover": { props: [["trigger", "string", "—", "触发按钮文字"], ["label", "string", "trigger", "浮层与操作列表的可访问名称"], ["items", "{ value: string; label: string; disabled?: boolean }[]", "[]", "操作列表；禁用项不响应操作"], ["onAction", "(value: string) => void", "—", "激活列表项后关闭浮层并回调"], ["children", "ReactNode", "—", "自定义内容；传入时替代操作列表"], ["align", '\"start\" | \"center\" | \"end\"', "start", "浮层与触发元素的对齐方式"], ["open", "boolean", "—", "受控打开状态"], ["defaultOpen", "boolean", "false", "初始打开状态"], ["onOpenChange", "(open: boolean) => void", "—", "打开状态变化"], ["disabled", "boolean", "false", "禁用触发按钮"]], keyboard: [["Enter / Space", "打开浮层或激活当前操作"], ["↑ / ↓", "移动到相邻的可用列表项"], ["Home / End", "移动到首项或末项"], ["Esc", "关闭并返回触发按钮"]] },
  "kalos-input": { props: [label, ["value", "string | number", "—", "受控输入值"], ["type", "HTMLInputTypeAttribute", "text", "原生输入类型"], ["hint", "string", "—", "必要的输入约束或提示"], ["error", "string", "—", "校验错误；显示时替代提示"], ["disabled", "boolean", "false", "禁用输入"]], keyboard: [["Tab", "聚焦输入框或移动到下一项"]] },
  "kalos-select": { props: [label, ["items", "{ value: string; label: string }[]", "—", "可选项"], ["value", "string", "—", "当前选中的值"], ["onValueChange", "(value: string) => void", "—", "选择变化时调用"], ["placeholder", "string", "请选择", "未选择时显示"]], keyboard: [["Enter / Space", "展开列表或确认选项"], ["↑ / ↓", "在选项间移动"], ["Home / End", "移动到第一项或最后一项"], ["Esc", "关闭列表"]] },
  "kalos-switch": { props: [label, optionalDescription, ["checked", "boolean", "—", "受控开关状态"], ["defaultChecked", "boolean", "false", "初始状态"], ["onCheckedChange", "(checked: boolean) => void", "—", "状态变化时调用"], ["disabled", "boolean", "false", "禁用开关"]], keyboard: [["Space", "切换开关"], ["Tab", "移动到下一个控件"]] },
  "kalos-checkbox": { props: [label, optionalDescription, ["checked", 'boolean | "indeterminate"', "—", "受控选中状态"], ["defaultChecked", "boolean", "false", "初始状态"], ["onCheckedChange", '(checked: boolean | "indeterminate") => void', "—", "选中状态变化时调用"], ["disabled", "boolean", "false", "禁用复选框"]], keyboard: [["Space", "切换选中状态"], ["Tab", "移动到下一项"]] },
  "kalos-tabs": { props: [["items", "{ value: string; label: string; content: ReactNode }[]", "—", "标签与对应内容"], ["defaultValue", "string", "首项 value", "初始激活项"]], keyboard: [["← / →", "切换相邻标签"], ["Home / End", "跳转到首项或末项"], ["Tab", "进入当前面板"]] },
  "kalos-card": { props: [["title", "string", "—", "卡片标题"], optionalDescription, ["children", "ReactNode", "—", "卡片内容"], ["footer", "ReactNode", "—", "底部操作区"]], keyboard: [] },
  "kalos-badge": { props: [["status", '"neutral" | "success" | "warning"', "neutral", "状态语义"], ["children", "ReactNode", "—", "状态名称"]], keyboard: [] },
  "kalos-accordion": { props: [["items", "{ question: string; answer: ReactNode }[]", "—", "标题与展开内容；一次展开一项"]], keyboard: [["Enter / Space", "展开或收起当前项"], ["↑ / ↓", "移动到相邻标题"], ["Home / End", "移动到首项或末项"]] },
  "kalos-alert-dialog": { props: [["trigger", "string", "—", "触发按钮文本"], ["title", "string", "—", "确认对话框标题"], ["description", "string", "—", "操作的影响或不可恢复的结果"], ["actionLabel", "string", "确认", "确认按钮文字"], ["cancelLabel", "string", "取消", "取消按钮文字"], ["onConfirm", "() => void", "—", "仅确认时调用；取消、Esc 和遮罩点击不会触发"], ["open", "boolean", "—", "受控打开状态"], ["onOpenChange", "(open: boolean) => void", "—", "打开状态变化时调用"]], keyboard: [["Enter / Space", "打开或激活当前按钮"], ["Tab / Shift + Tab", "在确认与取消之间移动焦点"], ["Esc", "取消并返回触发按钮"]] },
  "kalos-dialog": { props: [["trigger", "string", "—", "触发按钮文本"], ["title", "string", "—", "对话框标题与可访问名称"], optionalDescription, ["children", "ReactNode", "—", "对话框内容"], ["footer", "ReactNode", "—", "底部操作区"], ["open", "boolean", "—", "受控打开状态"], ["onOpenChange", "(open: boolean) => void", "—", "打开状态变化时调用"]], keyboard: [["Enter / Space", "打开对话框"], ["Tab / Shift + Tab", "在对话框内移动焦点"], ["Esc", "关闭并返回触发按钮"]] },
  "kalos-progress": { props: [label, ["value", "number", "—", "进度，自动限制为 0–100"], optionalDescription], keyboard: [] },
  "kalos-avatar-stack": { props: [["people", "{ name: string; image?: string }[]", "—", "成员及头像地址；无图片时显示姓名缩写"], ["max", "number", "4", "可见头像数量，其余显示为计数"]], keyboard: [] },
};

export function componentReference(slug: string, framework: string, primitive: Primitive): Reference {
  const source = references[slug] ?? { props: [], keyboard: [] };
  const props = source.props.map(row => [...row] as Row);
  if (slug === "kalos-checkbox" && framework !== "vue" && primitive !== "radix") {
    for (const row of props) {
      if (row[0] === "checked") row[1] = "boolean";
      if (row[0] === "onCheckedChange") row[1] = "(checked: boolean) => void";
    }
    props.push([primitive === "base-ui" ? "indeterminate" : "isIndeterminate", "boolean", "false", "部分选中状态"]);
  }
  if (slug === "kalos-button" && primitive === "react-aria" && framework !== "vue") {
    props.push(["onPress", "(event: PressEvent) => void", "—", "React Aria 的统一激活事件"]);
  }
  if (framework === "vue" && slug === "kalos-command-menu") {
    return { props: props.filter(row => !["defaultQuery", "onQueryChange"].includes(row[0])).map(([name, type, initial, detail]) => [name === "query" ? "v-model:query" : name === "onRun" ? "@run" : name === "onClose" ? "@close" : name, name === "groups" ? "CommandGroup[]" : type, name === "query" ? '""' : initial, detail] as Row), keyboard: source.keyboard };
  }
  if (framework === "vue") {
    const model = ["kalos-input", "kalos-select"].includes(slug) ? "string | number" : "boolean";
    for (const row of props) {
      if (["value", "checked"].includes(row[0]) && slug !== "kalos-progress") { row[0] = "v-model"; row[1] = slug === "kalos-checkbox" ? 'boolean | "indeterminate"' : model; }
      row[1] = row[1].replaceAll("ReactNode", "string");
    }
    if (["kalos-card", "kalos-dialog", "kalos-badge", "kalos-popover"].includes(slug)) {
      for (const row of props) { if (row[0] === "children") { row[0] = "default"; row[1] = "slot"; } if (row[0] === "footer") row[1] = "slot"; }
    }
    if (slug === "kalos-popover") {
      for (const row of props) { if (row[0] === "open") row[0] = "v-model:open"; if (row[0] === "onAction") row[0] = "@action"; }
    }
    if (["kalos-dialog", "kalos-alert-dialog"].includes(slug)) { for (const row of props) if (row[0] === "open") { row[0] = "v-model:open"; row[2] = "false"; } }
    if (slug === "kalos-alert-dialog") for (const row of props) if (row[0] === "onConfirm") row[0] = "@confirm";
    return { props: props.filter(row => !["onClick", "onCheckedChange", "onValueChange", "defaultChecked", "variant", "size", "onOpenChange", "defaultOpen"].includes(row[0])), keyboard: source.keyboard };
  }
  return { props, keyboard: source.keyboard };
}
