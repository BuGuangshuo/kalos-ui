"use client";

// Activity example adapted from affectUI (MIT). See AFFECTUI-LICENSE.md.
import { useState, type ComponentType, type MouseEvent, type ReactNode } from "react";
import { hoverCardDemoCss } from "@/components/hover-card-demo-styles";
import type { KalosHoverCardProps } from "@/components/ui/kalos-hover-card-shared";

const agents = {
  scout: { id: "scout", name: "Scout", role: "Research agent", model: "claude-sonnet-4.5", about: "Reads new issues, finds the cause and drafts a fix for the billing team.", busy: true, status: "Running · 2/3 tasks", runs: 41, cost: "$12.40" },
  ledger: { id: "ledger", name: "Ledger", role: "Finance agent", model: "gpt-5-mini", about: "Sums up spend per model and team every Monday and flags anything unusual.", busy: false, status: "Idle · last run 14m ago", runs: 9, cost: "$1.85" },
} as const;
const files = {
  export: { id: "export", name: "export.ts", path: "billing-api/src/export.ts", kind: "code", size: "3.1 KB", change: "+42 −7", by: "Scout" },
  report: { id: "report", name: "cost-report-w45.csv", path: "finance/reports/cost-report-w45.csv", kind: "csv", size: "48 KB", change: "1,284 rows", by: "Ledger" },
} as const;
const delays = [0, 120, 240, 120, 240, 360, 240, 360, 480];
const preventNavigation = (event: MouseEvent<HTMLAnchorElement>) => event.preventDefault();

function pattern(id: string) {
  let seed = 0;
  for (const character of id) seed = (seed * 31 + character.charCodeAt(0)) >>> 0;
  for (let attempt = 0; attempt < 64; attempt++) {
    const bits = (seed >> (attempt % 26)) & 63;
    const cells = [0, 1, 2].flatMap(row => {
      const edge = (bits >> (row * 2)) & 1;
      return [edge, (bits >> (row * 2 + 1)) & 1, edge];
    });
    if (cells.filter(Boolean).length >= 5) return cells;
    seed = (seed * 1103515245 + 12345) >>> 0;
  }
  return [1, 0, 1, 0, 1, 0, 1, 0, 1];
}

function AgentMark({ id, busy }: { id: string; busy: boolean }) {
  return <span className="kalos-hover-demo__mark" data-busy={busy || undefined} aria-hidden="true">
    {pattern(id).map((on, index) => <i key={index} data-on={on ? "" : undefined} style={{ animationDelay: `${delays[index]}ms` }} />)}
  </span>;
}

