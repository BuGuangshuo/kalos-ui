import {
  Bell,
  Cpu,
  House,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";
import {
  CatalogMark,
  HalftoneMark,
  ShapesMark,
  ShaderMark,
} from "./navigation-icons";

export const dashboardItems = [
  { id: "overview", label: "数据概览", icon: CatalogMark, dockIcon: House },
  { id: "ai-chat", label: "AI Chat", icon: ShapesMark, dockIcon: CatalogMark },
  { id: "skills", label: "Skills", icon: ShaderMark, dockIcon: ShapesMark },
  { id: "usage", label: "用量统计", icon: HalftoneMark, dockIcon: ShaderMark },
] as const;

export const dashboardSettings = [
  { id: "settings/general", label: "通用", icon: SlidersHorizontal },
  { id: "settings/notifications", label: "消息通知", icon: Bell },
  { id: "settings/security", label: "安全配置", icon: ShieldCheck },
  { id: "settings/members", label: "成员团队", icon: UsersRound },
  { id: "settings/models", label: "模型", icon: Cpu },
] as const;

export const dashboardPages = [
  ...dashboardItems,
  ...dashboardSettings,
] as const;
export type DashboardPageId = (typeof dashboardPages)[number]["id"];

export function findDashboardPage(section: readonly string[]) {
  const id = section.join("/");
  return dashboardPages.find((page) => page.id === id);
}
