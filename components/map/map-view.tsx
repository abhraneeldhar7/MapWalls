"use client";

import { useMemo } from "react";
import { Map as ReactMapGL, type ViewState } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildStyle } from "@/lib/styles";
import { useMapProvider } from "@/components/providers/map-provider";
import type { MapStyleConfig } from "@/lib/types";

type ControlledViewState = ViewState & { width: number; height: number };

export function MapView({ id, styles: stylesProp, viewState: viewStateProp, interactive = true, attributionControl = true }: {
  id?: string,
  styles?: Partial<MapStyleConfig>,
  viewState?: ControlledViewState,
  interactive?: boolean,
  attributionControl?: boolean,
}) {
  const { styles: providerStyles, viewState: providerViewState, setViewState } = useMapProvider();

  const styles = stylesProp ?? providerStyles;

  const style = useMemo(() => buildStyle({ name: "Map", config: styles }), [styles]);

  return (
    <ReactMapGL
      id={id}
      interactive={interactive}
      attributionControl={attributionControl ? undefined : false}
      mapStyle={style}
      {...(viewStateProp ? { viewState: viewStateProp } : { initialViewState: providerViewState })}
      onMove={(e) => {
        if (!interactive) return;
        const { width: _width, height: _height, ...viewState } = e.viewState as ViewState & { width: number; height: number };
        setViewState(viewState);
      }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
