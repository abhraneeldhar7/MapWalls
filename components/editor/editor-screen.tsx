"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/map/map-view";
import { useEditor, type EditorElement } from "@/components/providers/editor-provider";
import { useMapProvider } from "@/components/providers/map-provider";
import { useElementInteractions } from "@/components/editor/use-element-interactions";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const MIN_SCALE = 0.1;
const MAX_SCALE = 5;

function MapLocateDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="h-[min(80vh,80vw)] w-[min(90vw,70vh)] grid-rows-[auto_1fr] gap-0 p-0">
        <DialogTitle className="sr-only">Change location</DialogTitle>
        <div className="flex items-center justify-center p-2">
          <Button variant="default" size="sm" onClick={() => onOpenChange(false)}>Save</Button>
        </div>
        {open && (
          <div className="h-full w-full min-h-0">
            <MapView id="editor-locate-map" interactive attributionControl={false} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ResizeHandles() {
  return (
    <>
      {/* corner */}
      <div className="absolute z-10 -top-2.5 -left-2.5 bg-primary size-4 cursor-nw-resize el-handle el-handle-top el-handle-left" />
      <div className="absolute z-10 -top-2.5 -right-2.5 bg-primary size-4 cursor-ne-resize el-handle el-handle-top el-handle-right" />
      <div className="absolute z-10 -bottom-2.5 -right-2.5 size-4 bg-primary cursor-se-resize el-handle el-handle-bottom el-handle-right" />
      <div className="absolute z-10 -bottom-2.5 -left-2.5 bg-primary size-4 cursor-sw-resize el-handle el-handle-bottom el-handle-left" />

      {/* edges */}
      <div className="absolute z-10 -top-5 left-1/2 -translate-x-1/2 w-16 h-2 rounded-xs bg-primary cursor-n-resize el-handle el-handle-top" />
      <div className="absolute z-10 top-1/2 -right-5 -translate-y-1/2 bg-primary w-2 h-16 rounded-xs cursor-e-resize el-handle el-handle-right" />
      <div className="absolute z-10 -bottom-5 left-1/2 -translate-x-1/2 w-16 h-2 rounded-xs bg-primary cursor-s-resize el-handle el-handle-bottom" />
      <div className="absolute z-10 top-1/2 -left-5 -translate-y-1/2 bg-primary w-2 h-16 rounded-xs cursor-w-resize el-handle el-handle-left" />
    </>
  );
}

function CanvasElement({ el, ref, children }: {
  el: EditorElement;
  ref: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}) {
  const { focusedElement, setFocusedElement } = useEditor();
  const focused = focusedElement === el.id;

  return (
    <div
      ref={ref}
      data-el-id={el.id}
      className={cn(
        "absolute touch-none cursor-move transition-all duration-fast",
        focused ? "border-primary border-3 shadow-md" : "border-transparent border-1 hover:border-primary/80 hover:shadow-sm"
      )}
      style={{ left: el.x, top: el.y, width: el.width, height: el.height }}
      onClick={(e) => {
        e.stopPropagation();
        setFocusedElement(el.id);
      }}
    >
      {children}
      {focused && <ResizeHandles />}
    </div>
  );
}

export function EditorScreen() {
  const { focusedElement, setFocusedElement, elements, updateElement } = useEditor();
  const { viewState } = useMapProvider();
  const [locateOpen, setLocateOpen] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0, scale: 1 });
  const workspaceRef = useRef<HTMLDivElement>(null);

  const canvasEl = elements.find((el) => el.type === "canvas");
  const posterW = canvasEl?.width ?? 900;
  const posterH = canvasEl?.height ?? 1600;
  const mapEl = elements.find((el) => el.type === "map");

  const register = useElementInteractions({
    scale: pan.scale,
    posterW,
    posterH,
    updateElement,
    onDragStart: setFocusedElement,
  });

  useEffect(() => {
    const ws = workspaceRef.current;
    if (!ws) return;
    const s = Math.min(ws.clientWidth / posterW, ws.clientHeight / posterH, 1);
    setPan({ x: (ws.clientWidth / 2) * (1 - s), y: (ws.clientHeight / 2) * (1 - s), scale: s });
  }, [posterW, posterH]);

  useEffect(() => {
    const ws = workspaceRef.current;
    if (!ws) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = ws.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      setPan((v) => {
        if (e.ctrlKey || e.metaKey) {
          const factor = Math.exp(-e.deltaY * 0.0015);
          const next = Math.min(Math.max(v.scale * factor, MIN_SCALE), MAX_SCALE);
          const r = next / v.scale;
          return { x: mx - (mx - v.x) * r, y: my - (my - v.y) * r, scale: next };
        }
        return { x: v.x - e.deltaX, y: v.y - e.deltaY, scale: v.scale };
      });
    };

    ws.addEventListener("wheel", onWheel, { passive: false });
    return () => ws.removeEventListener("wheel", onWheel);
  }, []);

  const locateBtnPos = mapEl && focusedElement === mapEl.id
    ? (() => {
      const ws = workspaceRef.current;
      if (!ws) return null;
      const rect = ws.getBoundingClientRect();
      return {
        left: rect.left + rect.width / 2 + (mapEl.x + mapEl.width / 2 - posterW / 2) * pan.scale,
        top: rect.top + rect.height / 2 + (mapEl.y - posterH / 2) * pan.scale,
      };
    })()
    : null;

  return (
    <div
      ref={workspaceRef}
      className="absolute inset-0 overflow-hidden bg-[#1a1a1a]"
      onClick={() => setFocusedElement(null)}
    >
      <div
        className="h-full w-full"
        style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${pan.scale})`, transformOrigin: "0 0" }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="relative shrink-0 shadow-2xl ring-1 ring-white/10"
            style={{ width: posterW, height: posterH, backgroundColor: canvasEl?.color ?? "#ffffff" }}
          >
            {elements
              .filter((el) => el.type !== "canvas")
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((el) => (
                <CanvasElement key={el.id} el={el} ref={register}>
                  {el.type === "map" && (
                    <div className="h-full w-full pointer-events-none">
                      <MapView
                        id="editor-canvas-map"
                        interactive={false}
                        attributionControl={false}
                        viewState={{ ...viewState, width: el.width, height: el.height }}
                      />
                    </div>
                  )}
                  {el.type === "text" && (
                    <p className="w-full h-full flex items-center justify-center text-2xl font-bold select-none pointer-events-none">
                      {el.content}
                    </p>
                  )}
                </CanvasElement>
              ))}
          </div>
        </div>
      </div>

      {locateBtnPos && (
        <div
          className="absolute z-10"
          style={{ left: locateBtnPos.left, top: locateBtnPos.top, transform: "translate(-50%, calc(-100% - 8px))" }}
        >
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setLocateOpen(true);
            }}
          >
            Change location
          </Button>
        </div>
      )}

      <MapLocateDialog open={locateOpen} onOpenChange={setLocateOpen} />
    </div>
  );
}