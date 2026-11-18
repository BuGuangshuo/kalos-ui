"use client";

import {
  createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState,
  type ComponentProps, type ReactNode,
} from "react";
import { Radio } from "@base-ui/react/radio";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { cn } from "@/lib/utils";
import { Field, FieldGroup } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { RadioGroup } from "@/components/ui/radio-group";
import { KalosFieldMessage } from "@/components/ui/kalos-field-message";
import { controlStyles } from "@/components/ui/kalos-styles";
import { stepperCss, stepperDefaults, stepperStyleHref } from "@/components/ui/kalos-stepper-form-styles";
import { KalosButton } from "./kalos-button";

export type KalosStepperErrors = Record<string, string | undefined>;

export interface KalosStepperContext<Values extends object> {
  values: Values;
  setValues: (patch: Partial<Values>) => void;
  errors: KalosStepperErrors;
  goTo: (id: string) => void;
  next: () => void;
}

export interface KalosStepperStep<Values extends object> {
  id: string;
  title: string;
  heading?: string;
  description?: string;
  icon?: ReactNode;
  render: (context: KalosStepperContext<Values>) => ReactNode;
  validate?: (values: Values) => KalosStepperErrors;
}

export interface KalosStepperFormProps<Values extends object> {
  steps: readonly KalosStepperStep<Values>[];
  initialValues: Values;
  initialStep?: number;
  step?: number;
  onStepChange?: (step: number) => void;
  onComplete?: (values: Values) => void | Promise<void>;
  success?: (values: Values, reset: () => void) => ReactNode;
  backLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  submittingLabel?: string;
  className?: string;
  "aria-label"?: string;
}

const transition = { duration: stepperDefaults.duration / 1000, ease: stepperDefaults.ease };
const paneVariants = {
  enter: (direction: number) => ({ x: direction * stepperDefaults.slide, opacity: 0 }),
  active: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: -direction * stepperDefaults.slide, opacity: 0 }),
};
const Validation = createContext<{ errors: KalosStepperErrors; attempt?: object }>({ errors: {} });
const FieldControl = createContext<{ id: string; labelId: string; describedBy?: string; error?: string } | null>(null);

function clampStep(index: number, length: number) {
  return Number.isFinite(index) ? Math.max(0, Math.min(Math.trunc(index), length - 1)) : 0;
}

function StepFields<Values extends object>({ render, context, attempt }: {
  render: KalosStepperStep<Values>["render"];
  context: KalosStepperContext<Values>;
  attempt?: object;
}) {
  return <Validation value={{ errors: context.errors, attempt }}>{render(context)}</Validation>;
}

function StepPane({ heading, description, disabled, direction, onMeasure, children }: {
  heading?: string;
  description?: string;
  disabled?: boolean;
  direction: number;
  onMeasure: (height: number) => void;
  children: ReactNode;
}) {
  const present = useIsPresent();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const pane = ref.current;
    if (!pane || !present) return;
    const measure = () => onMeasure(pane.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pane);
    return () => observer.disconnect();
  }, [onMeasure, present]);

  return <motion.div ref={ref} className="kalos-stepper__pane" tabIndex={-1}
    data-stepper-active={present ? "" : undefined} aria-hidden={!present || undefined} inert={!present}
    custom={direction} variants={paneVariants} initial="enter" animate="active" exit="exit" transition={transition}
  >
    {heading ? <header className="kalos-stepper__heading">
      <h2 tabIndex={-1} data-stepper-focus>{heading}</h2>
      {description ? <p>{description}</p> : null}
    </header> : null}
    <fieldset className="kalos-stepper__fieldset" disabled={disabled}>
      <FieldGroup className="kalos-stepper__fields">{children}</FieldGroup>
    </fieldset>
  </motion.div>;
}