function PreviewIcon({ kind }: { kind: "code" | "csv" | "arrow" }) {
  const paths = kind === "arrow" ? ["M9 6.65032C9 6.65032 15.9383 6.10759 16.9154 7.08463C17.8924 8.06167 17.3496 15 17.3496 15M16.5 7.5L6.5 17.5"] : kind === "code" ? [
    "M20 15.0057V10.6606C20 9.84276 20 9.43383 19.8478 9.06613C19.6955 8.69843 19.4065 8.40927 18.8284 7.83096L14.0919 3.09236C13.593 2.59325 13.3436 2.3437 13.0345 2.19583C12.9702 2.16508 12.9044 2.13778 12.8372 2.11406C12.5141 2 12.1614 2 11.4558 2C8.21082 2 6.58831 2 5.48933 2.88646C5.26731 3.06554 5.06508 3.26787 4.88607 3.48998C4 4.58943 4 6.21265 4 9.45908V14.0052C4 17.7781 4 19.6645 5.17157 20.8366C6.11466 21.7801 7.52043 21.9641 10 22M13 2.50022V3.00043C13 5.83009 13 7.24492 13.8787 8.12398C14.7574 9.00304 16.1716 9.00304 19 9.00304H19.5",
    "M14.3267 22L13.1155 20.9142C12.3718 20.2475 12 19.9142 12 19.5C12 19.0858 12.3718 18.7525 13.1155 18.0858L14.3267 17M17.6733 22L18.8845 20.9142C19.6282 20.2475 20 19.9142 20 19.5C20 19.0858 19.6282 18.7525 18.8845 18.0858L17.6733 17",
  ] : [
    "M7.5 17.2196C7.44458 16.0292 6.62155 16 5.50505 16C3.78514 16 3.5 16.406 3.5 18V20C3.5 21.594 3.78514 22 5.50505 22C6.62154 22 7.44458 21.9708 7.5 20.7804M20.5 16L18.7229 20.6947C18.3935 21.5649 18.2288 22 17.968 22C17.7071 22 17.5424 21.5649 17.213 20.6947L15.4359 16M12.876 16H11.6951C11.2231 16 10.9872 16 10.8011 16.0761C10.1672 16.3354 10.1758 16.9448 10.1758 17.5C10.1758 18.0553 10.1672 18.6647 10.8011 18.9239C10.9872 19 11.2232 19 11.6951 19C12.167 19 12.4029 19 12.5891 19.0761C13.2229 19.3354 13.2143 19.9447 13.2143 20.5C13.2143 21.0553 13.2229 21.6647 12.5891 21.9239C12.4029 22 12.167 22 11.6951 22H10.4089",
    "M20 13V10.6569C20 9.83935 20 9.4306 19.8478 9.06306C19.6955 8.69552 19.4065 8.40649 18.8284 7.82843L14.0919 3.09188C13.593 2.593 13.3436 2.34355 13.0345 2.19575C12.9702 2.165 12.9044 2.13772 12.8372 2.11401C12.5141 2 12.1614 2 11.4558 2C8.21082 2 6.58831 2 5.48933 2.88607C5.26731 3.06508 5.06508 3.26731 4.88607 3.48933C4 4.58831 4 6.21082 4 9.45584V13M13 2.5V3C13 5.82843 13 7.24264 13.8787 8.12132C14.7574 9 16.1716 9 19 9H19.5",
  ];
  return <svg width={kind === "arrow" ? 14 : 16} height={kind === "arrow" ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={kind === "arrow" ? 1.8 : 1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths.map((d, index) => <path key={index} d={d} />)}</svg>;
}

function AgentPreview({ id }: { id: keyof typeof agents }) {
  const agent = agents[id];
  return <div className="kalos-hover-demo__preview">
    <div className="kalos-hover-demo__who"><span className="kalos-hover-demo__tile"><AgentMark id={id} busy={agent.busy} /></span><span className="kalos-hover-demo__names"><span className="kalos-hover-demo__name">{agent.name}</span><span className="kalos-hover-demo__sub">{agent.role} · {agent.model}</span></span></div>
    <p className="kalos-hover-demo__about">{agent.about}</p>
    <dl className="kalos-hover-demo__facts"><div><dt>Status</dt><dd>{agent.status}</dd></div><div><dt>This week</dt><dd>{agent.runs} runs · {agent.cost}</dd></div></dl>
    <a className="kalos-hover-demo__open" href={`#agents/${id}`} onClick={preventNavigation}>Open agent<PreviewIcon kind="arrow" /></a>
  </div>;
}

function FilePreview({ id }: { id: keyof typeof files }) {
  const file = files[id];
  return <div className="kalos-hover-demo__preview">
    <div className="kalos-hover-demo__who"><span className="kalos-hover-demo__tile" data-kind={file.kind}><PreviewIcon kind={file.kind} /></span><span className="kalos-hover-demo__names"><span className="kalos-hover-demo__name">{file.name}</span><span className="kalos-hover-demo__sub">{file.path}</span></span></div>
    <p className="kalos-hover-demo__line">{file.change} · {file.size} · by {file.by}</p>
  </div>;
}

function ActivityEntry({ agent, when, children }: { agent: keyof typeof agents; when: string; children: ReactNode }) {
  return <li className="kalos-hover-demo__entry"><AgentMark id={agent} busy={agents[agent].busy} /><div className="kalos-hover-demo__text">{children}</div><span className="kalos-hover-demo__when">{when}</span></li>;
}

export function HoverCardActivityDemo({ KalosHoverCard, compact = false }: { KalosHoverCard: ComponentType<KalosHoverCardProps>; compact?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const changeActive = (key: string, next: boolean) => setActive(current => next ? key : current === key ? null : current);
  const agentLink = (id: keyof typeof agents, key: string) => <KalosHoverCard width={288} label={`${agents[id].name} preview`} content={<AgentPreview id={id} />} className="kalos-hover-demo-popup" open={active === key} onOpenChange={next => changeActive(key, next)}><a className="kalos-hover-demo__link" href={`#agents/${id}`} onClick={preventNavigation} onPointerDown={() => setActive(null)}>{agents[id].name}</a></KalosHoverCard>;
  const fileLink = (id: keyof typeof files) => <KalosHoverCard width={288} label={`${files[id].name} preview`} className="kalos-hover-demo-popup" content={<FilePreview id={id} />} open={active === `file-${id}`} onOpenChange={next => changeActive(`file-${id}`, next)}><a className="kalos-hover-demo__link kalos-hover-demo__link--file" href={`#files/${id}`} onClick={preventNavigation} onPointerDown={() => setActive(null)}>{files[id].name}</a></KalosHoverCard>;
  return <div className="kalos-hover-demo" data-compact={compact || undefined}>
    <style href="kalos-hover-card-demo" precedence="default">{hoverCardDemoCss}</style>
    <section className="kalos-hover-demo__card" aria-label="Activity"><header className="kalos-hover-demo__head"><h3 className="kalos-hover-demo__title">Activity</h3></header>
      <ul className="kalos-hover-demo__feed">
        <ActivityEntry agent="scout" when="2m">{agentLink("scout", "scout-first")} opened a fix for {fileLink("export")}</ActivityEntry>
        <ActivityEntry agent="ledger" when="14m">{agentLink("ledger", "ledger")} finished the weekly report {fileLink("report")}</ActivityEntry>
        <ActivityEntry agent="scout" when="1h">{agentLink("scout", "scout-last")} is drafting replies to 14 support tickets</ActivityEntry>
      </ul>
    </section>
  </div>;
}
