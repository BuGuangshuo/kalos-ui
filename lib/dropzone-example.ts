export const dropzoneExample = `"use client";

import { KalosDropzone, type KalosDropzoneProps } from "@/components/ui/kalos-dropzone";

const uploadFile: NonNullable<KalosDropzoneProps["onUpload"]> = (file, reportProgress, signal) =>
  new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    const cancel = () => request.abort();
    const data = new FormData();
    data.append("file", file);

    request.open("POST", "/api/uploads");
    request.upload.onprogress = event => {
      if (event.lengthComputable && event.total > 0) {
        reportProgress(event.loaded / event.total);
      }
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) resolve();
      else reject(new Error("上传失败，请重试"));
    };
    request.onerror = () => reject(new Error("网络连接中断"));
    request.onabort = () => reject(signal.reason);
    request.onloadend = () => signal.removeEventListener("abort", cancel);
    signal.addEventListener("abort", cancel, { once: true });
    request.send(data);
  });

export function Attachments() {
  return <KalosDropzone
    accept={[".pdf", ".png", ".jpg", ".xlsx", ".docx", ".mp4"]}
    onUpload={uploadFile}
  />;
}`;

export const dropzoneButtonExample = `import { KalosDropzone } from "@/components/ui/kalos-dropzone";

export function UploadButton() {
  return <KalosDropzone
    variant="button"
    accept={[".pdf", ".png", ".jpg", ".xlsx", ".docx", ".mp4"]}
  />;
}`;
