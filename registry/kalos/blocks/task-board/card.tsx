import { CheckSquare2, Circle, Clock3, Eye, GitPullRequest, Square, Triangle } from "lucide-react";
import { useState, type DragEventHandler, type RefCallback } from "react";
import type { Task, TaskLabel, TaskPerson, TaskPriority, TaskStatus } from "./data";

export const priorities = ["No priority", "Low", "Medium", "High", "Urgent"] as const;

export function StatusMark({ status }: { status: TaskStatus }) {
  const mark = status.icon ?? status.id;
  if (typeof mark !== "string") return <span className="ktb-status-mark">{mark}</span>;
  const icons: Record<string, typeof Square> = {
    todo: Square,
    review: Eye,
    progress: Clock3,
    done: CheckSquare2,
  };
  const Icon = icons[mark] ?? Circle;
  return <Icon aria-hidden="true" className="ktb-status-mark" data-status={status.id} />;
}

export function PriorityMark({ value = 0 }: { value?: TaskPriority }) {
  return (
    <span className="ktb-priority" aria-hidden="true" data-level={value} title={priorities[value]}>
      {value === 4 ? <span>!</span> : [1, 2, 3].map((n) => <i key={n} data-lit={n <= value} />)}
    </span>
  );
}

export function Avatar({ person }: { person: TaskPerson }) {
  const [failedPhoto, setFailedPhoto] = useState<string>();
  return (
    <span role="img" aria-label={person.name} title={person.name} className="ktb-avatar">
      {person.avatar && person.avatar !== failedPhoto ? (
        // The image can be any URL supplied by a consumer, including in Vite and React Router apps.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={person.avatar}
          alt=""
          width={20}
          height={20}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailedPhoto(person.avatar)}
        />
      ) : (
        person.name.slice(0, 1)
      )}
    </span>
  );
}

export function Swatch({ label }: { label: TaskLabel }) {
  return <i aria-hidden="true" className="ktb-swatch" style={{ background: label.color }} />;
}

type CardProps = {
  task: Task;
  status: TaskStatus;
  labels: TaskLabel[];
  person?: TaskPerson;
  index: number;
  classic: boolean;
  register: RefCallback<HTMLButtonElement>;
  open: () => void;
  onDragStart: DragEventHandler<HTMLButtonElement>;
  onDragEnd: () => void;
  dragging: boolean;
};

export function TaskCard({
  task,
  status,
  labels,
  person,
  index,
  classic,
  register,
  open,
  onDragStart,
  onDragEnd,
  dragging,
}: CardProps) {
  const tags = (task.labels ?? []).flatMap((id) => labels.find((label) => label.id === id) ?? []);
  const due = typeof task.dueIn === "number" ? `${task.dueIn}d` : task.dueIn;
  return (
    <button
      className="ktb-card"
      type="button"
      ref={register}
      onClick={open}
      aria-label={`${task.key} ${task.title}`}
      aria-haspopup="dialog"
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      data-dragging={dragging}
      data-task-key={task.key}
      style={{ animationDelay: classic ? "0ms" : `${Math.min(index, 12) * 35}ms` }}
    >
      {classic && (
        <span className="ktb-card-top">
          <span className="ktb-ellipsis" title={task.key}>
            {task.key}
          </span>
          {person ? <Avatar person={person} /> : <span className="ktb-avatar" />}
        </span>
      )}
      <span className="ktb-card-title">
        {classic ? <StatusMark status={status} /> : <PriorityMark value={task.priority} />}
        <span title={task.title}>{task.title}</span>
      </span>
      {classic ? (
        <>
          <span className="ktb-properties">
            <span>
              <PriorityMark value={task.priority} />
            </span>
            {task.estimate && (
              <span>
                <Triangle />
                {task.estimate}
              </span>
            )}
            {due && (
              <span className="ktb-stat" data-soon={Number.parseInt(due, 10) <= 2}>
                <Clock3 />
                {due}
              </span>
            )}
            {task.subtasks && (
              <span className="ktb-stat">
                <Circle />
                {Array.isArray(task.subtasks) ? task.subtasks.join("/") : task.subtasks}
              </span>
            )}
            {task.pullRequest != null && (
              <span className="ktb-stat">
                <GitPullRequest />#{String(task.pullRequest).replace(/^#/, "")}
              </span>
            )}
            {tags.slice(0, 3).map((label) => (
              <span className="ktb-tag" title={label.label} key={label.id}>
                <Swatch label={label} />
                <span>{label.label}</span>
              </span>
            ))}
            {tags.length > 3 && <span>+{tags.length - 3}</span>}
          </span>
          {task.created && <span className="ktb-created">Created {task.created}</span>}
        </>
      ) : (
        <>
          <span className="ktb-meta">
            <span className="ktb-ellipsis" title={task.key}>
              {[
                task.key,
                task.estimate && `Estimate ${task.estimate}`,
                task.created && `Created ${task.created}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
            <span className="ktb-tags">
              {tags.length ? (
                tags.slice(0, 3).map((label) => (
                  <span className="ktb-tag" title={label.label} key={label.id}>
                    <Swatch label={label} />
                    <span>{label.label}</span>
                  </span>
                ))
              ) : (
                <span className="ktb-faint">No labels</span>
              )}
              {tags.length > 3 && <span>+{tags.length - 3}</span>}
            </span>
          </span>
          <span className="ktb-card-foot">
            <span className="ktb-state">
              <StatusMark status={status} />
              <span className="ktb-ellipsis">{status.label}</span>
            </span>
            {due && (
              <span className="ktb-stat" data-soon={Number.parseInt(due, 10) <= 2} title="Due">
                <Clock3 />
                {due}
              </span>
            )}
            {task.subtasks && (
              <span className="ktb-stat" title="Subtasks">
                <Circle />
                {Array.isArray(task.subtasks) ? task.subtasks.join("/") : task.subtasks}
              </span>
            )}
            {task.pullRequest != null && (
              <span className="ktb-stat" title="Pull request">
                <GitPullRequest />#{String(task.pullRequest).replace(/^#/, "")}
              </span>
            )}
            {person && <Avatar person={person} />}
          </span>
        </>
      )}
    </button>
  );
}
