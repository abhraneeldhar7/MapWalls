"use client";

import { useCallback } from "react";
import interact from "interactjs";
import type { EditorElement } from "@/components/providers/editor-provider";

const MIN_WIDTH = 40;
const MIN_HEIGHT = 24;

export function useElementInteractions({
  scale,
  posterW,
  posterH,
  updateElement,
  onDragStart,
}: {
  scale: number;
  posterW: number;
  posterH: number;
  updateElement: (id: string, patch: Partial<EditorElement>) => void;
  onDragStart: (id: string) => void;
}) {
  return useCallback(
    (node: HTMLDivElement | null) => {
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
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: "parent",
              elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
            }),
          ],
          listeners: {
            start() {
              startX = node.offsetLeft;
              startY = node.offsetTop;
              totalDx = 0;
              totalDy = 0;
              node.style.transition = "none";
              onDragStart(elId);
            },
            move(e) {
              totalDx += e.dx;
              totalDy += e.dy;
              updateElement(elId, {
                x: startX + totalDx / scale,
                y: startY + totalDy / scale,
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
          modifiers: [
            interact.modifiers.restrictSize({
              min: { width: MIN_WIDTH * scale, height: MIN_HEIGHT * scale },
              max: { width: posterW * scale, height: posterH * scale },
            }),
          ],
          listeners: {
            start() {
              const poster = node.offsetParent as HTMLElement;
              const pr = poster.getBoundingClientRect();
              posterLeft = pr.left;
              posterTop = pr.top;
              node.style.transition = "none";
            },
            move(e) {
              updateElement(elId, {
                x: (e.rect.left - posterLeft) / scale,
                y: (e.rect.top - posterTop) / scale,
                width: e.rect.width / scale,
                height: e.rect.height / scale,
              });
            },
            end() {
              node.style.transition = "";
            },
          },
        });

      return () => i.unset();
    },
    [scale, posterW, posterH, updateElement, onDragStart]
  );
}