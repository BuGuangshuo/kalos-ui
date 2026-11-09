import { Progress } from "@/components/ui/progress";
export function PopProgress({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description?: string;
}) {
  const percent = Math.min(
    100,
    Math.max(0, Number.isFinite(value) ? value : 0),
  );
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {Math.round(percent)}%
        </span>
      </div>
      <Progress
        value={percent}
        aria-label={label}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
