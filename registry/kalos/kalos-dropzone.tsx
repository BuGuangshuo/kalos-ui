"use client";

import { Button } from "@base-ui/react/button";
import { Progress } from "@base-ui/react/progress";
import { cn } from "cn";
import { Check, File, RotateCw, Upload, X } from "lucide-react";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { useEffect, useEffectEvent, useId, useRef, useState, type DragEvent } from "react";
import { dropzoneCss, dropzoneDefaults, dropzoneStyleHref } from "@/components/ui/kalos-dropzone-styles";
import { KalosButton } from "./kalos-button";

export type KalosUploadItem = {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "done" | "error";
  progress: number;
  error?: string;
  file?: File;
};

export type KalosDropzoneProps = {
  variant?: "area" | "button";
  accept?: string[];
  maxSize?: number;
  onUpload?: (file: File, onProgress: (progress: number) => void, signal: AbortSignal) => Promise<void>;
  onChange?: (items: KalosUploadItem[]) => void;
  hint?: string;
  autoplay?: boolean;
  className?: string;
};

type Sample = {
  name: string;
  size: number;
  duration: number;
  fails?: boolean;
};

type Entry = {
  item: KalosUploadItem;
  sample?: Sample;
  retryable: boolean;
  remaining?: number;
  delay: number;
};

const megabyte = 1024 ** 2;
const defaultMaxSize = 25 * megabyte;
const sizeFormat = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 });
const samples: Sample[] = [
  { name: "产品手册.pdf", size: Math.round(4.2 * megabyte), duration: 3600 },
  { name: "封面预览.png", size: Math.round(2.6 * megabyte), duration: 2750 },
  { name: "物料清单.xlsx", size: Math.round(1.3 * megabyte), duration: 3100, fails: true },
  { name: "会议纪要.docx", size: Math.round(1.8 * megabyte), duration: 3200 },
  { name: "演示录屏.mp4", size: 32 * megabyte, duration: 0 },
];

function formatSize(bytes: number) {
  if (bytes >= 1024 ** 3) return `${sizeFormat.format(bytes / 1024 ** 3)}\u00a0GB`;
  if (bytes >= megabyte) return `${sizeFormat.format(bytes / megabyte)}\u00a0MB`;
  if (bytes >= 1024) return `${sizeFormat.format(bytes / 1024)}\u00a0KB`;
  return `${sizeFormat.format(bytes)}\u00a0B`;
}

function fileTone(name: string) {
  const extension = name.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf": return "document";
    case "png": case "jpg": case "jpeg": case "webp": case "gif": case "svg":
      return "image";
    case "xls": case "xlsx": case "csv":
      return "sheet";
    case "doc": case "docx":
      return "word";
    case "mp4": case "mov": case "webm":
      return "video";
    default: return "file";
  }
}

function simulateUpload(
  duration: number,
  report: (progress: number) => void,
  signal: AbortSignal,
  fails: boolean,
) {
  return new Promise<void>((resolve, reject) => {
    const started = performance.now();
    const stop = () => clearInterval(timer);
    const abort = () => {
      stop();
      reject(signal.reason);
    };
    const threshold = fails ? 0.68 : 1;
    const timer = setInterval(() => {
      const progress = Math.min(threshold, (performance.now() - started) / duration);
      report(progress);
      if (progress < threshold) return;
      stop();
      signal.removeEventListener("abort", abort);
      if (fails) reject(new Error("连接中断"));
      else resolve();
    }, 80);
    signal.addEventListener("abort", abort, { once: true });
  });
}

