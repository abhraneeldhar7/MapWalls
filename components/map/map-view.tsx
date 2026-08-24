"use client";

import { useMemo } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { Map as ReactMapGL } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildStyle } from "@/lib/map-style/presets";
import { useMapInstance } from "@/lib/map-style/context";

export function MapView() {
  const { setMap, values } = useMapInstance();
  const style = useMemo(() => buildStyle(values), [values]);

  function handleLoad(event: { target: MapLibreMap }) {
    setMap(event.target);
  }

  return (
    <ReactMapGL
      mapStyle={style}
      onLoad={handleLoad}
      initialViewState={{ longitude: -122.4194, latitude: 37.7749, zoom: 11 }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
