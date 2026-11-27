import type { Metadata } from "next";
import { TemplateGallery } from "@/components/templates/template-gallery";
import styles from "@/components/templates/template-gallery.module.css";

export const metadata: Metadata = {
  title: "Template",
  description: "开箱即用的页面模板，助你快速启动项目。",
};

export default function TemplatesPage() {
  return (
    <section className={styles.gallery} aria-labelledby="templates-title">
      <header className={styles.heading}>
        <h1 id="templates-title">Template</h1>
        <p>开箱即用的页面模板，助你快速启动项目。</p>
      </header>
      <TemplateGallery />
    </section>
  );
}
