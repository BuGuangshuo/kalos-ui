export const site = {
  name: "Pop UI",
  description:
    "Small details. Better interfaces. A personal collection of thoughtful React components, built on shadcn/ui.",
  github: "https://github.com/BuGuangshuo/pop-ui",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
};
