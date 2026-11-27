import { useId } from "react";

export function StackBrandIcon({ name }: { name: string }) {
  const clipId = useId();
  if (name === "Figma") return <svg viewBox="0 0 18 27" aria-hidden="true"><path fill="#0acf83" d="M4.5 27A4.5 4.5 0 0 0 9 22.5V18H4.5a4.5 4.5 0 0 0 0 9Z"/><path fill="#a259ff" d="M4.5 9H9v9H4.5a4.5 4.5 0 0 1 0-9Z"/><path fill="#f24e1e" d="M4.5 0H9v9H4.5a4.5 4.5 0 0 1 0-9Z"/><path fill="#ff7262" d="M9 0h4.5a4.5 4.5 0 0 1 0 9H9Z"/><circle fill="#1abcfe" cx="13.5" cy="13.5" r="4.5"/></svg>;
  if (name === "Framer") return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 0h14v8h-7l7 8h-7v8l-7-8V8h7L5 0Z"/></svg>;
  if (name === "Linear") return <svg viewBox="0 0 24 24" aria-hidden="true"><defs><clipPath id={clipId}><circle cx="12" cy="12" r="11"/></clipPath></defs><g clipPath={`url(#${clipId})`}><circle cx="12" cy="12" r="11" fill="#6864df"/><path d="m-2 8 18 18M-2 12l14 14M-2 16l10 10M0 4l20 20M3 1l21 21" stroke="white" strokeWidth="1.2"/></g></svg>;
  if (name === "Loom") return <svg viewBox="0 0 24 24" fill="none" stroke="#6254ff" strokeWidth="2.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/>{Array.from({ length: 12 }, (_, index) => <path key={index} d="M12 1v4" transform={`rotate(${index * 30} 12 12)`}/>)}</svg>;
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 12 21H0Z"/></svg>;
}

export function StackTitleIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="1" y="1" width="18" height="18" rx="4" fill="currentColor"/><path d="M6 6.5h8M6 10h8M6 13.5h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
