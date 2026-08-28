"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { MapProvider as ReactMapGLProvider, type ViewState } from "react-map-gl/maplibre";
import { templates } from "@/lib/templates";
import type { MapStyleConfig } from "@/lib/types";

type MapContextValue = {
  defaultMapView: ViewState;
  styles: Partial<MapStyleConfig>;
  setStyles: (updater: (prev: Partial<MapStyleConfig>) => Partial<MapStyleConfig>) => void;
  viewState: ViewState;
  setViewState: (viewState: ViewState) => void;
};

const MapContext = createContext<MapContextValue | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const [styles, setStyles] = useState<Partial<MapStyleConfig>>(templates[0].config);
  const defaultMapView = {
    longitude: -122.4194,
    latitude: 37.7749,
    zoom: 11,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  }

  const [viewState, setViewState] = useState<ViewState>(defaultMapView);

  return (
    <MapContext.Provider value={{ styles, setStyles, viewState, setViewState, defaultMapView }}>
      <ReactMapGLProvider>
        {children}
      </ReactMapGLProvider>
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