import type { ControlConfig } from "./controlPanelOptions";

export type AspectOption = { label: string; value: string; width: number; height: number };

export const ASPECT_OPTIONS: AspectOption[] = [
  { label: "1:1", value: "1:1", width: 1, height: 1 },
  { label: "4:5", value: "4:5", width: 4, height: 5 },
  { label: "3:4", value: "3:4", width: 3, height: 4 },
  { label: "9:16", value: "9:16", width: 9, height: 16 },
  { label: "16:9", value: "16:9", width: 16, height: 9 },
  { label: "4:3", value: "4:3", width: 4, height: 3 },
];

export const canvasControls: ControlConfig[] = [
  { label: "Aspect ratio", type: "options", targets: ["canvas.aspectRatio"], defaultValue: "9:16", options: ASPECT_OPTIONS },
  { label: "Color", type: "color", targets: ["canvas.color"] },
];

export const mapAspectControls: ControlConfig[] = [
  { label: "Aspect ratio", type: "options", targets: ["map.aspectRatio"], defaultValue: "4:5", options: ASPECT_OPTIONS },
];

export function getAspectValue(el: { width: number; height: number }): string {
  if (!el.width || !el.height) return ASPECT_OPTIONS[0].value;
  const ratio = el.width / el.height;
  let best = ASPECT_OPTIONS[0];
  let bestDiff = Infinity;
  for (const o of ASPECT_OPTIONS) {
    const d = Math.abs(o.width / o.height - ratio);
    if (d < bestDiff) {
      bestDiff = d;
      best = o;
    }
  }
  return best.value;
}

export function applyAspectRatio(el: { x: number; y: number; width: number; height: number }, value: string) {
  const opt = ASPECT_OPTIONS.find((o) => o.value === value);
  if (!opt) return el;
  const area = el.width * el.height;
  const newW = Math.round(Math.sqrt(area * (opt.width / opt.height)));
  const newH = Math.round(Math.sqrt(area / (opt.width / opt.height)));
  return {
    x: Math.round(el.x + el.width / 2 - newW / 2),
    y: Math.round(el.y + el.height / 2 - newH / 2),
    width: newW,
    height: newH,
  };
}