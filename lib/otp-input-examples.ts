export const otpInputExample = `"use client";

import { useState } from "react";
import { KalosOtpInput, type KalosOtpStatus } from "@/components/ui/kalos-otp-input";

type VerifyEmailProps = {
  verifyCode: (code: string) => Promise<boolean>;
  sendCode: () => Promise<void>;
};

export default function VerifyEmail({ verifyCode, sendCode }: VerifyEmailProps) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<KalosOtpStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [resending, setResending] = useState(false);

  async function verify(code: string) {
    setStatus("verifying");
    try {
      const valid = await verifyCode(code);
      if (valid) {
        setStatus("success");
      } else {
        setErrorMessage("验证码不正确，请重试。");
        setStatus("error");
      }
    } catch {
      setErrorMessage("验证失败，请稍后重试。");
      setStatus("error");
    }
  }

  async function resend() {
    setResending(true);
    try {
      await sendCode();
      setValue("");
      setStatus("idle");
    } finally {
      setResending(false);
    }
  }

  return (
    <KalosOtpInput
      label="邮箱验证码"
      value={value}
      onChange={next => {
        setValue(next);
        if (next && status === "error") setStatus("idle");
      }}
      onComplete={verify}
      onResend={resend}
      readOnly={resending}
      status={status}
      errorMessage={errorMessage}
      separator
    />
  );
}`;
