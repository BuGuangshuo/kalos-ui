export const frameworks = [
  { id: "next", title: "Next.js" },
  { id: "vite", title: "Vite" },
  { id: "react-router", title: "React Router" },
] as const;

export type FrameworkId = (typeof frameworks)[number]["id"];
