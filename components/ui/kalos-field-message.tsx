"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { controlStyles, fieldMessageMotion } from "@/components/ui/kalos-styles";

const ease: [number, number, number, number] = [...fieldMessageMotion.ease];

export function hasFieldContent(value: ReactNode) {
  return value != null && value !== "" && typeof value !== "boolean";
}

export function KalosFieldMessage({ id, error, hint }: { id: string; error?: ReactNode; hint?: ReactNode }) {
  const invalid = hasFieldContent(error);
  const message = invalid ? error : hint;
  return (
    <AnimatePresence initial={false}>
      {hasFieldContent(message) ? (
        <motion.div
          key="message"
          initial={{ height: 0, opacity: 0, marginTop: -fieldMessageMotion.gap }}
          animate={{ height: "auto", opacity: 1, marginTop: 0 }}
          exit={{ height: 0, opacity: 0, marginTop: -fieldMessageMotion.gap }}
          transition={{ duration: fieldMessageMotion.duration, ease }}
          className="overflow-hidden"
        >
          <motion.div
            key={typeof message === "string" || typeof message === "number" ? message : invalid ? "error" : "hint"}
            id={id}
            role={invalid ? "alert" : undefined}
            initial={{ opacity: 0, y: -fieldMessageMotion.offset }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: fieldMessageMotion.textDuration, ease }}
            className={invalid ? controlStyles.formError : controlStyles.formStatus}
          >
            {message}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
