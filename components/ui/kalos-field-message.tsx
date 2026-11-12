"use client";

import { AnimatePresence, motion } from "motion/react";
import { controlStyles, fieldMessageMotion } from "@/components/ui/kalos-styles";

const ease: [number, number, number, number] = [...fieldMessageMotion.ease];

export function KalosFieldMessage({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  const message = error || hint;
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.div
          key="message"
          initial={{ height: 0, opacity: 0, marginTop: -fieldMessageMotion.gap }}
          animate={{ height: "auto", opacity: 1, marginTop: 0 }}
          exit={{ height: 0, opacity: 0, marginTop: -fieldMessageMotion.gap }}
          transition={{ duration: fieldMessageMotion.duration, ease }}
          className="overflow-hidden"
        >
          <motion.div
            key={message}
            id={id}
            role={error ? "alert" : undefined}
            initial={{ opacity: 0, y: -fieldMessageMotion.offset }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: fieldMessageMotion.textDuration, ease }}
            className={error ? controlStyles.formError : controlStyles.formStatus}
          >
            {message}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
