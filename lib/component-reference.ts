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
  "kalos-popover": { props: [["trigger", "string", "—", "触发按钮文字"], ["label", "string", "trigger", "浮层与操作列表的可访问名称"], ["items", "{ value: string; label: string; disabled?: boolean }[]", "[]", "操作列表；禁用项不响应操作"], ["onAction", "(value: string) => void", "—", "激活列表项后关闭浮层并回调"], ["children", "ReactNode", "—", "说明、表单等自定义内容；传入时替代操作列表"], ["contentClassName", "string", "—", "浮层容器的样式类，可调整内容宽度"], ["align", '\"start\" | \"center\" | \"end\"', "start", "浮层与触发元素的对齐方式"], ["open", "boolean", "—", "受控打开状态"], ["defaultOpen", "boolean", "false", "初始打开状态"], ["onOpenChange", "(open: boolean) => void", "—", "打开状态变化"], ["disabled", "boolean", "false", "禁用触发按钮"]], keyboard: [["Enter / Space", "打开浮层或激活当前操作"], ["Tab / Shift+Tab", "在浮层内的字段与按钮之间移动"], ["↑ / ↓", "在操作列表中移动到相邻的可用项"], ["Home / End", "在操作列表中移动到首项或末项"], ["Esc", "关闭并返回触发按钮"]] },
  "kalos-form": { props: [
    ["title", "string", "表单", "卡片标题"],
    ["fields", "KalosFormField[]", "—", "字段列表；每项的 name 唯一，支持 text、email、password、select、checkbox、switch"],
    ["fields[].required", "boolean", "false", "输入与选择项显示红色 *，复选框不显示；格式随输入实时校验，必填空值在保存或已填内容清空时校验"],
    ["fields[].minLength", "number", "—", "文本与密码的最少字符数；密码不去除空格"],
    ["fields[].hint", "string", "—", "输入约束；校验错误出现时替代此提示"],
    ["fields[].items", "{ value: string; label: string }[]", "—", "select 的候选项"],
    ["fields[].placeholder / autoComplete / disabled", "string / string / boolean", "—", "输入占位、自动填充与字段禁用状态"],
    ["defaultValues", "Record<string, string | boolean>", "{}", "挂载时的初始值；后续更换数据时通过 key 重新挂载"],
    ["validate", "(values: KalosFormValues) => Record<string, string>", "—", "同步自定义校验，按字段名返回错误；叠加在内置必填、邮箱、选项与长度校验上"],
    ["onSubmit", "(values: KalosFormValues) => void | Promise<void>", "—", "点击保存校验全部字段后调用；等待保存时禁用控件，异常时保留输入并显示错误"],
    ["onCancel", "() => void", "—", "恢复到初始值或最近一次保存成功的值，并清除错误"],
    ["submitLabel / cancelLabel", "string", "保存 / 取消", "操作按钮文本"],
    ["disabled", "boolean", "false", "禁用整个表单"],
  ], keyboard: [["Tab / Shift + Tab", "按顺序移动到字段、密码显示按钮与操作按钮"], ["Enter", "在文本输入中提交，校验失败时聚焦首个错误字段"], ["Space", "切换复选框、开关，或激活当前按钮"], ["↑ / ↓ / Esc", "在选择器内移动选项或关闭列表"]] },
  "kalos-input": { props: [label, ["value", "string | number", "—", "受控输入值"], ["type", "HTMLInputTypeAttribute", "text", "原生输入类型"], ["hint", "string", "—", "必要的输入约束或提示"], ["error", "string", "—", "校验错误；显示时替代提示"], ["disabled", "boolean", "false", "禁用输入"], ["clearable", "boolean", "true", "普通输入非空且可编辑时，hover 或键盘聚焦显示清空；密码仅保留眼睛图标"], ["onClear", "() => void", "—", "点击清空或按 Esc 清空后调用"], ["type=\"password\"", "string", "—", "末尾提供眼睛图标切换显示与隐藏"]], keyboard: [["Tab", "聚焦输入框或移动到下一项"]] },
  "kalos-select": { props: [label, ["items", "{ value: string; label: string }[]", "—", "可选项"], ["value", "string", "—", "当前选中的值"], ["onValueChange", "(value: string) => void", "—", "选择变化时调用"], ["placeholder", "string", "请选择", "未选择时显示"], ["hint / error", "string", "—", "约束提示或校验错误，错误优先"], ["clearable", "boolean", "true", "有值时 hover 箭头区域才替换为清空图标；键盘聚焦同样可用，清空后恢复触发器焦点并回调空字符串"], ["name / id / required / disabled", "原生字段属性", "—", "表单字段关联与状态"]], keyboard: [["Enter / Space", "展开列表或确认选项"], ["↑ / ↓", "在选项间移动"], ["Home / End", "移动到第一项或最后一项"], ["Esc", "关闭列表"]] },
  "kalos-switch": { props: [label, optionalDescription, ["error", "string", "—", "校验错误；显示时替代说明并关联控件"], ["checked", "boolean", "—", "受控开关状态"], ["defaultChecked", "boolean", "false", "初始状态"], ["onCheckedChange", "(checked: boolean) => void", "—", "状态变化时调用"], ["disabled", "boolean", "false", "禁用开关"]], keyboard: [["Space", "切换开关"], ["Tab", "移动到下一个控件"]] },
  "kalos-checkbox": { props: [label, optionalDescription, ["error", "string", "—", "校验错误；显示时替代说明并关联控件"], ["checked", 'boolean | "indeterminate"', "—", "受控选中状态"], ["defaultChecked", "boolean", "false", "初始状态"], ["onCheckedChange", '(checked: boolean | "indeterminate") => void', "—", "选中状态变化时调用"], ["disabled", "boolean", "false", "禁用复选框"]], keyboard: [["Space", "切换选中状态"], ["Tab", "移动到下一项"]] },
  "kalos-tabs": { props: [["items", "{ value: string; label: string; content: ReactNode }[]", "—", "标签与对应内容"], ["defaultValue", "string", "首项 value", "初始激活项"]], keyboard: [["← / →", "切换相邻标签"], ["Home / End", "跳转到首项或末项"], ["Tab", "进入当前面板"]] },
  "kalos-card": { props: [["title", "string", "—", "卡片标题"], optionalDescription, ["children", "ReactNode", "—", "卡片内容"], ["footer", "ReactNode", "—", "底部操作区"]], keyboard: [] },
  "kalos-badge": { props: [["status", '"neutral" | "success" | "warning"', "neutral", "状态语义"], ["children", "ReactNode", "—", "状态名称"]], keyboard: [] },
  "kalos-accordion": { props: [["items", "{ question: string; answer: ReactNode }[]", "—", "标题与展开内容；一次展开一项"]], keyboard: [["Enter / Space", "展开或收起当前项"], ["↑ / ↓", "移动到相邻标题"], ["Home / End", "移动到首项或末项"]] },
  "kalos-alert-dialog": { props: [["trigger", "string", "—", "触发按钮文本"], ["title", "string", "—", "确认对话框标题"], ["description", "string", "—", "操作的影响或不可恢复的结果"], ["actionLabel", "string", "确认", "确认按钮文字"], ["cancelLabel", "string", "取消", "取消按钮文字"], ["onConfirm", "() => void", "—", "仅确认时调用；取消、Esc 和遮罩点击不会触发"], ["open", "boolean", "—", "受控打开状态"], ["onOpenChange", "(open: boolean) => void", "—", "打开状态变化时调用"]], keyboard: [["Enter / Space", "打开或激活当前按钮"], ["Tab / Shift + Tab", "在确认与取消之间移动焦点"], ["Esc", "取消并返回触发按钮"]] },
  "kalos-dialog": { props: [["trigger", "string", "—", "触发按钮文本"], ["title", "string", "—", "对话框标题与可访问名称"], optionalDescription, ["children", "ReactNode", "—", "对话框内容"], ["footer", "ReactNode", "—", "底部操作区"], ["open", "boolean", "—", "受控打开状态"], ["onOpenChange", "(open: boolean) => void", "—", "打开状态变化时调用"]], keyboard: [["Enter / Space", "打开对话框"], ["Tab / Shift + Tab", "在对话框内移动焦点"], ["Esc", "关闭并返回触发按钮"]] },
  "kalos-progress": { props: [label, ["value", "number", "—", "进度，自动限制为 0–100"], optionalDescription], keyboard: [] },
  "kalos-avatar-stack": { props: [["people", "{ name: string; image?: string }[]", "—", "成员及头像地址；无图片时显示姓名缩写"], ["max", "number", "4", "可见头像数量，其余显示为计数"]], keyboard: [] },
};

export function componentReference(slug: string, primitive: Primitive): Reference {
  const source = references[slug] ?? { props: [], keyboard: [] };
  const props = source.props.map(row => [...row] as Row);
  if (slug === "kalos-checkbox" && primitive !== "radix") {
    for (const row of props) {
      if (row[0] === "checked") row[1] = "boolean";
      if (row[0] === "onCheckedChange") row[1] = "(checked: boolean) => void";
    }
    props.push([primitive === "base-ui" ? "indeterminate" : "isIndeterminate", "boolean", "false", "部分选中状态"]);
  }
  if (slug === "kalos-button" && primitive === "react-aria") {
    props.push(["onPress", "(event: PressEvent) => void", "—", "React Aria 的统一激活事件"]);
  }
  return { props, keyboard: source.keyboard };
}
