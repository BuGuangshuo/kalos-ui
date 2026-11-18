"use client";

import { useEffect, useRef, useState } from "react";
import { KalosCombobox } from "@/registry/kalos/kalos-combobox";
import { reviewers } from "@/lib/combobox-examples";

export function ComboboxDemo({ initialOpen = false }: { initialOpen?: boolean }) {
  const [selected, setSelected] = useState<string[]>([]);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { hash } = window.location;
    if (initialOpen && (!hash || hash === "#preview")) {
      input.current?.focus({ preventScroll: true });
    }
  }, [initialOpen]);

  return <div className="w-full max-w-[420px]">
    <KalosCombobox
      ref={input}
      label="审阅人"
      defaultOpen={initialOpen}
      name="reviewers"
      placeholder="添加审阅人…"
      options={reviewers}
      value={selected}
      onChange={setSelected}
      maxVisibleTags={4}
      creatable
      createLabel={text => `添加“${text}”`}
    />
  </div>;
}
