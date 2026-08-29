"use client";

import { useCallback, useRef } from "react";
import interact from "interactjs";

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;

type PanState = { x: number; y: number; scale: number };

type GestureEvent = {
  touches: Array<{ clientX: number; clientY: number }>;
  distance: number;
  scale: number;
};

type GestureOptions = {
  listeners: {
    start: (e: GestureEvent) => void;
    move: (e: GestureEvent) => void;
  };
};

export function useWorkspaceInteractions({
  panRef,
  setPan,
}: {
  panRef: React.RefObject<PanState>;
  setPan: (updater: (prev: PanState) => PanState) => void;
}) {
  const optsRef = useRef({ panRef, setPan });
  optsRef.current = { panRef, setPan };

  return useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    let startDist = 1;
    let startScale = 1;
    let startX = 0;
    let startY = 0;
    let startFx = 0;
    let startFy = 0;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = node.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      optsRef.current.setPan((v) => {
        const factor = Math.exp(-e.deltaY * 0.0015);
        const next = Math.min(Math.max(v.scale * factor, MIN_SCALE), MAX_SCALE);
        const r = next / v.scale;
        return { x: mx - (mx - v.x) * r, y: my - (my - v.y) * r, scale: next };
      });
    };

    const interactable = interact(node) as ReturnType<typeof interact> & {
      gesturable: (options: GestureOptions) => ReturnType<typeof interact>;
    };

    interactable.draggable({
      listeners: {
        move(e) {
          optsRef.current.setPan((v) => ({ ...v, x: v.x + e.dx, y: v.y + e.dy }));
        },
      },
    });

    interactable.gesturable({
      listeners: {
        start(e) {
          const a = e.touches[0];
          const b = e.touches[1];
          if (!a || !b) return;
          const rect = node.getBoundingClientRect();
          startFx = (a.clientX + b.clientX) / 2 - rect.left;
          startFy = (a.clientY + b.clientY) / 2 - rect.top;
          startDist = Math.max(e.distance, 1);
          startScale = optsRef.current.panRef.current.scale;
          startX = optsRef.current.panRef.current.x;
          startY = optsRef.current.panRef.current.y;
        },
        move(e) {
          optsRef.current.setPan((v) => {
            const next = Math.min(Math.max(startScale * (e.distance / startDist), MIN_SCALE), MAX_SCALE);
            const r = next / startScale;
            return { x: startFx - (startFx - startX) * r, y: startFy - (startFy - startY) * r, scale: next };
          });
        },
      },
    });

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      interactable.unset();
      node.removeEventListener("wheel", onWheel);
    };
  }, []);
}