import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyVND(value: number | bigint) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(typeof value === "bigint" ? Number(value) : value);
}

export function formatCompactNumber(value: number | bigint) {
  return new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(
    typeof value === "bigint" ? Number(value) : value,
  );
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function toVnd(value: number) {
  return `${value.toLocaleString("vi-VN")} ₫`;
}
