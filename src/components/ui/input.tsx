import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-full border border-transparent bg-white px-4 text-sm text-text-primary shadow-sm outline-none transition placeholder:text-text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/20",
        className,
      )}
      {...props}
    />
  );
}
