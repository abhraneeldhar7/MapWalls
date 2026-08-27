import type { StyleSpecification } from "maplibre-gl";
import type { LabelField, MapStyleConfig, MapTemplate } from "./types";

export const BLANK_BASE: StyleSpecification = {
  version: 8,
  name: "Artografer",
  sources: {
    openmaptiles: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
    },
  },
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  layers: [],
};

const ROAD_CLASSES = [
  "motorway",
  "trunk",
  "primary",
  "secondary",
  "tertiary",
  "minor",
  "service",
  "path",
] as const;

type FieldBase = {
  show?: boolean;
  minZoom?: number;
  color?: string;
  opacity?: number;
  outline?: string;
  width?: number;
  blur?: number;
  dash?: number[];
  font?: string;
  size?: number;
  letterSpacing?: number;
  transform?: "none" | "uppercase" | "lowercase";
  allowOverlap?: boolean;
  haloColor?: string;
  haloWidth?: number;
  haloBlur?: number;
  classes?: string[];
  rank?: number;
};

type LayerDef = {
  path: string;
  id: string;
  sourceLayer: string;
  type: "fill" | "line" | "symbol";
  filter?: unknown;
  baseLayout?: Record<string, unknown>;
};

const LAYERS: LayerDef[] = [
  {
    path: "water.ocean",
    id: "water-ocean",
    sourceLayer: "water",
    type: "fill",
    filter: ["==", ["get", "class"], "ocean"],
  },
  {
    path: "water.lake",
    id: "water-lake",
    sourceLayer: "water",
    type: "fill",
    filter: ["!=", ["get", "class"], "ocean"],
  },
  { path: "borders.country",
    id: "boundary-country",
    sourceLayer: "boundary",
    type: "line",
    filter: ["==", ["get", "admin_level"], 2],
  },
  {
    path: "borders.state",
    id: "boundary-state",
    sourceLayer: "boundary",
    type: "line",
    filter: ["==", ["get", "admin_level"], 4],
  },
  {
    path: "water.river",
    id: "waterway-river",
    sourceLayer: "waterway",
    type: "line",
    filter: ["==", ["get", "class"], "river"],
  },
  {
    path: "water.stream",
    id: "waterway-stream",
    sourceLayer: "waterway",
    type: "line",
    filter: ["!=", ["get", "class"], "river"],
  },
  {
    path: "labels.river",
    id: "label-river",
    sourceLayer: "water_name",
    type: "symbol",
    filter: ["==", ["get", "class"], "river"],
    baseLayout: { "symbol-placement": "line", "text-size": 10 },
  },
  {
    path: "labels.lake",
    id: "label-lake",
    sourceLayer: "water_name",
    type: "symbol",
    filter: ["!=", ["get", "class"], "river"],
    baseLayout: { "text-size": 10 },
  },
  {
    path: "labels.road",
    id: "label-road",
    sourceLayer: "transportation_name",
    type: "symbol",
    baseLayout: { "symbol-placement": "line", "text-size": 10 },
  },
  {
    path: "labels.place",
    id: "label-place",
    sourceLayer: "place",
    type: "symbol",
    baseLayout: { "text-size": 12 },
  },
  {
    path: "labels.poi",
    id: "label-poi",
    sourceLayer: "poi",
    type: "symbol",
    baseLayout: { "text-size": 10 },
  },
];

function opacity01(opacity: number | undefined): number {
  return opacity === undefined ? 1 : opacity / 100;
}

function get(config: Partial<MapStyleConfig>, path: string): FieldBase | undefined {
  return path.split(".").reduce<FieldBase | undefined>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key] as FieldBase;
    return undefined;
  }, config as unknown as FieldBase);
}

function paintProps(type: LayerDef["type"], field: FieldBase): Record<string, unknown> {
  const paint: Record<string, unknown> = {};
  if (type === "fill") {
    if (field.color) paint["fill-color"] = field.color;
    if (field.opacity !== undefined) paint["fill-opacity"] = opacity01(field.opacity);
    if (field.outline) paint["fill-outline-color"] = field.outline;
  } else if (type === "line") {
    if (field.color) paint["line-color"] = field.color;
    if (field.width !== undefined) paint["line-width"] = field.width;
    if (field.opacity !== undefined) paint["line-opacity"] = opacity01(field.opacity);
    if (field.blur !== undefined) paint["line-blur"] = field.blur;
    if (field.dash) paint["line-dasharray"] = field.dash;
  } else {
    paint["text-color"] = field.color ?? "#111111";
    if (field.opacity !== undefined) paint["text-opacity"] = opacity01(field.opacity);
    if (field.haloColor) paint["text-halo-color"] = field.haloColor;
    if (field.haloWidth !== undefined) paint["text-halo-width"] = field.haloWidth;
    if (field.haloBlur !== undefined) paint["text-halo-blur"] = field.haloBlur;
  }
  return paint;
}

