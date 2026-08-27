"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { templates } from "@/lib/templates";
import type { MapStyleConfig } from "@/lib/types";

type MapContextValue = {
  styles: Partial<MapStyleConfig>;
  setStyles: (updater: (prev: Partial<MapStyleConfig>) => Partial<MapStyleConfig>) => void;
};

const MapContext = createContext<MapContextValue | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const [styles, setStyles] = useState<Partial<MapStyleConfig>>(templates[0].config);

  return (
    <MapContext.Provider value={{ styles, setStyles }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapProvider() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapProvider must be used within a MapProvider");
  }
  return context;
}