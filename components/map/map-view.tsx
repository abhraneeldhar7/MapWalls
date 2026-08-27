"use client";

import { Map as ReactMapGL } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildStyle } from "@/lib/styles";
import { templates } from "@/lib/templates";

export function MapView() {
  const style = buildStyle(templates[0]);

  return (
    <ReactMapGL
      mapStyle={style}
      initialViewState={{ longitude: -122.4194, latitude: 37.7749, zoom: 11 }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
