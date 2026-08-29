"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ViewState } from "react-map-gl/maplibre";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/map/map-view";
import { useEditor, type EditorElement } from "@/components/providers/editor-provider";
import { useMapProvider } from "@/components/providers/map-provider";
import { useElementInteractions } from "@/components/editor/use-element-interactions";
import { useWorkspaceInteractions } from "@/components/editor/use-workspace-interactions";
import { cn } from "@/lib/utils";

function MapFit({ width, height, className, children }: {
  width: number;
  height: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setScale(Math.min(el.clientWidth / width, el.clientHeight / height, 1));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height]);

  return (
    <div ref={ref} className={cn("flex h-full w-full min-h-0 items-center justify-center overflow-hidden", className)}>
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: "center center" }}>
        {children}
      </div>
    </div>
  );
}

function LocateOverlay({ onClose, width, height, viewState }: {
  onClose: () => void;
  width: number;
  height: number;
  viewState: ViewState;
}) {
  const { setViewState } = useMapProvider();
  const [localView, setLocalView] = useState(viewState);

  const save = () => {
    setViewState(localView);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 sm:p-[30px]">
      <Button
        variant="default"
        size="sm"
        className="absolute top-4 right-4 z-10"
        onClick={save}
      >
        Save
      </Button>
      <MapFit width={width} height={height} className="max-w-[600px]">
        <MapView
          id="editor-locate-map"
          interactive
          attributionControl={false}
          initialViewState={viewState}
          onViewChange={setLocalView}
        />
      </MapFit>
    </div>
  );
}

function overflowRects(el: { x: number; y: number; width: number; height: number }, cw: number, ch: number) {
  const left = Math.max(0, -el.x);
  const top = Math.max(0, -el.y);
  const right = Math.min(el.width, cw - el.x);
  const bottom = Math.min(el.height, ch - el.y);
  const iw = right - left;
  const ih = bottom - top;
  if (iw <= 0 || ih <= 0) return [{ x: 0, y: 0, w: el.width, h: el.height }];
  const rects: { x: number; y: number; w: number; h: number }[] = [];
  if (top > 0) rects.push({ x: 0, y: 0, w: el.width, h: top });
  if (bottom < el.height) rects.push({ x: 0, y: bottom, w: el.width, h: el.height - bottom });
  if (left > 0) rects.push({ x: 0, y: top, w: left, h: ih });
  if (right < el.width) rects.push({ x: right, y: top, w: el.width - right, h: ih });
  return rects;
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

function CanvasElement({ el, ref, posterW, posterH, children }: {
  el: EditorElement;
  ref: React.Ref<HTMLDivElement>;
  posterW: number;
  posterH: number;
  children: React.ReactNode;
}) {
  const { focusedElement, setFocusedElement } = useEditor();
  const focused = focusedElement === el.id;
  const overflow = overflowRects(el, posterW, posterH);

  return (
    <div
      ref={focused ? ref : undefined}
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
      <div className="absolute inset-0">{children}</div>
      {overflow.map((r, i) => (
        <div
          key={i}
          className="absolute pointer-events-none bg-[#1a1a1a]/50"
          style={{ left: r.x, top: r.y, width: r.w, height: r.h }}
        />
      ))}
      {focused && <ResizeHandles />}
    </div>
  );
}

export function EditorScreen() {
  const { focusedElement, setFocusedElement, elements, updateElement, canvas, mapElement } = useEditor();
  const { viewState } = useMapProvider();
  const [locateOpen, setLocateOpen] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0, scale: 1 });
  const panRef = useRef(pan);
  panRef.current = pan;
  const workspaceRef = useRef<HTMLDivElement>(null);

  const posterW = canvas.width;
  const posterH = canvas.height;

  const register = useElementInteractions({ scale: pan.scale, updateElement, onDragStart: setFocusedElement });
  const registerWorkspace = useWorkspaceInteractions({ panRef, setPan });

  const workspaceRefCb = useCallback(
    (node: HTMLDivElement | null) => {
      workspaceRef.current = node;
      registerWorkspace(node);
    },
    [registerWorkspace]
  );

  useEffect(() => {
    const ws = workspaceRef.current;
    if (!ws) return;
    const m = window.innerWidth >= 768 ? 50 : 20;
    const availW = Math.max(ws.clientWidth - m * 2, 0);
    const availH = Math.max(ws.clientHeight - m * 2, 0);
    const s = Math.min(availW / posterW, availH / posterH, 1);
    setPan({ x: (ws.clientWidth / 2) * (1 - s), y: (ws.clientHeight / 2) * (1 - s), scale: s });
  }, [posterW, posterH]);

  const locateBtnPos = mapElement && focusedElement === mapElement.id
    ? (() => {
        const ws = workspaceRef.current;
        if (!ws) return null;
        const rect = ws.getBoundingClientRect();
        return {
          left: rect.left + rect.width / 2 + (mapElement.x + mapElement.width / 2 - posterW / 2) * pan.scale,
          top: rect.top + rect.height / 2 + (mapElement.y - posterH / 2) * pan.scale,
        };
      })()
    : null;

  return (
    <>
      <div
        ref={workspaceRefCb}
        className="absolute inset-0 overflow-hidden bg-[#1a1a1a] touch-none"
        onClick={() => setFocusedElement(null)}
      >
        <div
          className="h-full w-full"
          style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${pan.scale})`, transformOrigin: "0 0" }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <div
              className="relative shrink-0 shadow-2xl ring-1 ring-white/10"
              style={{ width: posterW, height: posterH, backgroundColor: canvas.color }}
            >
              {elements
                .filter((el) => el.type !== "canvas")
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((el) => (
                  <CanvasElement key={el.id} el={el} ref={register} posterW={posterW} posterH={posterH}>
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
      </div>

      {locateOpen && mapElement && (
        <LocateOverlay
          onClose={() => setLocateOpen(false)}
          width={mapElement.width}
          height={mapElement.height}
          viewState={viewState}
        />
      )}
    </>
  );
}