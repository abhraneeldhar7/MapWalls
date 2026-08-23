"use client";

import type { RefObject } from "react";
import { Map as ReactMapGL, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { OPENFREEMAP_DARK_STYLE } from "@/lib/api/services/endpoints";

type MapViewProps = {
  mapRef: RefObject<MapRef | null>;
};

export function MapView({ mapRef }: MapViewProps) {
  return (
    <ReactMapGL
      ref={mapRef}
      mapStyle={OPENFREEMAP_DARK_STYLE}
      initialViewState={{ longitude: 8, latitude: 25, zoom: 2 }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
