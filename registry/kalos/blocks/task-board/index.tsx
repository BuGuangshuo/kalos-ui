"use client";

import { Menu } from "@base-ui/react/menu";
import { Check, Filter, Plus, Search, SquareSplitVertical, Star } from "lucide-react";
import { useLayoutEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import { StatusMark, Swatch, TaskCard } from "./card";
import { TaskDetails } from "./detail";
import {
  initialLabels,
  initialPath,
  initialPeople,
  initialStatuses,
  initialTasks,
  type Task,
  type TaskLabel,
  type TaskPerson,
  type TaskStatus,
} from "./data";
import "../shared/inter";
import "./task-board.css";

export type { Task, TaskLabel, TaskPerson, TaskPriority, TaskStatus } from "./data";
export type KalosTaskBoardProps = {
  tasks?: Task[];
  statuses?: TaskStatus[];
  labels?: TaskLabel[];
  people?: TaskPerson[];
  path?: string[];
  onChange?: (tasks: Task[]) => void;
  appearance?: "clean" | "classic";
};

type DropPoint = { status: string; before: string | null };

function newTaskKey(tasks: Task[]) {
  const first = tasks.find((task) => /-\d+$/.test(task.key));
  const prefix = first?.key.slice(0, first.key.lastIndexOf("-") + 1) ?? "TASK-";
  const highest = tasks.reduce(
    (max, task) =>
      task.key.startsWith(prefix) ? Math.max(max, Number(task.key.slice(prefix.length)) || 0) : max,
    0,
  );
  return prefix + (highest + 1);
}

export function KalosTaskBoard({
  tasks,
  statuses = initialStatuses,
  labels = initialLabels,
  people = initialPeople,
  path = initialPath,
  onChange,
  appearance = "clean",
}: KalosTaskBoardProps) {
  const classic = appearance === "classic";
  const [rows, setRows] = useState(tasks ?? initialTasks);
  const [lastTasks, setLastTasks] = useState(tasks);
  if (lastTasks !== tasks) {
    setLastTasks(tasks);
    setRows(tasks ?? initialTasks);
  }
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [compact, setCompact] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [adding, setAdding] = useState<string>();
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState<Task>();
  const [panelOpen, setPanelOpen] = useState(false);
  const [limits, setLimits] = useState<Record<string, number>>({});
  const [dragKey, setDragKey] = useState("");
  const [dropPoint, setDropPoint] = useState<DropPoint | null>(null);
  const root = useRef<HTMLElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const cards = useRef(new Map<string, HTMLButtonElement>());
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const focusAfter = useRef("");
  const returnToAdd = useRef("");
  const returnFocus = useRef<() => HTMLElement | null>(() => null);
  const normalized = query.trim().toLowerCase();
  const filtered = rows.filter(
    (task) =>
      (!normalized || `${task.key} ${task.title}`.toLowerCase().includes(normalized)) &&
      (!filters.length || filters.some((id) => task.labels?.includes(id))),
  );
  const isFiltered = Boolean(normalized || filters.length);
  const selectedTask = selected && rows.find((task) => task.key === selected.key);

  useLayoutEffect(() => {
    if (focusAfter.current) {
      (cards.current.get(focusAfter.current) ?? searchInput.current)?.focus();
      focusAfter.current = "";
    }
  }, [rows]);

  useLayoutEffect(() => {
    if (!adding && returnToAdd.current) {
      buttons.current.get(returnToAdd.current)?.focus();
      returnToAdd.current = "";
    }
  }, [adding]);

  function commit(next: Task[]) {
    setRows(next);
    onChange?.(next);
  }
  function update(value: Partial<Task>) {
    if (selectedTask)
      commit(rows.map((task) => (task.key === selectedTask.key ? { ...task, ...value } : task)));
  }
  function remove() {
    if (!selectedTask) return;
    const column = filtered.filter((task) => task.status === selectedTask.status);
    const index = column.findIndex((task) => task.key === selectedTask.key);
    const neighbour = column[index + 1] ?? column[index - 1];
    returnFocus.current = () =>
      (neighbour && cards.current.get(neighbour.key)) ??
      buttons.current.get(selectedTask.status) ??
      searchInput.current;
    setPanelOpen(false);
    commit(rows.filter((task) => task.key !== selectedTask.key));
  }
  function create(event: FormEvent, status: string) {
    event.preventDefault();
    if (!title.trim()) return;
    const task = {
      key: newTaskKey(rows),
      title: title.trim(),
      status,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
    setAdding(undefined);
    setTitle("");
    setFilters([]);
    setQuery("");
    setLimits({
      ...limits,
      [status]: Math.max(limits[status] ?? 50, rows.filter((row) => row.status === status).length + 1),
    });
    focusAfter.current = task.key;
    commit([...rows, task]);
  }
  function dragTarget(event: DragEvent, status: string): DropPoint {
    const card = (event.target as Element).closest<HTMLElement>("[data-task-key]");
    if (!card || !event.currentTarget.contains(card)) return { status, before: null };
    const key = card.dataset.taskKey!;
    const box = card.getBoundingClientRect();
    if (event.clientY < box.top + box.height / 2) return { status, before: key };
    const column = filtered.filter((task) => task.status === status);
    return { status, before: column[column.findIndex((task) => task.key === key) + 1]?.key ?? null };
  }
  function finishDrag() {
    setDragKey("");
    setDropPoint(null);
  }
  function drop(event: DragEvent, status: string) {
    if (!dragKey) return;
    event.preventDefault();
    const target = dragTarget(event, status);
    const moving = rows.find((task) => task.key === dragKey);
    finishDrag();
    if (!moving || target.before === dragKey) return;
    const next = rows.filter((task) => task.key !== moving.key);
    const before = target.before ? next.findIndex((task) => task.key === target.before) : -1;
    next.splice(before < 0 ? next.length : before, 0, { ...moving, status });
    commit(next);
  }

  return (
    <section
      aria-label="Task board"
      className="ktb"
      ref={root}
      data-appearance={appearance}
      data-compact={compact}
    >
      <header className="ktb-toolbar">
        <nav className="ktb-path" aria-label="Board breadcrumb">
          {classic && (
            <span className="ktb-logo" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          )}
          {path.map((part, i) => (
            <span className="ktb-crumb" key={i}>
              {i > 0 && <i aria-hidden="true">{classic ? "›" : "/"}</i>}
              <span
                className="ktb-ellipsis"
                title={part}
                aria-current={i === path.length - 1 ? "page" : undefined}
              >
                {part}
              </span>
            </span>
          ))}
          <button
            type="button"
            className="ktb-icon ktb-star"
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={favorite}
            onClick={() => setFavorite(!favorite)}
          >
            <Star size={15} />
          </button>
        </nav>
        <div className="ktb-tools">
          <span className="ktb-total" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "task" : "tasks"}
            {isFiltered && ` of ${rows.length}`}
          </span>
          <label className="ktb-search">
            <Search size={15} />
            <input
              type="search"
              ref={searchInput}
              aria-label="Search tasks"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <Menu.Root modal={false}>
            <Menu.Trigger className="ktb-tool" aria-label="Filter by label" data-active={filters.length > 0}>
              <Filter size={15} />
              <span className="ktb-filter-label">Filter</span>
              {filters.length > 0 && <span className="ktb-count">{filters.length}</span>}
            </Menu.Trigger>
            <Menu.Portal container={root}>
              <Menu.Positioner align="end" sideOffset={5} className="ktb-positioner">
                <Menu.Popup className="ktb-menu">
                  <Menu.Group>
                    <Menu.GroupLabel>Labels</Menu.GroupLabel>
                    {labels.map((label) => (
                      <Menu.CheckboxItem
                        key={label.id}
                        className="ktb-menu-item"
                        checked={filters.includes(label.id)}
                        closeOnClick={false}
                        onCheckedChange={(checked) =>
                          setFilters(checked ? [...filters, label.id] : filters.filter((id) => id !== label.id))
                        }
                      >
                        <Swatch label={label} />
                        {label.label}
                        <Menu.CheckboxItemIndicator>
                          <Check size={14} />
                        </Menu.CheckboxItemIndicator>
                      </Menu.CheckboxItem>
                    ))}
                  </Menu.Group>
                  {filters.length > 0 && (
                    <Menu.Item className="ktb-menu-item" onClick={() => setFilters([])}>
                      Clear filter
                    </Menu.Item>
                  )}
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
          <button
            type="button"
            className="ktb-tool"
            aria-label="Compact cards"
            aria-pressed={compact}
            title="Compact cards"
            onClick={() => setCompact(!compact)}
          >
            <SquareSplitVertical size={15} />
            <span className="ktb-compact-label">Compact</span>
          </button>
        </div>
      </header>
      <div className="ktb-columns">
        {statuses.map((status, index) => {
          const column = filtered.filter((task) => task.status === status.id);
          const limit = limits[status.id] ?? 50;
          const addButton = (
            <button
              type="button"
              hidden={adding === status.id && !classic}
              className="ktb-add"
              aria-label={`Add task to ${status.label}`}
              ref={(node) => {
                if (node) buttons.current.set(status.id, node);
                else buttons.current.delete(status.id);
              }}
              onClick={() => {
                setAdding(status.id);
                setTitle("");
              }}
            >
              <Plus size={16} />
            </button>
          );
          return (
            <section
              className="ktb-column"
              key={status.id}
              aria-label={status.label}
              style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
              data-drop={dropPoint?.status === status.id}
              onDragOver={(event) => {
                if (!dragKey) return;
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                const target = dragTarget(event, status.id);
                if (target.status !== dropPoint?.status || target.before !== dropPoint?.before)
                  setDropPoint(target);
              }}
              onDrop={(event) => drop(event, status.id)}
            >
              <div className="ktb-column-head">
                <StatusMark status={status} />
                <span className="ktb-col-title ktb-ellipsis" title={status.label}>
                  {status.label}
                </span>
                <span className="ktb-count">{column.length > 999 ? "999+" : column.length}</span>
                {classic && addButton}
              </div>
              <div className="ktb-stack">
                {column.slice(0, limit).map((task, index) => (
                  <div
                    className="ktb-slot"
                    key={task.key}
                    data-insert={
                      dropPoint?.status === status.id && dropPoint.before === task.key && task.key !== dragKey
                    }
                  >
                    <TaskCard
                      task={task}
                      status={status}
                      labels={labels}
                      person={people.find((p) => p.id === task.assignee)}
                      index={index}
                      classic={classic}
                      register={(node) => {
                        if (node) cards.current.set(task.key, node);
                        else cards.current.delete(task.key);
                      }}
                      open={() => {
                        setSelected(task);
                        setPanelOpen(true);
                        returnFocus.current = () =>
                          cards.current.get(task.key) ?? buttons.current.get(status.id) ?? searchInput.current;
                      }}
                      dragging={dragKey === task.key}
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", task.key);
                        event.dataTransfer.effectAllowed = "move";
                        setDragKey(task.key);
                      }}
                      onDragEnd={finishDrag}
                    />
                  </div>
                ))}
                {!column.length && (
                  <div className="ktb-empty">{isFiltered ? "No matching tasks" : "No tasks"}</div>
                )}
                {column.length > limit && (
                  <button
                    type="button"
                    className="ktb-tool"
                    onClick={() => setLimits({ ...limits, [status.id]: limit + 50 })}
                  >
                    Show more
                  </button>
                )}
                <div className="ktb-slot" data-insert={dropPoint?.status === status.id && !dropPoint.before}>
                  {adding === status.id ? (
                    <form className="ktb-add-form" onSubmit={(e) => create(e, status.id)}>
                      <input
                        aria-label="New task title"
                        placeholder="Task title, then Enter"
                        value={title}
                        autoFocus
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape" && !e.nativeEvent.isComposing && e.nativeEvent.keyCode !== 229) {
                            returnToAdd.current = status.id;
                            setAdding(undefined);
                          }
                        }}
                        onBlur={() => {
                          if (!title.trim()) setAdding(undefined);
                        }}
                      />
                    </form>
                  ) : null}
                  {!classic && addButton}
                </div>
              </div>
            </section>
          );
        })}
      </div>
      {selected && (
        <TaskDetails
          key={selected.key}
          container={root}
          task={selectedTask ?? selected}
          open={Boolean(panelOpen && selectedTask)}
          close={() => setPanelOpen(false)}
          statuses={statuses}
          labels={labels}
          people={people}
          update={update}
          remove={remove}
          restoreFocus={() => returnFocus.current()}
        />
      )}
    </section>
  );
}

export function KalosTaskBoardPreview({ appearance = "clean" }: Pick<KalosTaskBoardProps, "appearance">) {
  const frame = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;
    const resize = () => {
      const width = element.clientWidth;
      setZoom(width < 760 ? null : Math.min((width - 120) / 1240, 0.8));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="ktb-preview" ref={frame} data-wide={zoom !== null}>
      <div className="ktb-preview-frame" style={zoom === null ? undefined : { zoom }}>
        <KalosTaskBoard appearance={appearance} />
      </div>
    </div>
  );
}
