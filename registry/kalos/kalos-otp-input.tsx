"use client";

import { useEffect, useEffectEvent, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "@base-ui/react/button";
import { OTPField } from "@base-ui/react/otp-field";
import { Check, CircleAlert } from "lucide-react";
import { cn } from "cn";
import { otpCss, otpDefaults, otpStyleHref } from "@/components/ui/kalos-otp-input-styles";

export type KalosOtpStatus = "idle" | "verifying" | "error" | "success";

export type KalosOtpInputProps = Pick<OTPField.Root.Props,
  "id" | "form" | "name" | "required" | "disabled" | "readOnly" | "autoSubmit" | "autoComplete" |
  "value" | "defaultValue" | "onValueChange" | "onValueComplete" | "onValueInvalid" | "aria-describedby"
> & {
  length?: number;
  separator?: boolean | number;
  numeric?: boolean;
  onChange?: (code: string) => void;
  onComplete?: (code: string) => void;
  status?: KalosOtpStatus;
  errorMessage?: ReactNode;
  clearOnError?: boolean;
  successLabel?: string;
  onResend?: () => void | Promise<void>;
  resendIn?: number;
  align?: "start" | "center";
  autoFocus?: boolean;
  label?: string;
  hideLabel?: boolean;
  className?: string;
};

function Resend({ seconds, disabled, onResend }: {
  seconds: number;
  disabled: boolean;
  onResend: NonNullable<KalosOtpInputProps["onResend"]>;
}) {
  const [left, setLeft] = useState(seconds);
  const [cycle, setCycle] = useState(0);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (seconds === 0) return;
    const deadline = Date.now() + seconds * 1000;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const remaining = Math.max(0, deadline - Date.now());
      setLeft(Math.ceil(remaining / 1000));
      if (remaining > 0) timer = setTimeout(tick, remaining % 1000 || 1000);
    };
    timer = setTimeout(tick, 1000);
    return () => clearTimeout(timer);
  }, [cycle, seconds]);

  async function resend() {
    if (disabled || sending || left > 0) return;
    setFailed(false);
    setSending(true);
    try {
      await onResend();
      setLeft(seconds);
      setCycle(count => count + 1);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  const waiting = left > 0;
  const clock = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  return <div className="kalos-otp__resend">
    <span>没收到验证码？</span>{" "}
    <Button type="button" disabled={disabled} aria-disabled={waiting || sending || undefined}
      tabIndex={waiting ? -1 : undefined} onClick={resend}>
      {sending ? "正在发送…" : waiting ? `${clock} 后重发` : "重新发送"}
    </Button>
    <span className="kalos-otp__sr-only" role="status">
      {sending ? "正在发送验证码" : cycle > 0 && waiting ? "验证码已重新发送" : !waiting && seconds > 0 && !failed ? "可以重新发送验证码" : ""}
    </span>
    {failed ? <span className="kalos-otp__resend-error" role="status">发送失败，请重试。</span> : null}
  </div>;
}

const uppercase = (code: string) => code.toUpperCase();

// State motion references affectUI OTP Input (MIT). The notice ships with its generated styles.
export function KalosOtpInput({
  length: requestedLength = 6, separator = false, numeric = true,
  value, defaultValue = "", onChange, onComplete, onValueChange, onValueComplete,
  status = "idle", errorMessage = "验证码不正确，请重试。", clearOnError = true,
  successLabel = "已验证", onResend, resendIn = 30, align = "start", autoFocus = false,
  label = "验证码", hideLabel = false, disabled = false, readOnly = false,
  className, "aria-describedby": describedBy, ...rootProps
}: KalosOtpInputProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  const length = Number.isFinite(requestedLength) ? Math.min(24, Math.max(1, Math.floor(requestedLength))) : 6;
  const split = separator === true ? Math.floor(length / 2) : separator;
  const separatorAt = typeof split === "number" && Number.isInteger(split) && split > 0 && split < length ? split : 0;
  const resendSeconds = Number.isFinite(resendIn) ? Math.max(0, Math.floor(resendIn)) : 30;
  const success = status === "success";
  const verifying = status === "verifying";
  const [innerValue, setInnerValue] = useState(defaultValue);
  const code = value ?? innerValue;
  const [lastStatus, setLastStatus] = useState(status);
  const [dismissedError, setDismissedError] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [focus, setFocus] = useState({ index: 0, entered: false });
  const rootRef = useRef<HTMLDivElement>(null);
  const firstInput = useRef<HTMLInputElement>(null);
  const didAutoFocus = useRef(false);

  if (status !== lastStatus) {
    setLastStatus(status);
    setDismissedError(false);
    setClearing(false);
  }

  const showError = status === "error" && !dismissedError;
  const hasErrorMessage = showError && errorMessage != null && errorMessage !== false;
  const descriptionIds = [describedBy, hasErrorMessage ? errorId : undefined].filter(Boolean).join(" ") || undefined;

  function changeCode(next: string) {
    if (value === undefined) setInnerValue(next);
    onChange?.(next);
  }

  const clearCode = useEffectEvent(() => {
    const group = rootRef.current;
    if (group?.contains(group.ownerDocument.activeElement)) firstInput.current?.focus({ preventScroll: true });
    changeCode("");
    setClearing(false);
  });

  useEffect(() => {
    if (!showError || !clearOnError || !code || disabled || readOnly) return;
    const fade = setTimeout(() => setClearing(true), otpDefaults.shakeDuration + 130);
    const clear = setTimeout(() => clearCode(), otpDefaults.shakeDuration + 130 + otpDefaults.clearDuration + (length - 1) * 15);
    return () => {
      clearTimeout(fade);
      clearTimeout(clear);
    };
  }, [clearOnError, code, disabled, length, readOnly, showError]);

  useEffect(() => {
    if (!autoFocus || didAutoFocus.current || disabled || success) return;
    firstInput.current?.focus({ preventScroll: true });
    didAutoFocus.current = true;
  }, [autoFocus, disabled, success]);

  const stageStyle = {
    "--otp-length": length,
    "--otp-extra": separatorAt ? "calc(var(--otp-gap) + var(--otp-separator))" : "0px",
    "--otp-pill-width": `${Math.min(240, Math.max(112, successLabel.length * 13 + 42))}px`,
  } as CSSProperties;

  return <div className={cn("kalos-otp", className)} data-align={align} data-status={status} data-error={showError || undefined}>
    <style href={otpStyleHref} precedence="default">{otpCss}</style>
    <span id={labelId} className={hideLabel ? "kalos-otp__sr-only" : "kalos-otp__label"}>
      {label}<span className="kalos-otp__sr-only">，{length} 位</span>
    </span>
    <div className="kalos-otp__stage" style={stageStyle}>
      <OTPField.Root
        {...rootProps}
        ref={rootRef}
        dir="ltr"
        aria-labelledby={labelId}
        aria-describedby={descriptionIds}
        aria-invalid={showError || undefined}
        aria-busy={verifying || undefined}
        inert={success}
        className="kalos-otp__row"
        length={length}
        disabled={disabled}
        readOnly={readOnly || verifying || success}
        validationType={numeric ? "numeric" : "alphanumeric"}
        normalizeValue={numeric ? undefined : uppercase}
        value={code}
        onValueChange={(next, details) => {
          onValueChange?.(next, details);
          if (details.isCanceled) return;
          if (showError && next) {
            setDismissedError(true);
            setClearing(false);
          }
          changeCode(next);
        }}
        onValueComplete={(next, details) => {
          onValueComplete?.(next, details);
          onComplete?.(next);
        }}
        render={(props, state) => {
          const active = Math.min(focus.index, state.value.length, length - 1);
          return <div {...props} data-clearing={clearing || undefined} data-focus-enter={focus.entered || undefined} style={{
            "--otp-active-index": active,
            "--otp-active-extra": separatorAt > 0 && active >= separatorAt ? "var(--otp-extra)" : "0px",
          } as CSSProperties}>
            {Array.from({ length }, (_, index) => {
              const digit = state.value[index];
              return <OtpSlot
                key={index}
                index={index}
                length={length}
                digit={digit}
                separatorBefore={index === separatorAt}
                numeric={numeric}
                label={label}
                labelId={labelId}
                descriptionIds={descriptionIds}
                invalid={showError && !disabled}
                locked={disabled || readOnly || verifying || success}
                firstInput={firstInput}
                onFocus={entered => setFocus({ index, entered })}
              />;
            })}
            <span className="kalos-otp__ring" aria-hidden="true" />
          </div>;
        }}
      />
      <div className="kalos-otp__success" aria-hidden="true">
        <div className="kalos-otp__success-content"><Check /><span>{successLabel}</span></div>
      </div>
    </div>
    {errorMessage != null && errorMessage !== false ? <div className="kalos-otp__error" data-show={hasErrorMessage || undefined} inert={!hasErrorMessage}>
      <div><div className="kalos-otp__error-text" id={errorId}>
        <CircleAlert aria-hidden="true" /><span>{errorMessage}</span>
      </div></div>
    </div> : null}
    {onResend && !success ? <Resend key={resendSeconds} seconds={resendSeconds} disabled={disabled || verifying} onResend={onResend} /> : null}
    <span className="kalos-otp__sr-only" role="status">
      {success ? successLabel : verifying ? "正在验证验证码" : showError ? typeof errorMessage === "string" ? errorMessage : "验证码验证失败" : ""}
    </span>
  </div>;
}

function OtpSlot({
  index, length, digit, separatorBefore, numeric, label, labelId, descriptionIds, invalid, locked, firstInput, onFocus,
}: {
  index: number;
  length: number;
  digit: string | undefined;
  separatorBefore: boolean;
  numeric: boolean;
  label: string;
  labelId: string;
  descriptionIds: string | undefined;
  invalid: boolean;
  locked: boolean;
  firstInput: React.RefObject<HTMLInputElement | null>;
  onFocus: (entered: boolean) => void;
}) {
  return <>
    {separatorBefore ? <OTPField.Separator className="kalos-otp__separator" aria-hidden="true" /> : null}
    <span className="kalos-otp__slot" style={{ "--otp-slot-index": index } as CSSProperties}>
      <OTPField.Input
        ref={index === 0 ? firstInput : undefined}
        aria-labelledby={index === 0 ? labelId : undefined}
        aria-label={index > 0 ? `${label}，第 ${index + 1} 位，共 ${length} 位` : undefined}
        aria-describedby={descriptionIds}
        aria-invalid={invalid || undefined}
        autoCapitalize={numeric ? "off" : "characters"}
        onFocus={event => onFocus(!event.relatedTarget || !event.currentTarget.closest(".kalos-otp__row")?.contains(event.relatedTarget))}
        onPaste={event => {
          if (index === 0 || locked || !firstInput.current) return;
          const text = event.clipboardData.getData("text/plain");
          const digits = text.replace(numeric ? /[^0-9]/g : /[^a-z0-9]/gi, "");
          if (digits.length < length) return;
          // Route a whole code through Base UI's first slot even when pasting mid-field.
          const paste = new ClipboardEvent("paste", { bubbles: true, cancelable: true, clipboardData: event.clipboardData });
          if (!paste.clipboardData) return;
          event.preventDefault();
          firstInput.current.dispatchEvent(paste);
        }}
      />
      {digit ? <span key={digit} className="kalos-otp__digit" aria-hidden="true">{digit}</span> : null}
      <span className="kalos-otp__caret" aria-hidden="true" />
    </span>
  </>;
}
