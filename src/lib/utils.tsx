import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FiFileText, FiImage, FiVideo } from "react-icons/fi";
import type { FileWithPreview } from "@/types";
import { JSX } from "react";
import React from "react";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatBytes = (bytes: number, opts: { decimals?: number; sizeType?: "accurate" | "normal" } = {}) => {
  const { decimals = 0, sizeType = "normal" } = opts;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${sizeType === "accurate" ? accurateSizes[i] ?? "Bytes" : sizes[i] ?? "Bytes"}`;
};

export const extractFileNameFromPath = (path: string) => path.split("/").pop();

export const isWhitespaceString = (str: string) => !/\S/.test(str);

export const pdfURLtoBlobUrl = async (newUrl: string): Promise<FileWithPreview> => {
  const url = newUrl.replace("http:", new URL(newUrl).host.endsWith("ngrok-free.app") ? "https:" : location.protocol);
  const pdfResponse = await fetch(url, {
    headers: { "Content-Type": "application/pdf", "ngrok-skip-browser-warning": "true" },
  });
  const blob = new Blob([await pdfResponse.blob()], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  return {
    name: extractFileNameFromPath(url) ?? "",
    lastModified: new Date().getDate(),
    webkitRelativePath: "",
    preview: blobUrl,
    ...blob,
  } satisfies FileWithPreview;
};

// project
export const getFileIcon = (fileName: string): JSX.Element => {
  const extension = fileName?.split(".").pop()?.toLowerCase();

  if (extension === "pdf") {
    return <FiFileText className="w-5 h-5 text-primary flex-shrink-0" />;
  }

  if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
    return <FiImage className="w-5 h-5 text-primary flex-shrink-0" />;
  }

  if (["mp4", "mov", "avi", "mkv"].includes(extension || "")) {
    return <FiVideo className="w-5 h-5 text-primary flex-shrink-0" />;
  }

  return <FiFileText className="w-5 h-5 text-primary flex-shrink-0" />;
};
