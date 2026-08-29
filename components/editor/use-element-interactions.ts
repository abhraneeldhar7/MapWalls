"use client";

import { useCallback, useRef } from "react";
import interact from "interactjs";
import type { EditorElement } from "@/components/providers/editor-provider";

const MIN_WIDTH = 40;
const MIN_HEIGHT = 24;

export function useElementInteractions({
  scale,
  updateElement,
  onDragStart,
}: {
  scale: number;
  updateElement: (id: string, patch: Partial<EditorElement>) => void;
  onDragStart: (id: string) => void;
}) {
  const optsRef = useRef({ scale, updateElement, onDragStart });
  optsRef.current = { scale, updateElement, onDragStart };

  return useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    const elId = node.dataset.elId!;
    let startX = 0;
    let startY = 0;
    let totalDx = 0;
    let totalDy = 0;
    let posterLeft = 0;
    let posterTop = 0;

    const i = interact(node)
      .draggable({
        inertia: false,
        listeners: {
          start() {
            startX = node.offsetLeft;
            startY = node.offsetTop;
            totalDx = 0;
            totalDy = 0;
            node.style.transition = "none";
            optsRef.current.onDragStart(elId);
          },
          move(e) {
            totalDx += e.dx;
            totalDy += e.dy;
            const s = optsRef.current.scale;
            optsRef.current.updateElement(elId, {
              x: startX + totalDx / s,
              y: startY + totalDy / s,
            });
          },
          end() {
            node.style.transition = "";
          },
        },
      })
      .resizable({
        invert: "reposition",
        edges: {
          top: ".el-handle-top",
          left: ".el-handle-left",
          bottom: ".el-handle-bottom",
          right: ".el-handle-right",
        },
        listeners: {
          start() {
            const poster = node.offsetParent as HTMLElement;
            const pr = poster.getBoundingClientRect();
            posterLeft = pr.left;
            posterTop = pr.top;
            node.style.transition = "none";
          },
          move(e) {
            const s = optsRef.current.scale;
            optsRef.current.updateElement(elId, {
              x: (e.rect.left - posterLeft) / s,
              y: (e.rect.top - posterTop) / s,
              width: Math.max(MIN_WIDTH, e.rect.width / s),
              height: Math.max(MIN_HEIGHT, e.rect.height / s),
            });
          },
          end() {
            node.style.transition = "";
          },
        },
      });

    return () => i.unset();
  }, []);
}