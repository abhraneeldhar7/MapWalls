"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { DEFAULT_VALUES } from "./presets";
import type { StyleValues } from "./types";

type MapContextValue = {
  map: MapLibreMap | null;
  setMap: (map: MapLibreMap | null) => void;
  values: StyleValues;
  setValues: Dispatch<SetStateAction<StyleValues>>;
};

const MapContext = createContext<MapContextValue>({
  map: null,
  setMap: () => {},
  values: DEFAULT_VALUES,
  setValues: () => {},
});

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [values, setValues] = useState<StyleValues>(DEFAULT_VALUES);

  return (
    <MapContext.Provider value={{ map, setMap, values, setValues }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapInstance() {
  return useContext(MapContext);
}
