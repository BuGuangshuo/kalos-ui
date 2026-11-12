"use client";
import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/kalos-aria-card";
import { FieldGroup } from "@/components/ui/kalos-aria-field";
import { controlStyles } from "@/components/ui/kalos-styles";
import { initialFormValues, isFormValueEmpty, validateFormValues, type KalosFormErrors, type KalosFormField, type KalosFormValues } from "@/components/ui/kalos-form-state";
import { KalosInput } from "./kalos-input";
import { KalosSelect } from "./kalos-select";
import { KalosCheckbox } from "./kalos-checkbox";
import { KalosSwitch } from "./kalos-switch";
import { KalosButton } from "./kalos-button";
export type { KalosFormField, KalosFormValues, KalosFormErrors } from "@/components/ui/kalos-form-state";

export interface KalosFormProps {
  title?: string;
  fields: KalosFormField[];
  defaultValues?: KalosFormValues;
  validate?: (values: KalosFormValues) => KalosFormErrors;
  onSubmit?: (values: KalosFormValues) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function KalosForm({ title = "表单", fields, defaultValues, validate, onSubmit, onCancel, submitLabel = "保存", cancelLabel = "取消", disabled = false, className, "aria-label": label = "表单" }: KalosFormProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const savingRef = useRef(false);
  const [values, setValues] = useState(() => initialFormValues(fields, defaultValues));
  const savedValues = useRef(values);
  const [errors, setErrors] = useState<KalosFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [saveError, setSaveError] = useState("");
  const [revision, setRevision] = useState(0);
  const getErrors = (next: KalosFormValues) => ({ ...validateFormValues(fields, next), ...validate?.(next) });
  const change = (name: string, value: string | boolean) => {
    const next = { ...values, [name]: value };
    setValues(next);
    setStatus("");
    setSaveError("");
    const field = fields.find(item => item.name === name);
    const emptied = field && !isFormValueEmpty(field, values[name]) && isFormValueEmpty(field, value);
    if (submitted) {
      setErrors(getErrors(next));
    } else if (errors[name] || emptied || (field && !isFormValueEmpty(field, value))) {
      const error = getErrors(next)[name];
      setErrors(previous => {
        const updated = { ...previous };
        if (error) updated[name] = error;
        else delete updated[name];
        return updated;
      });
    }
  };
  return (
    <form ref={formRef} noValidate aria-label={label} aria-busy={saving || undefined} className={cn(controlStyles.form, className)}
      onSubmit={async event => {
        event.preventDefault();
        if (disabled || savingRef.current) return;
        const nextErrors = getErrors(values);
        setErrors(nextErrors);
        setSubmitted(true);
        setStatus("");
        setSaveError("");
        const firstError = fields.find(field => !field.disabled && nextErrors[field.name]);
        if (firstError) {
          const group = Array.from(formRef.current?.querySelectorAll<HTMLElement>("[data-form-field]") ?? []).find(element => element.dataset.formField === firstError.name);
          group?.querySelector<HTMLElement>('input:not([type="hidden"]), [role="combobox"], button')?.focus();
          return;
        }
        if (Object.values(nextErrors).some(Boolean)) return;
        savingRef.current = true;
        setSaving(true);
        try {
          const snapshot = { ...values };
          await onSubmit?.(snapshot);
          savedValues.current = snapshot;
          setStatus("已保存");
          setSubmitted(false);
          setRevision(value => value + 1);
        } catch {
          setSaveError("保存失败，请重试");
        } finally {
          savingRef.current = false;
          setSaving(false);
        }
      }}
      onReset={event => {
        event.preventDefault();
        if (disabled || savingRef.current) return;
        setValues({ ...savedValues.current });
        setErrors({});
        setSubmitted(false);
        setSaveError("");
        setStatus("已取消更改");
        setRevision(value => value + 1);
        onCancel?.();
      }}
    >
      <Card className={controlStyles.formCard}>
      <CardHeader className={controlStyles.formHeader}><CardTitle id={`${id}-title`} className={controlStyles.formTitle}>{title}</CardTitle></CardHeader>
      <CardContent className={controlStyles.formContent}>
      <FieldGroup key={revision} className={controlStyles.formFields}>
        {fields.map(field => {
          const fieldId = `${id}-${field.name}`;
          const error = errors[field.name];
          const inactive = disabled || saving || field.disabled;
          return <div key={field.name} data-form-field={field.name}>
            {field.type === "select" ? <KalosSelect id={fieldId} name={field.name} label={field.label} items={field.items ?? []} placeholder={field.placeholder} value={String(values[field.name] ?? "")} onValueChange={value => change(field.name, value)} hint={field.hint} error={error} disabled={inactive} required={field.required} />
              : field.type === "checkbox" ? <KalosCheckbox id={fieldId} name={field.name} label={field.label} checked={values[field.name] === true} onCheckedChange={value => change(field.name, value === true)} description={field.hint} error={error} disabled={inactive} required={field.required} />
              : field.type === "switch" ? <KalosSwitch id={fieldId} name={field.name} label={field.label} checked={values[field.name] === true} onCheckedChange={value => change(field.name, value)} description={field.hint} error={error} disabled={inactive} required={field.required} />
              : <KalosInput id={fieldId} name={field.name} label={field.label} type={field.type} value={String(values[field.name] ?? "")} onChange={event => change(field.name, event.target.value)} placeholder={field.placeholder} hint={field.hint} error={error} disabled={inactive} required={field.required} minLength={field.minLength} autoComplete={field.autoComplete} />}
          </div>;
        })}
      </FieldGroup>
      </CardContent>
      <CardFooter className={controlStyles.formFooter}>
      <div className={controlStyles.formActions}>
        <KalosButton type="reset" variant="outline" disabled={disabled || saving}>{cancelLabel}</KalosButton>
        <KalosButton type="submit" loading={saving} disabled={disabled}>{submitLabel}</KalosButton>
      </div>
      {saveError ? <p role="alert" className={controlStyles.formError}>{saveError}</p> : null}
      {status ? <p role="status" className={controlStyles.formStatus}>{status}</p> : null}
      </CardFooter>
      </Card>
    </form>
  );
}
