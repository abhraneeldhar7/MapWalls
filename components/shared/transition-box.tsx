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
        "transition-all overflow-hidden duration-slow min-w-0 w-full",
        active
          ? "opacity-100 max-h-[800px] h-full translate-x-[0%]"
          : currentIndex < activationIndex
            ? "translate-x-[-100%] opacity-0 h-0 max-h-0"
            : "translate-x-[100%] opacity-0 h-0 max-h-0",
        className
      )}
    >
      {children}
    </div>
  );
}
