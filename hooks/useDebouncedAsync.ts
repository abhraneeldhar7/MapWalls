"use client";

import { useEffect, useRef, useState } from "react";

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export function useDebouncedAsync<T>(
  value: string,
  run: (value: string) => Promise<T>,
  delay = 400,
  skip?: (value: string) => boolean,
) {
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [data, setData] = useState<T | null>(null);
  const [debouncedValue, setDebouncedValue] = useState("");
  const runRef = useRef(run);
  const skipRef = useRef(skip);
  runRef.current = run;
  skipRef.current = skip;

  useEffect(() => {
    const trimmed = value.trim();
    if (skipRef.current?.(trimmed)) {
      setStatus("idle");
      setData(null);
      setDebouncedValue(trimmed);
      return;
    }
    setStatus("loading");
    let cancelled = false;
    const timer = setTimeout(async () => {
      setDebouncedValue(trimmed);
      try {
        const result = await runRef.current(trimmed);
        if (!cancelled) { setData(result); setStatus("success"); }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }, delay);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [value, delay]);

  return { status, data, debouncedValue };
}