function UploadRow({
  entry,
  onRemove,
  onRetry,
}: {
  entry: Entry;
  onRemove: (button: HTMLButtonElement) => void;
  onRetry: (button: HTMLButtonElement) => void;
}) {
  const { item, retryable, remaining, delay } = entry;
  const present = useIsPresent();
  const { name, size, status, progress, error } = item;
  const showProgress = status === "uploading" || retryable;
  const sizeLabel = status === "uploading"
    ? `${formatSize(Math.round(size * progress))} / ${formatSize(size)}`
    : formatSize(size);

  return <motion.li
    className="kalos-dropzone-row"
    initial={{ height: 0, opacity: 0, y: -4 }}
    animate={{ height: "auto", opacity: 1, y: 0 }}
    exit={{ height: 0, opacity: 0, y: -3 }}
    transition={{ duration: dropzoneDefaults.duration / 1000, ease: [...dropzoneDefaults.ease], delay: present ? delay : 0 }}
    inert={!present}
    aria-hidden={present ? undefined : true}
    data-status={status}
  >
    <div className="kalos-dropzone-row-content">
      <span className="kalos-dropzone-mark" data-tone={fileTone(name)} aria-hidden="true"><File /></span>
      <div className="kalos-dropzone-file">
        <div className="kalos-dropzone-file-heading">
          <span className="kalos-dropzone-name" title={name}>{name}</span>
          {status === "done" && <span className="kalos-dropzone-done"><Check aria-hidden="true" /><span className="kalos-dropzone-sr">已上传</span></span>}
        </div>
        <div className="kalos-dropzone-meta">
          <span>{status === "error" ? error : sizeLabel}</span>
          {status === "uploading" && remaining != null && <span>约 {remaining} 秒</span>}
        </div>
        <Progress.Root
          value={Math.round(progress * 100)}
          aria-label={`${name}上传进度`}
          aria-hidden={!showProgress}
          data-visible={showProgress ? "" : undefined}
          className="kalos-dropzone-progress"
        >
          <Progress.Track className="kalos-dropzone-track"><Progress.Indicator className="kalos-dropzone-indicator" /></Progress.Track>
        </Progress.Root>
      </div>
      <div className="kalos-dropzone-actions">
        {retryable && <Button type="button" aria-label={`重试 ${name}`} title="重试" onClick={event => onRetry(event.currentTarget)}><RotateCw aria-hidden="true" /></Button>}
        <Button type="button" data-remove="" aria-label={`移除 ${name}`} title="移除" onClick={event => onRemove(event.currentTarget)}><X aria-hidden="true" /></Button>
      </div>
    </div>
  </motion.li>;
}