function labelLayout(field: FieldBase, base: Record<string, unknown>): Record<string, unknown> {
  const layout: Record<string, unknown> = {
    "text-field": ["get", "name"],
    "text-font": [field.font ?? "Noto Sans Regular"],
    ...base,
  };
  if (field.size !== undefined) layout["text-size"] = field.size;
  if (field.letterSpacing !== undefined) layout["text-letter-spacing"] = field.letterSpacing;
  if (field.transform) layout["text-transform"] = field.transform;
  if (field.allowOverlap !== undefined) layout["text-allow-overlap"] = field.allowOverlap;
  return layout;
}

function labelFilter(field: FieldBase, base?: unknown): unknown {
  const conditions: unknown[] = [];
  if (field.classes) conditions.push(["in", ["get", "class"], ["literal", field.classes]]);
  if (field.rank !== undefined) conditions.push(["<=", ["get", "rank"], field.rank]);
  if (base) conditions.push(base);
  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];
  return ["all", ...conditions];
}

export function buildStyle(template: MapTemplate): StyleSpecification {
  const layers: object[] = [];
  const c = template.config;

  if (c.background) {
    layers.push({
      id: "background",
      type: "background",
      paint: {
        ...(c.background.color ? { "background-color": c.background.color } : {}),
        ...(c.background.opacity !== undefined
          ? { "background-opacity": opacity01(c.background.opacity) }
          : {}),
      },
    });
  }

  if (c.land && c.land.show !== false) {
    const land = c.land;
    const classes = [
      ["landcover-forest", "landcover", "wood", land.forest],
      ["landcover-grass", "landcover", "grass", land.grass],
      ["landcover-sand", "landcover", "sand", land.sand],
      ["landcover-ice", "landcover", "ice", land.ice],
      ["landuse-residential", "landuse", "residential", land.residential],
      ["landuse-commercial", "landuse", "commercial", land.commercial],
      ["landuse-industrial", "landuse", "industrial", land.industrial],
    ] as const;
    for (const [id, sourceLayer, cls, field] of classes) {
      if (!field || field.show === false) continue;
      layers.push({
        id,
        type: "fill",
        source: "openmaptiles",
        "source-layer": sourceLayer,
        ...(field.minZoom !== undefined ? { minzoom: field.minZoom } : {}),
        filter: ["==", ["get", "class"], cls],
        paint: {
          ...(field.color ? { "fill-color": field.color } : {}),
          ...(field.opacity !== undefined
            ? { "fill-opacity": opacity01(field.opacity) }
            : {}),
        },
      });
    }
    if (land.park && land.park.show !== false) {
      const park = land.park;
      layers.push({
        id: "park",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "park",
        ...(park.minZoom !== undefined ? { minzoom: park.minZoom } : {}),
        paint: {
          ...(park.color ? { "fill-color": park.color } : {}),
          ...(park.opacity !== undefined ? { "fill-opacity": opacity01(park.opacity) } : {}),
        },
      });
    }
  }

  if (c.roads && c.roads.show !== false) {
    for (const cls of ROAD_CLASSES) {
      const field = c.roads[cls];
      if (!field || field.show === false) continue;
      layers.push({
        id: `road-${cls}`,
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        ...(field.minZoom !== undefined ? { minzoom: field.minZoom } : {}),
        filter: ["==", ["get", "class"], cls],
        layout: {
          "line-cap": c.roads.lineCap ?? "round",
          "line-join": c.roads.lineJoin ?? "round",
        },
        paint: paintProps("line", field),
      });
    }
  }

  if (c.buildings && c.buildings.show !== false) {
    const buildings = c.buildings;
    layers.push({
      id: "building",
      type: "fill-extrusion",
      source: "openmaptiles",
      "source-layer": "building",
      ...(buildings.minZoom !== undefined ? { minzoom: buildings.minZoom } : {}),
      paint: {
        ...(buildings.color ? { "fill-extrusion-color": buildings.color } : {}),
        ...(buildings.opacity !== undefined
          ? { "fill-extrusion-opacity": opacity01(buildings.opacity) }
          : {}),
        "fill-extrusion-height": [
          "*",
          ["get", "render_height"],
          buildings.height ?? 1,
        ],
        "fill-extrusion-base": [
          "*",
          ["get", "render_min_height"],
          buildings.base ?? 1,
        ],
        ...(buildings.verticalGradient !== undefined
          ? { "fill-extrusion-vertical-gradient": buildings.verticalGradient }
          : {}),
      },
    });
  }

  for (const def of LAYERS) {
    const field = get(c, def.path);
    if (!field || field.show === false) continue;
    const layer: Record<string, unknown> = {
      id: def.id,
      type: def.type,
      source: "openmaptiles",
      "source-layer": def.sourceLayer,
    };
    if (field.minZoom !== undefined) layer.minzoom = field.minZoom;
    const filter = def.type === "symbol" ? labelFilter(field, def.filter) : def.filter;
    if (filter) layer.filter = filter;
    if (def.type === "symbol") layer.layout = labelLayout(field, def.baseLayout ?? {});
    layer.paint = paintProps(def.type, field);
    layers.push(layer);
  }

  const style: StyleSpecification = {
    ...BLANK_BASE,
    layers: layers as StyleSpecification["layers"],
  };
  if (c.transition) style.transition = c.transition;
  if (c.light) style.light = c.light;
  return style;
}