"use client";

import { ChevronRight, Inbox, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { KalosEmptyState } from "@/registry/kalos/kalos-empty-state";
import { KalosLoading, KalosSkeleton } from "@/registry/kalos/kalos-skeleton";
import { DashboardHeader, type DashboardPreviewMode } from "./dashboard-header";
import { TextMark, MotionMark } from "./navigation-icons";
import { OverviewSkeleton } from "./overview/overview-skeleton";
import { DashboardReplayContext } from "./preview-animation";
import {
  Activity,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import {
  dashboardItems,
  dashboardSettings,
  type DashboardPageId,
} from "./navigation";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--rail-muted)";
const railButton = `size-12 shrink-0 items-center justify-center rounded-[9px] text-(--rail-muted) transition-[background-color,color,scale] duration-160 hover:bg-(--rail-active) hover:text-(--rail-ink) active:scale-[.94] ${focusRing}`;
const navRow = `relative mb-0.5 flex h-10 w-full shrink-0 items-center gap-3 overflow-hidden rounded-lg px-[14px] text-left text-[14px]/[21px] whitespace-nowrap transition-colors duration-180 ${focusRing}`;
const selectedRow = "bg-(--rail-active) font-medium text-(--rail-ink)";
const idleRow =
  "text-(--rail-muted) hover:bg-(--rail-hover) hover:text-(--rail-ink)";
const railIcon = "size-5 shrink-0 stroke-[1.55]";

export default function DashboardTemplate({
  page,
  hrefForPage,
  onNavigate,
  loginHref,
  children,
}: {
  page: DashboardPageId;
  hrefForPage: (id: DashboardPageId) => string;
  onNavigate: (id: DashboardPageId) => void;
  loginHref?: string;
  children: ReactNode;
}) {
  const [pinned, setPinned] = useState(false);
  const [keyboardWithin, setKeyboardWithin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [preview, setPreview] = useState<{ mode: DashboardPreviewMode; replay: number }>({ mode: "data", replay: 0 });
  const [settingsChoice, setSettingsChoice] = useState<{
    page: DashboardPageId;
    open: boolean;
  } | null>(null);

  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const previousPage = useRef(page);
  const railId = useId();
  const settingsId = useId();

  const settingsActive = dashboardSettings.some((item) => item.id === page);
  const settingsOpen =
    settingsChoice?.page === page ? settingsChoice.open : settingsActive;
  const expanded = pinned || keyboardWithin || mobileOpen;
  const labels = expanded
    ? "opacity-100 duration-180"
    : "opacity-0 duration-120 group-hover/rail:opacity-100 group-hover/rail:delay-[360ms] group-hover/rail:duration-180";

  useEffect(() => {
    if (previousPage.current !== page) {
      previousPage.current = page;
      canvas.current?.scrollTo({ top: 0 });
      canvas.current?.focus({ preventScroll: true });
    }
  }, [page]);

  useEffect(() => {
    if (!mobileOpen || !root.current) return;
    rail.current?.querySelector<HTMLElement>("[data-close-menu]")?.focus();
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width >= 1024) {
        setMobileOpen(false);
        root.current?.focus({ preventScroll: true });
      }
    });
    const onHistoryNavigation = () => setMobileOpen(false);
    observer.observe(root.current);
    window.addEventListener("popstate", onHistoryNavigation);
    return () => {
      observer.disconnect();
      window.removeEventListener("popstate", onHistoryNavigation);
    };
  }, [mobileOpen]);

  function closeMenu(returnToContent = false) {
    if (!mobileOpen) return;
    flushSync(() => {
      setMobileOpen(false);
      setKeyboardWithin(false);
    });
    (returnToContent ? canvas.current : menuTrigger.current)?.focus({
      preventScroll: true,
    });
  }

  function handleKeys(event: KeyboardEvent<HTMLElement>) {
    if (!mobileOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
      return;
    }
    if (event.key !== "Tab") return;
    const stops = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        "button:not(:disabled), a[href]",
      ),
    ).filter(
      (element) => element.offsetParent !== null && !element.closest("[inert]"),
    );
    const first = stops[0];
    const last = stops.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  function navigate(event: MouseEvent<HTMLElement>, id: DashboardPageId) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    closeMenu(true);
    onNavigate(id);
  }

  function changePreviewMode(mode: DashboardPreviewMode) {
    setPreview(current => current.mode === mode ? current : {
      mode,
      replay: mode === "data" ? current.replay + 1 : current.replay,
    });
  }

  return (
    <div
      ref={root}
      tabIndex={-1}
      data-dashboard-template=""
      data-template-focus=""
      aria-label="Dashboard 工作台"
      className="@container/dashboard relative isolate h-dvh w-full overflow-hidden bg-background font-sans text-[13px]/5 text-foreground outline-none
        [--rail-ink:#1e1e1e] [--rail-muted:#636363] [--rail-active:#f5f5f5] [--rail-hover:#f7f7f7] [--rail-line:#ebebeb]
        dark:[--rail-ink:#f1f1f1] dark:[--rail-muted:#a3a3a3] dark:[--rail-active:#2b2b2b] dark:[--rail-hover:#242424] dark:[--rail-line:#303030]"
    >
      <div
        data-template-layout=""
        className={`grid h-full min-h-0 min-w-0 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)_56px] @min-[1024px]/dashboard:grid-rows-[minmax(0,1fr)] transition-[grid-template-columns] duration-260 ease-[cubic-bezier(.4,0,.2,1)] ${pinned ? "@min-[1024px]/dashboard:grid-cols-[224px_minmax(0,1fr)]" : "@min-[1024px]/dashboard:grid-cols-[72px_minmax(0,1fr)]"}`}
      >
        {mobileOpen && (
          <button
            type="button"
            tabIndex={-1}
            aria-label="关闭工作台导航"
            className="absolute inset-0 z-25 bg-[#1011164a] transition-opacity duration-200 starting:opacity-0 @min-[1024px]/dashboard:hidden"
            onClick={() => closeMenu()}
          />
        )}
        <aside
          id={railId}
          ref={rail}
          aria-label="工作台导航"
          role={mobileOpen ? "dialog" : undefined}
          aria-modal={mobileOpen || undefined}
          data-pinned={pinned}
          onKeyDown={handleKeys}
          onPointerDown={() => setKeyboardWithin(false)}
          onFocusCapture={(event) => {
            if (event.target.matches(":focus-visible")) setKeyboardWithin(true);
          }}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setKeyboardWithin(false);
          }}
          className={`group/rail absolute inset-y-0 left-0 z-30 h-full min-h-0 flex-col overflow-hidden border-r border-(--rail-line) bg-background text-(--rail-ink) transition-[width,box-shadow,translate] duration-260 ease-[cubic-bezier(.4,0,.2,1)] @min-[1024px]/dashboard:relative @min-[1024px]/dashboard:flex
            ${mobileOpen ? "flex w-[min(280px,calc(100%-32px))] shadow-[12px_0_60px_#0002] duration-220 ease-[cubic-bezier(.22,1,.36,1)] starting:-translate-x-full" : "hidden"}
            ${expanded ? "@min-[1024px]/dashboard:w-56" : "@min-[1024px]/dashboard:w-[72px] @min-[1024px]/dashboard:hover:w-56 delay-[40ms] hover:delay-200"}
            ${!pinned ? "[--rail-shadow:0_0_0_1px_rgb(23_27_38/0.07),0_2px_6px_-2px_rgb(23_27_38/0.05),0_16px_32px_-8px_rgb(23_27_38/0.07),0_40px_80px_-24px_rgb(23_27_38/0.1)] hover:shadow-(--rail-shadow) has-[:focus-visible]:shadow-(--rail-shadow)" : ""}`}
        >
          <div className="flex h-[62px] shrink-0 items-center justify-between px-3 pt-[13px] pb-[11px]">
            <a
              href={hrefForPage("overview")}
              aria-label="Kalos Studio 数据概览"
              onClick={event => navigate(event, "overview")}
              className={`group/brand flex h-10 min-w-0 items-center gap-2.5 overflow-hidden whitespace-nowrap rounded-lg px-3 ${focusRing}`}
            >
              <MotionMark className="size-6 shrink-0 overflow-visible" />
              <span
                className={`text-base font-medium tracking-[-.6px] transition-opacity ${labels}`}
              >
                kalos.studio
              </span>
            </a>
            <button
              type="button"
              data-close-menu=""
              aria-label="关闭导航"
              onClick={() => closeMenu()}
              className={`${railButton} inline-flex h-10 w-11 @min-[1024px]/dashboard:hidden`}
            >
              <X className="size-5 stroke-[1.6]" />
            </button>
          </div>

          <nav
            aria-label="工作台菜单"
            className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto px-3 pb-[18px] [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:var(--rail-line)_transparent]"
          >
            {dashboardItems.map(({ id, icon: Icon, label }) => (
              <a
                key={id}
                href={hrefForPage(id)}
                onClick={event => navigate(event, id)}
                aria-label={label}
                aria-current={page === id ? "page" : undefined}
                className={`${navRow} ${page === id ? selectedRow : idleRow}`}
              >
                <Icon
                  aria-hidden="true"
                  className={`${railIcon} ${page === id ? "stroke-[2.3]" : ""}`}
                />
                <span className={`transition-opacity ${labels}`}>{label}</span>
              </a>
            ))}
            <button
              type="button"
              aria-label="设置"
              aria-expanded={settingsOpen}
              aria-controls={settingsId}
              onClick={() => setSettingsChoice({ page, open: !settingsOpen })}
              className={`${navRow} ${settingsActive ? selectedRow : `${idleRow} hover:has-[[data-disclosure-arrow]:hover]:bg-transparent`}`}
            >
              <TextMark
                aria-hidden="true"
                className={`${railIcon} ${settingsActive ? "stroke-[2.3]" : ""}`}
              />
              <span className={`transition-opacity ${labels}`}>设置</span>
              <span
                data-disclosure-arrow=""
                aria-hidden="true"
                className={`absolute inset-y-0 right-0 grid w-[34px] place-items-center text-(--rail-muted) transition-opacity hover:text-(--rail-ink) ${labels} ${expanded ? "visible" : "invisible group-hover/rail:visible"}`}
              >
                <ChevronRight
                  className={`size-3.5 transition-transform duration-220 ${settingsOpen ? "rotate-90" : ""}`}
                />
              </span>
            </button>
            <div
              id={settingsId}
              inert={!settingsOpen}
              className={`grid shrink-0 transition-[grid-template-rows,opacity] duration-240 ease-[cubic-bezier(.4,0,.2,1)]
                ${!settingsOpen ? "invisible grid-rows-[0fr] opacity-0" : expanded ? "grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0 group-hover/rail:visible group-hover/rail:grid-rows-[1fr] group-hover/rail:opacity-100 group-hover/rail:delay-200"}`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="pb-[7px]">
                  {dashboardSettings.map(({ id, label }) => (
                    <a
                      key={id}
                      href={hrefForPage(id)}
                      onClick={event => navigate(event, id)}
                      aria-current={page === id ? "page" : undefined}
                      className={`flex h-8 w-full items-center whitespace-nowrap rounded-[7px] pr-2 pl-[46px] text-[13px]/[19.5px] transition-colors duration-160 ${focusRing} ${page === id ? selectedRow : idleRow}`}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="hidden h-[65px] shrink-0 items-center justify-end border-t border-(--rail-line) px-3 py-[7px] @min-[1024px]/dashboard:flex">
            <button
              type="button"
              className={`${railButton} inline-flex`}
              aria-controls={railId}
              aria-label={pinned ? "折叠侧栏" : "固定展开侧栏"}
              aria-pressed={pinned}
              onClick={() => setPinned((value) => !value)}
            >
              {pinned ? (
                <PanelLeftClose className="size-5 stroke-[1.6]" />
              ) : (
                <PanelLeftOpen className="size-5 stroke-[1.6]" />
              )}
            </button>
          </div>
        </aside>

        <div
          inert={mobileOpen}
          className="flex h-full min-h-0 min-w-0 flex-col"
        >
          <DashboardHeader
            page={page}
            overviewHref={hrefForPage("overview")}
            openOverview={event => navigate(event, "overview")}
            loginHref={loginHref}
            previewMode={preview.mode}
            onPreviewModeChange={changePreviewMode}
            menuTriggerRef={menuTrigger}
            menuOpen={mobileOpen}
            menuId={railId}
            onOpenMenu={() => setMobileOpen(true)}
          />
          <div
            ref={canvas}
            tabIndex={-1}
            role="region"
            aria-label="工作台内容"
            className="min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain outline-none"
          >
            <Activity mode={preview.mode === "data" ? "visible" : "hidden"}>
              <DashboardReplayContext.Provider value={preview.replay}>{children}</DashboardReplayContext.Provider>
            </Activity>
            {preview.mode === "loading" && (page === "overview" ? (
              <OverviewSkeleton />
            ) : (
              <KalosLoading label="正在加载页面" className="flex min-h-full flex-col items-center justify-center gap-4">
                <KalosSkeleton width={40} height={40} radius={10} />
                <KalosSkeleton width={76} height={12} />
              </KalosLoading>
            ))}
            {preview.mode === "empty" && (
              <KalosEmptyState bare tall role="status" icon={<Inbox />} title="暂无数据" />
            )}
          </div>
        </div>
        <nav
          aria-label="工作台主导航"
          inert={mobileOpen}
          className="grid grid-cols-4 border-t border-(--rail-line) bg-background @min-[1024px]/dashboard:hidden"
        >
          {dashboardItems.map(({ id, dockIcon: Icon, label }) => (
            <a
              key={id}
              href={hrefForPage(id)}
              onClick={event => navigate(event, id)}
              aria-current={page === id ? "page" : undefined}
              className={`grid content-center justify-items-center gap-0.5 text-[10px]/[15px] text-(--rail-muted) hover:bg-(--rail-hover) aria-[current=page]:font-semibold aria-[current=page]:text-(--rail-ink) ${focusRing}`}
            >
              <Icon
                className={`size-[19px] ${page === id ? "stroke-[2.4]" : "stroke-[1.5]"}`}
              />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
