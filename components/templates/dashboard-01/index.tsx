"use client";

import { useSyncExternalStore } from "react";
import { ThemeProvider } from "next-themes";
import "@/components/theme-toggle.css";
import DashboardTemplate from "./dashboard-template";
import { DashboardEmptyPage } from "./empty-page";
import { dashboardPages, type DashboardPageId } from "./navigation";
import Overview from "./overview/overview";

const pageParam = "dashboard-01";
const navigationEvent = "kalos-dashboard-01-navigation";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener("hashchange", onChange);
  window.addEventListener(navigationEvent, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(navigationEvent, onChange);
  };
}

function hrefForPage(href: string, page: DashboardPageId) {
  if (!href) return `?${pageParam}=${encodeURIComponent(page)}`;
  const url = new URL(href);
  if (page === "overview") url.searchParams.delete(pageParam);
  else url.searchParams.set(pageParam, page);
  return url.pathname + url.search + url.hash;
}

function navigate(page: DashboardPageId) {
  const href = hrefForPage(window.location.href, page);
  if (href === window.location.pathname + window.location.search + window.location.hash) return;
  window.history.pushState(window.history.state, "", href);
  window.dispatchEvent(new Event(navigationEvent));
}

const browserHref = () => window.location.href;
const serverHref = () => "";

export function KalosDashboard01({ loginHref }: { loginHref?: string } = {}) {
  const href = useSyncExternalStore(subscribe, browserHref, serverHref);
  const id = href && new URL(href).searchParams.get(pageParam);
  const page = dashboardPages.find(item => item.id === id) ?? dashboardPages[0];
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <DashboardTemplate page={page.id} hrefForPage={id => hrefForPage(href, id)} onNavigate={navigate} loginHref={loginHref}>
        {page.id === "overview" ? <Overview /> : <DashboardEmptyPage page={page} />}
      </DashboardTemplate>
    </ThemeProvider>
  );
}
