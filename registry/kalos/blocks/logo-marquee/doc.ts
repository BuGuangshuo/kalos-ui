export const blockDoc = {
  slug: "logo-marquee",
  english: "Logo Marquee",
  title: "品牌滚动条",
  description: "品牌标志沿水平方向无缝循环。双行交错排列并反向移动，可拖动快转，悬停时标志渐显品牌色。",
  usage: `import { KalosLogoMarquee, marqueeLogos } from "@/components/blocks/logo-marquee";

export function BrandStrip() {
  return (
    <KalosLogoMarquee
      logos={marqueeLogos}
      rows={2}
      speed={36}
      labels="beside"
      label="合作品牌"
    />
  );
}`,
  props: [
    ["logos", "MarqueeLogo[]", "内置品牌", "品牌列表。传入空数组时隐藏滚动条。"],
    ["logos[].name", "string", "必填", "品牌名称，也是标志的可访问名称。"],
    ["logos[].svg", "ReactNode", "—", "内联标志。使用 currentColor 填充或描边，可随悬停状态变色。"],
    ["logos[].src", "string", "—", "标志图片地址。缺少图形或图片加载失败时，显示品牌名或首字母。"],
    ["logos[].color", "string", "—", "品牌色。灰度模式下，指针悬停或键盘聚焦时显示。"],
    ["logos[].scale", "number", "1", "标志的视觉尺寸倍率，名称字号和布局间距保持一致。"],
    ["logos[].href", "string", "—", "将指定品牌变成可访问的链接。"],
    ["speed", "number", "40", "每秒滚动的像素数。"],
    ["direction", '"left" | "right"', '"left"', "第一行的移动方向。"],
    ["rows", "1 | 2", "1", "双行时，品牌按顺序交错分配，两行反向移动。"],
    ["gap", "number", "56", "相邻品牌之间的像素间距，窄容器中缩小至 62%。"],
    ["pauseOnHover", "boolean", "true", "指针移入后减速，移出后恢复。键盘聚焦会暂停滚动。"],
    ["grayscale", "boolean", "true", "以灰色显示标志，悬停时恢复品牌色；关闭后直接展示品牌色。"],
    ["labels", '"none" | "below" | "beside"', '"none"', "隐藏名称、在标志下方显示名称或并排显示。"],
    ["label", "string", '"Logos of companies using the product"', "滚动区域的可访问名称。"],
    ["className", "string", "—", "附加到滚动条根元素的类名。"],
    ["appearance", '"clean" | "classic"', '"clean"', "选择标志尺寸、边缘渐隐和文字外观。"],
  ],
  keyboard: [
    ["Tab / Shift + Tab", "依次聚焦品牌链接。无链接时，整个滚动条作为一个焦点。"],
    ["← / →", "切换到同行相邻链接，或在无链接时移动滚动条。"],
    ["Enter", "打开当前聚焦的品牌链接。"],
  ],
} as const;
