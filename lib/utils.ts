import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPath(obj: object, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key]
    return undefined
  }, obj)
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function setPaths<T extends object>(obj: T, paths: string[], value: unknown): T {
  const next = structuredClone(obj)
  for (const path of paths) {
    const keys = path.split(".")
    let target = next as Record<string, unknown>
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      if (!target[key] || typeof target[key] !== "object") target[key] = {}
      target = target[key] as Record<string, unknown>
    }
    target[keys[keys.length - 1]] = value
  }
  return next
}