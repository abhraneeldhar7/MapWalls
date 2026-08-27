"use client";

import { useMemo } from "react";
import { Map as ReactMapGL } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildStyle } from "@/lib/styles";
import { useMapProvider } from "@/components/providers/map-provider";

export function MapView() {
  const { styles } = useMapProvider();
  const style = useMemo(() => buildStyle({ name: "Map", config: styles }), [styles]);

  return (
    <ReactMapGL
      mapStyle={style}
      initialViewState={{ longitude: -122.4194, latitude: 37.7749, zoom: 11 }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}