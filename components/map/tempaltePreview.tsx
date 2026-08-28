"use client"
import { useId, useMemo } from "react";
import { Map as ReactMapGL } from "react-map-gl/maplibre";
import { useMapProvider } from "../providers/map-provider";
import { buildStyle } from "@/lib/styles";
import type { MapStyleConfig } from "@/lib/types";

export default function TemplatePreview({ styles }: { styles: Partial<MapStyleConfig> }) {
    const { viewState } = useMapProvider();
    const id = useId();
    const style = useMemo(() => buildStyle({ name: "Template Preview", config: styles }), [styles]);
    return (
        <ReactMapGL
            id={id}
            mapStyle={style}
            initialViewState={{
                ...viewState,
                zoom: 10
            }}
            interactive={false}
            attributionControl={false}
            style={{ width: "100%", height: "100%" }} />
    )
}
