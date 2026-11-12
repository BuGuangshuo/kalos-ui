export type KalosFormValues = Record<string, string | boolean>;
export type KalosFormErrors = Record<string, string>;
export type KalosFormField = {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "select" | "checkbox" | "switch";
  placeholder?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  minLength?: number;
  autoComplete?: string;
  items?: { value: string; label: string }[];
};

export function initialFormValues(fields: KalosFormField[], defaults: KalosFormValues = {}): KalosFormValues {
  return Object.fromEntries(fields.map(field => [field.name, defaults[field.name] ?? (field.type === "checkbox" || field.type === "switch" ? false : "")]));
}

export function isFormValueEmpty(field: KalosFormField, value: string | boolean | undefined): boolean {
  if (field.type === "checkbox" || field.type === "switch") return value !== true;
  if (typeof value !== "string") return true;
  return field.type === "password" ? value.length === 0 : value.trim().length === 0;
}

export function validateFormValues(fields: KalosFormField[], values: KalosFormValues): KalosFormErrors {
  const errors: KalosFormErrors = {};
  for (const field of fields) {
    if (field.disabled) continue;
    const value = values[field.name];
    if (field.type === "checkbox" || field.type === "switch") {
      if (field.required && value !== true) errors[field.name] = `请${field.type === "switch" ? "开启" : "勾选"}${field.label}`;
      continue;
    }
    const text = typeof value === "string" ? value : "";
    const empty = isFormValueEmpty(field, value);
    if (empty) {
      if (field.required) errors[field.name] = `请${field.type === "select" ? "选择" : "输入"}${field.label}`;
    } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      errors[field.name] = "请输入有效的邮箱地址";
    } else if (field.type === "select" && !field.items?.some(item => item.value === text)) {
      errors[field.name] = "请选择有效的选项";
    } else if (field.minLength && text.length < field.minLength) {
      errors[field.name] = `${field.label}至少需要 ${field.minLength} 位`;
    }
  }
  return errors;
}
