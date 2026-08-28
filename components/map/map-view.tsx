"use client";

import { useMemo } from "react";
import { Map as ReactMapGL, ViewState } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildStyle } from "@/lib/styles";
import { useMapProvider } from "@/components/providers/map-provider";
import { MapStyleConfig } from "@/lib/types";

export function MapView({ id, styles: stylesProp, viewState: viewStateProp }: { id?: string, styles?: Partial<MapStyleConfig>, viewState?: ViewState }) {
  const { styles: providerStyles, viewState: providerViewState, setViewState } = useMapProvider();

  const styles = stylesProp ?? providerStyles;
  const viewState = viewStateProp ?? providerViewState;

  const style = useMemo(() => buildStyle({ name: "Map", config: styles }), [styles]);

  return (
    <ReactMapGL
      id={id}
      mapStyle={style}
      initialViewState={viewState}
      onMove={(e) => setViewState(e.viewState)}
      style={{ width: "100%", height: "100%" }}
    />
  );
}