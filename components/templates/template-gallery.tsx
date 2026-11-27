"use client";

import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { templates } from "@/lib/templates";
import styles from "./template-gallery.module.css";

const categories = ["全部", ...new Set(templates.map((template) => template.category))];

export function TemplateGallery() {
  const [category, setCategory] = useState("全部");
  const visibleTemplates = templates.filter(
    (template) => category === "全部" || category === template.category,
  );

  return (
    <>
      <RadioGroup
        className={styles.filters}
        aria-label="模版分类"
        value={category}
        onValueChange={setCategory}
      >
        {categories.map((label) => (
          <Radio.Root key={label} value={label} className={styles.filter}>
            {label}
          </Radio.Root>
        ))}
      </RadioGroup>
      <ul className={styles.grid}>
        {visibleTemplates.map((template) => (
          <li key={template.href}>
            <Link
              href={template.href}
              aria-label={`预览 ${template.english} ${template.title}`}
              className={styles.card}
              style={{
                "--thumbnail-light": `url("/templates/${template.slug}-light.webp")`,
                "--thumbnail-dark": `url("/templates/${template.slug}-dark.webp")`,
              } as CSSProperties}
            >
              <div className={styles.cover}>
                <h2>{template.english} <span>{template.title}</span></h2>
                {template.description && <p>{template.description}</p>}
                <span className={styles.action}>预览</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
