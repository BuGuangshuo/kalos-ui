export const site = {
  name: "Pop UI",
  description:
    "开箱即用的 React / Vue 组件。源码直接装进项目，样式和交互随你改。",
  github: "https://github.com/BuGuangshuo/pop-ui",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://pop-ui-six.vercel.app"),
};