export function KalosDropzone({
  variant = "area",
  accept,
  maxSize = defaultMaxSize,
  onUpload,
  onChange,
  hint,
  autoplay = false,
  className,
}: KalosDropzoneProps) {
  const titleId = useId();
  const hintId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const entriesRef = useRef<Entry[]>([]);
  const onChangeRef = useRef(onChange);
  const attempts = useRef(new Map<string, AbortController>());
  const nextId = useRef(0);
  const dragDepth = useRef(0);
  const demoInterrupted = useRef(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [dragCount, setDragCount] = useState<number | null>(null);
  const [demoDrag, setDemoDrag] = useState(false);
  const [announcements, setAnnouncements] = useState<{ id: number; text: string }[]>([]);
  const allowed = accept?.map(type => type.trim().toLowerCase()).filter(Boolean) ?? [];
  const constraints = hint ?? [
    allowed.length ? allowed.map(type => type.startsWith(".") ? type.slice(1).toUpperCase() : type).join("、") : "",
    Number.isFinite(maxSize) ? `单文件上限 ${formatSize(maxSize)}` : "",
  ].filter(Boolean).join(" · ");
  const describedBy = constraints ? hintId : undefined;
  const activeCount = dragCount ?? (autoplay && demoDrag ? samples.length : null);
  const uploading = entries.filter(({ item }) => item.status === "uploading").length;
  const failed = entries.filter(({ item }) => item.status === "error").length;
  const done = entries.length - uploading - failed;
  const uploadedBytes = entries.reduce((sum, { item }) => sum + item.size * item.progress, 0);
  const uploadableBytes = entries.reduce((sum, { item, retryable }) => sum + (item.status !== "error" || retryable ? item.size : 0), 0);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const running = attempts.current;
    return () => {
      for (const controller of running.values()) controller.abort();
      running.clear();
    };
  }, []);

  function publish(next: Entry[]) {
    entriesRef.current = next;
    setEntries(next);
    onChangeRef.current?.(next.map(({ item }) => ({ ...item })));
  }

  function announce(text: string) {
    const id = ++nextId.current;
    setAnnouncements(current => [...current.slice(-7), { id, text }]);
  }

  function replace(id: string, update: (entry: Entry) => Entry) {
    publish(entriesRef.current.map(entry => entry.item.id === id ? update(entry) : entry));
  }

  async function upload(entry: Entry, retry = false) {
    const { item: { id, file, name, size }, sample } = entry;
    const controller = new AbortController();
    const { signal } = controller;
    attempts.current.set(id, controller);
    const started = performance.now();
    let latest = 0;
    const report = (progress: number) => {
      if (signal.aborted || attempts.current.get(id) !== controller || !Number.isFinite(progress)) return;
      const current = Math.min(1, Math.max(latest, progress));
      if (current === latest) return;
      latest = current;
      const remaining = current < 1 ? Math.max(1, Math.ceil((performance.now() - started) * (1 - current) / current / 1000)) : undefined;
      replace(id, row => ({ ...row, remaining, item: { ...row.item, progress: current } }));
    };

    try {
      if (file && onUpload) await onUpload(file, report, signal);
      else {
        const duration = sample?.duration ?? Math.min(4200, 900 + size / megabyte * 110);
        await simulateUpload(duration, report, signal, Boolean(sample?.fails && !retry));
      }
    } catch (error) {
      if (signal.aborted || attempts.current.get(id) !== controller) return;
      attempts.current.delete(id);
      const message = (error instanceof Error ? error.message : typeof error === "string" ? error : "") || "上传失败";
      replace(id, row => ({ ...row, retryable: true, item: { ...row.item, status: "error", error: message } }));
      announce(`${name}，${message}`);
      return;
    }

    if (signal.aborted || attempts.current.get(id) !== controller) return;
    attempts.current.delete(id);
    replace(id, row => ({ ...row, item: { ...row.item, status: "done", progress: 1 } }));
    announce(`${name}已上传`);
  }

  function addFiles(files: File[], demoFiles: Sample[] = []) {
    const sources = [...files.map(file => ({ file })), ...demoFiles.map(sample => ({ sample }))];
    if (!sources.length) return;

    const added = sources.map((source, index): Entry => {
      const file = "file" in source ? source.file : undefined;
      const sample = "sample" in source ? source.sample : undefined;
      const { name, size } = "file" in source ? source.file : source.sample;
      const type = file?.type.toLowerCase();
      const accepted = !file || !allowed.length || allowed.some(pattern => {
        if (pattern.startsWith(".")) return name.toLowerCase().endsWith(pattern);
        if (pattern.endsWith("/*")) return type?.startsWith(pattern.slice(0, -1));
        return type === pattern;
      });
      const limit = sample ? defaultMaxSize : maxSize;
      let error: string | undefined;
      if (!accepted) error = "不支持此文件类型";
      else if (size > limit) error = `文件过大，单个文件最大 ${formatSize(limit)}`;
      return {
        item: { id: String(++nextId.current), name, size, file, status: error ? "error" : "uploading", progress: 0, error },
        sample,
        retryable: false,
        delay: Math.min(index, 5) * 0.055,
      };
    });
    publish([...entriesRef.current, ...added]);
    for (const entry of added) {
      if (entry.item.error) announce(`${entry.item.name}，${entry.item.error}`);
      else void upload(entry);
    }
  }

  const playSample = useEffectEvent(() => {
    if (demoInterrupted.current) return;
    interruptDemo();
    addFiles([], samples);
  });

  useEffect(() => {
    if (!autoplay) return;
    const fan = variant === "area" ? setTimeout(() => {
      if (!demoInterrupted.current) setDemoDrag(true);
    }, 550) : undefined;
    const drop = setTimeout(() => playSample(), 1250);
    return () => {
      clearTimeout(fan);
      clearTimeout(drop);
    };
  }, [autoplay, variant]);

  function interruptDemo() {
    demoInterrupted.current = true;
    setDemoDrag(false);
  }

  function openFilePicker() {
    interruptDemo();
    inputRef.current?.click();
  }

  function dragFiles(event: DragEvent<HTMLButtonElement>) {
    return event.dataTransfer.types.includes("Files");
  }

  function retryUpload(entry: Entry, button: HTMLButtonElement) {
    if (attempts.current.has(entry.item.id)) return;
    button.parentElement?.querySelector<HTMLButtonElement>("[data-remove]")?.focus();
    replace(entry.item.id, row => ({
      ...row,
      retryable: false,
      remaining: undefined,
      item: { ...row.item, status: "uploading", progress: 0, error: undefined },
    }));
    void upload(entry, true);
  }

  function remove(entry: Entry, button: HTMLButtonElement) {
    const row = button.closest("li");
    if (row?.contains(document.activeElement)) {
      const next = row.nextElementSibling?.querySelector<HTMLButtonElement>("[data-remove]");
      const previous = row.previousElementSibling?.querySelector<HTMLButtonElement>("[data-remove]");
      const target = [next, previous].find(action => action && !action.closest("[inert]"));
      (target ?? triggerRef.current)?.focus();
    }
    const { id, name } = entry.item;
    attempts.current.get(id)?.abort();
    attempts.current.delete(id);
    publish(entriesRef.current.filter(({ item }) => item.id !== id));
    announce(`已移除 ${name}`);
  }

  return <div className={cn("kalos-dropzone", className)} data-variant={variant}>
    <style href={dropzoneStyleHref} precedence="default">{dropzoneCss}</style>
    <input ref={inputRef} type="file" multiple hidden accept={allowed.join(",") || undefined} onChange={event => {
      addFiles(Array.from(event.currentTarget.files ?? []));
      event.currentTarget.value = "";
    }} />
    {variant === "button" ? <>
      <KalosButton ref={triggerRef} type="button" variant="secondary" aria-describedby={describedBy} onClick={openFilePicker}>
        上传文件
      </KalosButton>
      {constraints && <span className="kalos-dropzone-sr" id={hintId}>{constraints}</span>}
    </> : <Button
      ref={triggerRef}
      type="button"
      className="kalos-dropzone-target"
      aria-labelledby={titleId}
      aria-describedby={describedBy}
      data-dragging={activeCount !== null ? "" : undefined}
      onClick={openFilePicker}
      onDragEnter={event => {
        if (!dragFiles(event)) return;
        event.preventDefault();
        interruptDemo();
        dragDepth.current++;
        setDragCount(Array.from(event.dataTransfer.items).filter(item => item.kind === "file").length || event.dataTransfer.files.length);
      }}
      onDragOver={event => {
        if (!dragFiles(event)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      }}
      onDragLeave={() => {
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (!dragDepth.current) setDragCount(null);
      }}
      onDrop={event => {
        if (!dragFiles(event)) return;
        event.preventDefault();
        interruptDemo();
        dragDepth.current = 0;
        setDragCount(null);
        addFiles(Array.from(event.dataTransfer.files));
      }}
    >
      <span className="kalos-dropzone-art" aria-hidden="true">
        <span className="kalos-dropzone-paper" data-tone="document"><File /><span>PDF</span></span>
        <span className="kalos-dropzone-paper" data-tone="image"><File /><span>PNG</span></span>
        <span className="kalos-dropzone-upload-icon"><Upload /></span>
      </span>
      <span className="kalos-dropzone-title" id={titleId}>
        <span key={activeCount === null ? "idle" : "drag"}>
          {activeCount === null ? <>拖放文件或<span className="kalos-dropzone-browse">浏览</span></> : activeCount > 0 ? `松开以上传 ${activeCount} 个文件` : "松开以上传文件"}
        </span>
      </span>
      {constraints && <span className="kalos-dropzone-hint" id={hintId}>{constraints}</span>}
    </Button>}
    <div className="kalos-dropzone-files">
      <ul className="kalos-dropzone-list" role="list" aria-label="上传文件">
        <AnimatePresence initial={false}>
          {entries.map(entry => <UploadRow key={entry.item.id} entry={entry} onRetry={button => retryUpload(entry, button)} onRemove={button => remove(entry, button)} />)}
        </AnimatePresence>
      </ul>
      <div className="kalos-dropzone-summary" data-uploading={uploading ? "" : undefined}>
        {uploading ? <><span>正在上传 {uploading} / {entries.length} 个文件</span><span>{formatSize(Math.round(uploadedBytes))} / {formatSize(uploadableBytes)}</span></>
          : entries.length ? <><span>{done} 个已上传</span>{failed > 0 && <span>{failed} 个失败</span>}</> : "暂无文件"}
      </div>
    </div>
    <div className="kalos-dropzone-sr" aria-live="polite" aria-relevant="additions">
      {announcements.map(({ id, text }) => <div key={id}>{text}</div>)}
    </div>
  </div>;
}
