"use client";

import { useMemo } from "react";
import { Map as ReactMapGL } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildStyle } from "@/lib/styles";
import { useMapProvider } from "@/components/providers/map-provider";

export function MapView() {
  const { styles, viewState, setViewState } = useMapProvider();
  const style = useMemo(() => buildStyle({ name: "Map", config: styles }), [styles]);

  return (
    <ReactMapGL
      mapStyle={style}
      initialViewState={viewState}
      onMove={(e) => setViewState(e.viewState)}
      style={{ width: "100%", height: "100%" }}
    />
  );
}