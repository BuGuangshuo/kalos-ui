"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { KalosOtpInput, type KalosOtpStatus } from "@/registry/kalos/kalos-otp-input";

const demoCode = "482913";

type PreviewStep = { delay: number; value?: string; status?: KalosOtpStatus };

function typeCode(code: string): PreviewStep[] {
  return Array.from(code, (_, index) => ({ delay: 145, value: code.slice(0, index + 1) }));
}

const previewSteps: PreviewStep[] = [
  { delay: 350 },
  ...typeCode("481973"),
  { delay: 220, status: "verifying" },
  { delay: 900, status: "error" },
  { delay: 1600, value: "", status: "idle" },
  ...typeCode(demoCode),
  { delay: 220, status: "verifying" },
  { delay: 900, status: "success" },
  { delay: 3000, value: "", status: "idle" },
];

export function OtpInputDemo({ compact = false }: { compact?: boolean }) {
  return compact
    ? <KalosOtpInput defaultValue="482" separator align="center" hideLabel />
    : <EmailVerificationDemo />;
}

function EmailVerificationDemo() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<KalosOtpStatus>("idle");
  const cardRef = useRef<HTMLDivElement>(null);
  const cancelPreview = useRef<() => void>(undefined);
  const verifyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    let timer: ReturnType<typeof setTimeout>;

    function play(index: number) {
      const step = previewSteps[index];
      if (!step) {
        cancelPreview.current = undefined;
        return;
      }
      timer = setTimeout(() => {
        if (step.value !== undefined) setValue(step.value);
        if (step.status !== undefined) setStatus(step.status);
        play(index + 1);
      }, step.delay);
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || !cancelPreview.current) return;
      observer.disconnect();
      play(0);
    });
    const cancel = () => {
      observer.disconnect();
      clearTimeout(timer);
    };
    cancelPreview.current = cancel;
    observer.observe(card);
    return () => {
      cancel();
      cancelPreview.current = undefined;
      clearTimeout(verifyTimer.current);
    };
  }, []);

  function stopPreview() {
    if (!cancelPreview.current) return;
    cancelPreview.current();
    cancelPreview.current = undefined;
    setStatus("idle");
  }

  function takeOver(event: SyntheticEvent) {
    if (event.target instanceof HTMLInputElement) stopPreview();
  }

  function clear() {
    stopPreview();
    clearTimeout(verifyTimer.current);
    setValue("");
    setStatus("idle");
  }

  function verify(code: string) {
    stopPreview();
    clearTimeout(verifyTimer.current);
    setStatus("verifying");
    verifyTimer.current = setTimeout(() => setStatus(code === demoCode ? "success" : "error"), 750);
  }

  return <Card ref={cardRef} className="w-full max-w-[400px] gap-5 pt-6 text-center">
    <CardHeader className="justify-items-center gap-1.5">
      <span className="mb-1.5 grid size-9 place-items-center rounded-[10px] bg-background text-muted-foreground shadow-sm ring-1 ring-border [&>svg]:size-4" aria-hidden="true">
        <Mail />
      </span>
      <CardTitle className="text-[15px] leading-[22px]">查看邮箱</CardTitle>
      <CardDescription>验证码已发送至 <span className="text-foreground">maya@example.com</span></CardDescription>
    </CardHeader>
    <CardContent className="min-h-[74px] min-w-0" onFocusCapture={takeOver} onPointerDownCapture={takeOver}>
      <KalosOtpInput
        value={value}
        onValueChange={stopPreview}
        onChange={next => {
          setValue(next);
          if (next && status === "error") setStatus("idle");
        }}
        onComplete={verify}
        status={status}
        onResend={clear}
        separator
        align="center"
        hideLabel
      />
    </CardContent>
    <CardFooter className="min-h-9 justify-center gap-1 bg-transparent py-2 text-xs text-muted-foreground">
      {status !== "success" ? <span>演示验证码</span> : null}
      <button type="button" className="cursor-pointer rounded-sm px-0.5 text-foreground tabular-nums hover:underline aria-disabled:cursor-default aria-disabled:no-underline aria-disabled:opacity-60"
        aria-disabled={status === "verifying" || undefined}
        aria-label={status === "success" ? undefined : "填入演示验证码 482 913"}
        onClick={() => {
          if (status === "verifying") return;
          if (status === "success") {
            clear();
          } else {
            setValue(demoCode);
            verify(demoCode);
          }
        }}>
        {status === "success" ? "再试一次" : "482 913"}
      </button>
    </CardFooter>
  </Card>;
}
