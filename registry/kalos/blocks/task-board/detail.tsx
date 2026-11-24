import { Dialog } from "@base-ui/react/dialog";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { X } from "lucide-react";
import { useRef, useState, type RefObject } from "react";
import { Avatar, PriorityMark, priorities, StatusMark, Swatch } from "./card";
import type { Task, TaskLabel, TaskPerson, TaskPriority, TaskStatus } from "./data";

type Props = {
  task: Task;
  statuses: TaskStatus[];
  labels: TaskLabel[];
  people: TaskPerson[];
  container: RefObject<HTMLElement | null>;
  open: boolean;
  close: () => void;
  restoreFocus: () => HTMLElement | null;
  update: (value: Partial<Task>) => void;
  remove: () => void;
};

export function TaskDetails({
  task,
  statuses,
  labels,
  people,
  container,
  open,
  close,
  restoreFocus,
  update,
  remove,
}: Props) {
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const taskLabels = task.labels ?? [];
  return (
    <Dialog.Root
      modal="trap-focus"
      open={open}
      onOpenChange={(next) => {
        if (!next) close();
      }}
    >
      <Dialog.Portal container={container}>
        <Dialog.Backdrop className="ktb-backdrop" onClick={close} />
        <Dialog.Popup
          className="ktb-panel"
          ref={panel}
          initialFocus={panel}
          finalFocus={restoreFocus}
          aria-describedby={undefined}
        >
          <div className="ktb-panel-head">
            <span className="ktb-ellipsis">{task.key}</span>
            <Dialog.Close className="ktb-icon" aria-label="Close details">
              <X size={16} />
            </Dialog.Close>
          </div>
          <div className="ktb-panel-body">
            <Dialog.Title className="ktb-sr">{task.title}</Dialog.Title>
            <textarea
              className="ktb-title-input"
              aria-label="Title"
              rows={1}
              value={editingTitle ?? task.title}
              onChange={(event) => setEditingTitle(event.target.value)}
              onBlur={() => {
                const title = editingTitle?.trim();
                if (title && title !== task.title) update({ title });
                setEditingTitle(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.nativeEvent.keyCode !== 229) {
                  event.preventDefault();
                  event.currentTarget.blur();
                  panel.current?.focus();
                }
              }}
            />
            <div className="ktb-details-heading">Details</div>
            <div className="ktb-field">
              <span>Status</span>
              <RadioGroup
                className="ktb-choices"
                aria-label="Status"
                value={task.status}
                onValueChange={(status) => update({ status })}
              >
                {statuses.map((status) => (
                  <Radio.Root key={status.id} value={status.id} className="ktb-choice">
                    <StatusMark status={status} />
                    {status.label}
                  </Radio.Root>
                ))}
              </RadioGroup>
            </div>
            <div className="ktb-field">
              <span>Priority</span>
              <RadioGroup
                className="ktb-choices"
                aria-label="Priority"
                value={task.priority ?? 0}
                onValueChange={(priority) => update({ priority })}
              >
                {([4, 3, 2, 1, 0] as TaskPriority[]).map((n) => (
                  <Radio.Root key={n} value={n} className="ktb-choice">
                    <PriorityMark value={n} />
                    {priorities[n]}
                  </Radio.Root>
                ))}
              </RadioGroup>
            </div>
            <div className="ktb-field">
              <span>Labels</span>
              <div className="ktb-choices" role="group" aria-label="Labels">
                {labels.map((label) => (
                  <button
                    type="button"
                    className="ktb-choice"
                    aria-pressed={taskLabels.includes(label.id)}
                    key={label.id}
                    onClick={() =>
                      update({
                        labels: taskLabels.includes(label.id)
                          ? taskLabels.filter((id) => id !== label.id)
                          : [...taskLabels, label.id],
                      })
                    }
                  >
                    <Swatch label={label} />
                    {label.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="ktb-field">
              <span>Assignee</span>
              <div className="ktb-choices" role="group" aria-label="Assignee">
                {people.map((person) => (
                  <button
                    type="button"
                    className="ktb-choice"
                    aria-label={person.name}
                    aria-pressed={task.assignee === person.id}
                    key={person.id}
                    onClick={() => update({ assignee: task.assignee === person.id ? null : person.id })}
                  >
                    <Avatar person={person} />
                    {person.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="ktb-panel-foot">
            <span>{task.created && `Created ${task.created}`}</span>
            <button className="ktb-delete" type="button" onClick={remove}>
              Delete task
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