export function KalosStepperForm<Values extends object>({
  steps, initialValues, initialStep = 0, step, onStepChange, onComplete, success,
  backLabel = "上一步", nextLabel = "继续", submitLabel = "完成", submittingLabel = "正在提交…",
  className, "aria-label": label = "分步表单",
}: KalosStepperFormProps<Values>) {
  const [internalStep, setInternalStep] = useState(initialStep);
  const index = clampStep(step ?? internalStep, steps.length);
  const active = steps[index];
  const [navigation, setNavigation] = useState({ index, direction: 1 });
  if (index !== navigation.index) {
    setNavigation({ index, direction: index < navigation.index ? -1 : 1 });
  }

  const [values, setValues] = useState(initialValues);
  const [invalid, setInvalid] = useState<{ id: string; names: string[] }>();
  const [completed, setCompleted] = useState<Values | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [height, setHeight] = useState<number>();
  const formRef = useRef<HTMLFormElement>(null);
  const submittingRef = useRef(false);
  const paneKey = completed ? "success" : `step:${active?.id}`;
  const previousPane = useRef(paneKey);
  const errors = !completed && active && invalid?.id === active.id ? active.validate?.(values) ?? {} : {};
  const isLast = index === steps.length - 1;

  useLayoutEffect(() => {
    const changed = previousPane.current !== paneKey;
    previousPane.current = paneKey;
    const pane = formRef.current?.querySelector<HTMLElement>("[data-stepper-active]");
    if (!pane) return;
    const names = invalid?.id === active?.id ? invalid?.names : undefined;
    const field = names && Array.from(pane.querySelectorAll<HTMLElement>("[data-stepper-field]")).find(
      element => names.includes(element.dataset.stepperField ?? ""),
    );
    const control = field?.querySelector<HTMLElement>(
      'input:not([type="hidden"]):not(:disabled), select:not(:disabled), textarea:not(:disabled), [role="radio"][tabindex="0"], [role="combobox"]:not([aria-disabled="true"])',
    );
    if (control) control.focus({ preventScroll: true });
    else if (changed) (pane.querySelector<HTMLElement>("[data-stepper-focus]") ?? pane).focus({ preventScroll: true });
  }, [paneKey, invalid, active?.id]);

  function move(nextIndex: number) {
    setInvalid(undefined);
    setSubmitError("");
    if (nextIndex === index) return;
    if (step === undefined) setInternalStep(nextIndex);
    onStepChange?.(nextIndex);
  }

  async function advance() {
    if (!active || completed || submittingRef.current) return;
    const drafts = formRef.current?.querySelectorAll<HTMLInputElement>("[data-stepper-active] [data-stepper-tag-draft]");
    const draft = Array.from(drafts ?? []).find(input => input.value.trim());
    if (draft) {
      draft.focus();
      return;
    }
    for (const candidate of isLast ? steps : [active]) {
      const names = Object.entries(candidate.validate?.(values) ?? {}).filter(([, error]) => Boolean(error)).map(([name]) => name);
      if (!names.length) continue;
      move(steps.indexOf(candidate));
      setInvalid({ id: candidate.id, names });
      return;
    }
    if (!isLast) {
      move(index + 1);
      return;
    }
    const snapshot = { ...values };
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError("");
    try {
      await onComplete?.(snapshot);
      setCompleted(snapshot);
    } catch (error) {
      setSubmitError(error instanceof Error && error.message ? error.message : "提交失败，请重试");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  function goTo(id: string) {
    if (submittingRef.current || completed) return;
    const target = steps.findIndex(item => item.id === id);
    if (target >= 0 && target < index) move(target);
    if (target === index + 1) void advance();
  }

  function reset() {
    setValues(initialValues);
    setCompleted(null);
    move(clampStep(initialStep, steps.length));
  }

  if (!active) return null;

  return <div className={cn("kalos-stepper", className)}>
    <style href={stepperStyleHref} precedence="default">{stepperCss}</style>
    <form ref={formRef} aria-label={label} aria-busy={submitting || undefined} noValidate className="kalos-stepper__card"
      onSubmit={event => { event.preventDefault(); void advance(); }}>
      <ol role="list" className="kalos-stepper__steps" aria-label="表单步骤">
        {steps.map((item, position) => {
          const current = !completed && position === index;
          const done = Boolean(completed) || position < index;
          const marker = <>
            <span className="kalos-stepper__track" aria-hidden="true" />
            <span className="kalos-stepper__marker">
              <span className="kalos-stepper__marker-icon" aria-hidden="true">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span key={done ? "done" : "pending"} initial={{ scale: 0.65, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.65, opacity: 0 }} transition={transition}>
                    {done ? <Check /> : item.icon ?? position + 1}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="kalos-stepper__step-title">{item.title}</span>
            </span>
          </>;
          return <li key={item.id} aria-current={current ? "step" : undefined} data-done={done || undefined} data-current={current || undefined}>
            {done && !completed
              ? <KalosButton variant="ghost" type="button" className="kalos-stepper__step" disabled={submitting}
                  aria-label={`返回${item.title}，第 ${position + 1} 步，已完成`} onClick={() => goTo(item.id)}>{marker}</KalosButton>
              : <div className="kalos-stepper__step">{marker}{done ? <span className="sr-only">已完成</span> : null}</div>}
          </li>;
        })}
      </ol>
      <p role="status" aria-atomic="true" className="kalos-stepper__position">
        {completed ? "已完成" : `第 ${index + 1} / ${steps.length} 步 · ${active.title}`}
      </p>
      <motion.div className="kalos-stepper__viewport" initial={false} animate={{ height: height ?? "auto" }} transition={transition}>
        <AnimatePresence initial={false} custom={navigation.direction}>
          <StepPane key={paneKey} heading={completed ? undefined : active.heading ?? active.title}
            description={completed ? undefined : active.description} direction={navigation.direction} disabled={submitting} onMeasure={setHeight}>
            {completed ? (success ? success(completed, reset) : <KalosStepperSuccess onReset={reset} />)
              : <StepFields render={active.render} attempt={invalid?.id === active.id ? invalid : undefined}
                  context={{
                    values, errors, goTo, next: () => formRef.current?.requestSubmit(),
                    setValues: patch => {
                      if (submittingRef.current) return;
                      setValues(current => ({ ...current, ...patch }));
                      if (submitError) setSubmitError("");
                    },
                  }} />}
          </StepPane>
        </AnimatePresence>
      </motion.div>
      <motion.div className="kalos-stepper__footer-viewport" initial={false} inert={Boolean(completed)}
        animate={{ height: completed ? 0 : "auto", opacity: completed ? 0 : 1 }} transition={transition}>
        <div className="kalos-stepper__footer">
          {submitError ? <p role="alert" className={controlStyles.formError}>{submitError}</p> : null}
          <div className="kalos-stepper__actions">
            {index > 0 ? <KalosButton type="button" variant="outline" disabled={submitting} onClick={() => move(index - 1)}>
              <ArrowLeft aria-hidden="true" data-icon="inline-start" />{backLabel}
            </KalosButton> : null}
            <KalosButton type="submit" loading={submitting}>
              {submitting ? submittingLabel : isLast ? submitLabel : nextLabel}
              {!submitting && !isLast ? <ArrowRight aria-hidden="true" data-icon="inline-end" /> : null}
            </KalosButton>
          </div>
        </div>
      </motion.div>
    </form>
  </div>;
}

export function KalosStepperField({ name, label, hint, optional, children }: {
  name: string; label: string; hint?: string; optional?: boolean; children: ReactNode;
}) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const { errors, attempt } = useContext(Validation);
  const error = errors[name];
  const describedBy = error || hint ? `${id}-message` : undefined;

  useEffect(() => {
    if (!error || !attempt || !ref.current) return;
    const animation = ref.current.animate(
      [{ translate: "0" }, { translate: "-3px" }, { translate: "3px" }, { translate: "-2px" }, { translate: "0" }],
      { duration: stepperDefaults.shake },
    );
    return () => animation.cancel();
  }, [attempt, error]);

  return <Field data-stepper-field={name} data-invalid={Boolean(error)} className="kalos-stepper__field">
    <div className="kalos-stepper__label">
      <span id={`${id}-label`} className={controlStyles.label}>{label}</span>
      {optional ? <span>选填</span> : null}
    </div>
    <div ref={ref}>
      <FieldControl value={{ id, labelId: `${id}-label`, describedBy, error }}>{children}</FieldControl>
    </div>
    <KalosFieldMessage id={`${id}-message`} error={error} hint={hint} />
  </Field>;
}

export function KalosStepperInput({ prefix, ...props }: Omit<ComponentProps<"input">, "prefix"> & { prefix?: ReactNode }) {
  const field = useContext(FieldControl);
  return <InputGroup className={controlStyles.inputGroup} data-invalid={Boolean(field?.error)}>
    {prefix ? <span aria-hidden="true" className="kalos-stepper__prefix">{prefix}</span> : null}
    <InputGroupInput {...props} id={field?.id ?? props.id} className={cn(controlStyles.inputContent, props.className)}
      aria-labelledby={field?.labelId ?? props["aria-labelledby"]} aria-invalid={field?.error ? true : props["aria-invalid"]} aria-describedby={field?.describedBy ?? props["aria-describedby"]} />
  </InputGroup>;
}

function validateAddress(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "请输入有效的邮箱地址";
}

export function KalosStepperTags({ value, onChange, validate = validateAddress, max, placeholder }: {
  value: readonly string[];
  onChange: (value: string[]) => void;
  validate?: (entry: string) => string | undefined;
  max?: number;
  placeholder?: string;
}) {
  const field = useContext(FieldControl);
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const describedBy = [field?.describedBy, error ? id : undefined].filter(Boolean).join(" ") || undefined;

  function add(text: string) {
    const entries = text.split(/[\s,;，；]+/).filter(Boolean);
    const next = [...new Set([...value, ...entries])];
    const message = entries.map(validate).find(Boolean) || (max !== undefined && next.length > max ? `最多添加 ${max} 项` : "");
    setError(message);
    if (message) {
      setDraft(text);
      return;
    }
    setDraft("");
    if (next.length > value.length) onChange(next);
  }

  return <>
    <InputGroup className={cn(controlStyles.inputGroup, "kalos-stepper__tags")} data-invalid={Boolean(error || field?.error)}>
      {value.map(entry => <span key={entry} className="kalos-stepper__tag">
        <span>{entry}</span>
        <KalosButton type="button" variant="ghost" size="icon" aria-label={`移除 ${entry}`} onClick={() => {
          onChange(value.filter(item => item !== entry));
          inputRef.current?.focus();
        }}><X aria-hidden="true" /></KalosButton>
      </span>)}
      <InputGroupInput ref={inputRef} id={field?.id} aria-label={field ? undefined : "标签"} aria-labelledby={field?.labelId}
        className={controlStyles.inputContent} aria-invalid={Boolean(error || field?.error)} aria-describedby={describedBy}
        value={draft} data-stepper-tag-draft="" placeholder={value.length ? undefined : placeholder}
        onChange={event => { setDraft(event.target.value); setError(""); }}
        onBlur={() => { if (draft.trim()) add(draft); }}
        onPaste={event => {
          const text = event.clipboardData.getData("text").trim();
          if (!/[\s,;，；]/.test(text)) return;
          event.preventDefault();
          const input = event.currentTarget;
          add(draft.slice(0, input.selectionStart ?? 0) + text + draft.slice(input.selectionEnd ?? draft.length));
        }}
        onKeyDown={event => {
          if (event.nativeEvent.isComposing) return;
          if (event.key === "," || event.key === "，" || (event.key === "Enter" && draft.trim())) {
            event.preventDefault();
            add(draft);
          } else if (event.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }} />
    </InputGroup>
    {error ? <p id={id} role="alert" className={controlStyles.formError}>{error}</p> : null}
  </>;
}

export interface KalosStepperChoice {
  value: string;
  title: string;
  description?: string;
  aside?: ReactNode;
  badge?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export function KalosStepperChoices({ value, onChange, options, label }: {
  value: string; onChange: (value: string) => void; options: readonly KalosStepperChoice[]; label?: string;
}) {
  const field = useContext(FieldControl);
  const layoutId = useId();
  return <RadioGroup value={value} onValueChange={onChange}
    aria-label={field ? undefined : label ?? "选项"} aria-labelledby={field?.labelId}
    aria-describedby={field?.describedBy} aria-invalid={Boolean(field?.error)} className="kalos-stepper__choices">
    {options.map(option =>
      <Radio.Root key={option.value} value={option.value} disabled={option.disabled} className="kalos-stepper__choice"
        onKeyDown={event => {
          if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
          event.preventDefault();
          if (option.value !== value) onChange(option.value);
          else event.currentTarget.closest("form")?.requestSubmit();
        }}>
        {option.value === value ? <motion.span layoutId={layoutId} className="kalos-stepper__choice-ring" transition={transition} /> : null}
        <span className="kalos-stepper__choice-heading">
          {option.icon ? <span aria-hidden="true">{option.icon}</span> : null}
          <span>{option.title}</span>
          <Radio.Indicator keepMounted className="kalos-stepper__choice-dot" />
        </span>
        {option.badge ? <span className="kalos-stepper__badge">{option.badge}</span> : null}
        {option.aside ? <span>{option.aside}</span> : null}
        {option.description ? <span className="kalos-stepper__choice-description">{option.description}</span> : null}
      </Radio.Root>,
    )}
  </RadioGroup>;
}

export function KalosStepperReview({ rows, onEdit }: {
  rows: readonly { label: string; value: ReactNode; step?: string }[];
  onEdit?: (id: string) => void;
}) {
  return <dl className="kalos-stepper__review">
    {rows.map(({ label, value, step }) => <div key={label}>
      <dt>{label}</dt>
      <dd>
        <div>{value}</div>
        {step && onEdit ? <KalosButton type="button" variant="ghost" aria-label={`编辑${label}`}
          onClick={() => onEdit(step)}>编辑</KalosButton> : null}
      </dd>
    </div>)}
  </dl>;
}

export function KalosStepperSuccess({ title = "提交成功", description, onReset, resetLabel = "重新开始" }: {
  title?: string; description?: string; onReset?: () => void; resetLabel?: string;
}) {
  return <div className="kalos-stepper__success">
    <motion.span aria-hidden="true" className="kalos-stepper__success-icon" initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 360, damping: 21 }}><Check /></motion.span>
    <h2 tabIndex={-1} data-stepper-focus>{title}</h2>
    {description ? <p>{description}</p> : null}
    {onReset ? <KalosButton type="button" variant="outline" onClick={onReset}>{resetLabel}</KalosButton> : null}
  </div>;
}
