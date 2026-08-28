"use client";

import { useId, useMemo } from "react";
import { Map as ReactMapGL } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildStyle } from "@/lib/styles";
import { useMapProvider } from "@/components/providers/map-provider";
import type { ControlConfig } from "@/lib/controlPanelOptions";

type Entity = {
  label: string;
  controls: ControlConfig[];
};

function entityLayers(target: string | undefined): string[] {
  if (!target) return [];
  const base = target.replace(/\.show$/, "");
  if (base.startsWith("roads.")) return [`road-${base.slice(6)}`];
  if (base.startsWith("land.")) {
    const cls = base.slice(5);
    if (cls === "park") return ["park"];
    if (cls === "residential" || cls === "commercial" || cls === "industrial") return [`landuse-${cls}`];
    return [`landcover-${cls}`];
  }
  if (base === "water.ocean") return ["water-ocean"];
  if (base === "water.lake") return ["water-lake"];
  if (base === "water.river") return ["waterway-river"];
  if (base === "water.stream") return ["waterway-stream"];
  if (base === "borders.country") return ["boundary-country"];
  if (base === "borders.state") return ["boundary-state"];
  if (base.startsWith("labels.")) return [`label-${base.slice(7)}`];
  return [];
}

type BBox = [number, number, number, number];

function featureBBox(feature: { geometry?: unknown }): BBox | null {
  const geometry = feature.geometry as
    | { type?: string; coordinates?: unknown }
    | undefined;
  if (!geometry?.coordinates) return null;

  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  const visit = (coords: unknown) => {
    if (!Array.isArray(coords)) return;
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      const [lng, lat] = coords as [number, number];
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
    } else {
      coords.forEach(visit);
    }
  };

  visit(geometry.coordinates);
  return minLng === Infinity ? null : [minLng, minLat, maxLng, maxLat];
}

export function ClosestElementPreview({ entity }: { entity: Entity }) {
  const { styles, viewState } = useMapProvider();
  const style = useMemo(() => buildStyle({ name: "Map", config: styles }), [styles]);
  const layers = entityLayers(entity.controls[0]?.targets[0]);
  const id = useId();

  return (
    <div className="flex w-64 flex-col gap-1 overflow-hidden rounded-md border bg-card p-1.5 shadow-lg">
      <p className="text-center text-xs font-semibold opacity-80">{entity.label}</p>
      <div className="h-36 w-full overflow-hidden rounded-sm">
        <ReactMapGL
          id={id}
          mapStyle={style}
          initialViewState={viewState}
          interactive={false}
          attributionControl={false}
          style={{ width: "100%", height: "100%" }}
          onLoad={({ target }) => {
            if (layers.length === 0) return;
            const existing = new Set(target.getStyle().layers.map((l) => l.id));
            const validLayers = layers.filter((id) => existing.has(id));
            if (validLayers.length === 0) return;
            const features = target.queryRenderedFeatures(undefined, { layers: validLayers });
            let closest: BBox | null = null;
            let closestDist = Infinity;
            for (const feature of features) {
              const bbox = featureBBox(feature);
              if (!bbox) continue;
              const centerLng = (bbox[0] + bbox[2]) / 2;
              const centerLat = (bbox[1] + bbox[3]) / 2;
              const dist = Math.hypot(centerLng - viewState.longitude, centerLat - viewState.latitude);
              if (dist < closestDist) {
                closestDist = dist;
                closest = bbox;
              }
            }
            if (closest) {
              target.fitBounds(
                [
                  [closest[0], closest[1]],
                  [closest[2], closest[3]],
                ],
                { padding: 16 }
              );
            }
          }}
        />
      </div>
    </div>
  );
}