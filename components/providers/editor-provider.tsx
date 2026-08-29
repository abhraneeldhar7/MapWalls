"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type EditorState = "view" | "editor";

export type EditorElement = {
  id: string;
  type: "canvas" | "map" | "text";
  name: string;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  content?: string;
};

export const defaultElements: EditorElement[] = [
  {
    id: "canvas",
    type: "canvas",
    name: "Canvas",
    zIndex: 0,
    x: 0,
    y: 0,
    width: 900,
    height: 1600,
    color: "#ffffff",
  },
  {
    id: "map-1",
    type: "map",
    name: "Map",
    zIndex: 1,
    x: 75,
    y: 330,
    width: 750,
    height: 940,
  },
  {
    id: "text-1",
    type: "text",
    name: "Title",
    zIndex: 2,
    x: 350,
    y: 180,
    width: 200,
    height: 50,
    content: "Title",
  },
];

type EditorContextValue = {
  editorState: EditorState;
  setEditorState: (s: EditorState) => void;
  elements: EditorElement[];
  canvas: EditorElement;
  mapElement: EditorElement | null;
  focusedElement: string | null;
  setFocusedElement: (id: string | null) => void;
  updateElement: (id: string, patch: Partial<EditorElement>) => void;
  addElement: (el: EditorElement) => void;
};

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [editorState, setEditorState] = useState<EditorState>("editor");
  const [elements, setElements] = useState<EditorElement[]>(defaultElements);
  const [focusedElement, setFocusedElement] = useState<string | null>(null);

  const updateElement = useCallback((id: string, patch: Partial<EditorElement>) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...patch } : el)));
  }, []);

  const addElement = useCallback((el: EditorElement) => {
    setElements((prev) => [...prev, el]);
  }, []);

  const canvas = elements.find((el) => el.type === "canvas") ?? defaultElements[0];
  const mapElement = elements.find((el) => el.type === "map") ?? null;

  return (
    <EditorContext.Provider
      value={{ editorState, setEditorState, elements, canvas, mapElement, focusedElement, setFocusedElement, updateElement, addElement }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
}