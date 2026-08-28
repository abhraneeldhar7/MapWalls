"use client";

import { cn } from "@/lib/utils";

export function TransitionBox({
  activationIndex,
  currentIndex,
  children,
  className,
}: {
  activationIndex: number;
  currentIndex: number;
  children: React.ReactNode;
  className?: string;
}) {
  const active = currentIndex === activationIndex;
  return (
    <div
      className={cn(
        "absolute inset-0 w-full min-w-0 transition-all will-change-all ease-out",
        active
          ? "translate-x-0"
          : activationIndex > currentIndex
            ? "translate-x-full opacity-0 h-0 overflow-hidden"
            : "-translate-x-full opacity-100",
        className
      )}
    >
      {children}
    </div>
  );
}