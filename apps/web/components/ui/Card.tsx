import type { HTMLAttributes } from "react";

import { cn } from "@/components/ui/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/40 bg-white/70 p-5 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.30)] backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}

