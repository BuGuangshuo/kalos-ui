export type TemplateSourceView = { scope: string; file: string };
export type TemplateSources = {
  defaultPage: string;
  pages: Readonly<Record<string, TemplateSourceView>>;
  fallback: TemplateSourceView;
};

type Template = {
  slug: string;
  category: string;
  href: string;
  previewHref: string;
  english: string;
  title: string;
  description?: string;
  componentName: string;
  sources: TemplateSources;
};

const slug = "dashboard-01";
const dashboardHref = `/templates/${slug}`;
const components = `components/templates/${slug}`;

export const dashboardTemplate: Template = {
  slug,
  category: "仪表盘",
  href: dashboardHref,
  previewHref: `${dashboardHref}/preview`,
  english: slug,
  title: "基础仪表盘",
  componentName: "KalosDashboard01",
  sources: {
    defaultPage: "overview",
    pages: { overview: { scope: "overview", file: `${components}/overview/overview.tsx` } },
    fallback: { scope: "empty", file: `${components}/empty-page.tsx` },
  },
};

export const templates = [dashboardTemplate] as const;
