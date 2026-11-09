export const site = {
  name: "Pop UI",
  description:
    "一套可自由定制的开源 React 组件库。基于 shadcn/ui，提供中文文档、交互预览和完整源码。",
  github: "https://github.com/BuGuangshuo/pop-ui",
  figma: "https://www.figma.com/design/EiullLF6nF6hpxIENCatbU/Pop-UI",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://pop-ui-six.vercel.app"),
};
