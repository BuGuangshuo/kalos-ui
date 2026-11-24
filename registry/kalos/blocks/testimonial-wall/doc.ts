export const blockDoc = {
  slug: "testimonial-wall",
  english: "Testimonial Wall",
  title: "客户评价墙",
  description: "客户评价分列上下滚动，每列使用不同的起点和速度。悬停、聚焦或触屏按住可暂停一列，鼠标拖动可浏览其他评价。",
  usage: `import { KalosTestimonialWall, testimonials } from "@/components/blocks/testimonial-wall";

export function CustomerQuotes() {
  return (
    <KalosTestimonialWall
      items={testimonials}
      columns={3}
      speed={26}
      label="客户评价"
    />
  );
}`,
  props: [
    ["items", "Testimonial[]", "内置示例", "评价列表。空数组会显示空状态，评价数量少于列数时自动减少列数。"],
    ["items[].quote", "string", "必填", "评价正文。保留换行，最多显示十行。"],
    ["items[].name", "string", "必填", "作者名称，缺少头像时用于生成姓名缩写。"],
    ["items[].role", "string", "—", "作者职位，显示在姓名下方。"],
    ["items[].company", "string", "—", "作者所在机构，与职位以间隔点分隔。"],
    ["items[].avatar", "string", "—", "头像图片地址。缺少图片或加载失败时使用姓名缩写。"],
    ["items[].rating", "number", "—", "1 至 5 星，省略时隐藏星级。"],
    ["items[].verified", "boolean", "false", "在作者姓名旁显示认证图标。"],
    ["columns", "1 | 2 | 3", "3", "最大列数。容器宽度低于 740px 时最多两列，低于 480px 时一列。"],
    ["speed", "number", "28", "第一列每秒移动的像素数。第二列反向，第三列略快。"],
    ["pauseOnHover", "boolean", "true", "指针移入一列时减速暂停，移出时恢复。键盘聚焦始终暂停该列。"],
    ["label", "string", '"What customers say"', "评价墙的可访问名称。"],
    ["className", "string", "—", "附加到根元素的类名。Clean 可用 --ui-twc-height 和 --ui-twc-fade 调整高度及渐隐距离，Classic 对应 --ui-tw-height 和 --ui-tw-fade。"],
    ["appearance", '"clean" | "classic"', '"clean"', "选择卡片边缘、头像尺寸、排版和渐隐样式。"],
  ],
  keyboard: [
    ["Tab / Shift + Tab", "向前或向后聚焦一张评价卡；当前列暂停并将卡片移入可见范围，焦点离开后继续滚动。"],
  ],
} as const;
