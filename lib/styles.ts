import type { StyleSpecification } from "maplibre-gl";
import type { MapStyleConfig, MapTemplate } from "./types";
import { getPath } from "./utils";

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
  "track",
  "pedestrian",
  "street",
  "street_limited",
  "rail",
  "transit",
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

const DENSITY_STEP = 1.2;

function zoomFor(minZoom: number | undefined, density?: number): number {
  const base = minZoom ?? 5;
  const d = density ?? 5;
  return Math.max(0, Math.min(16, Math.round(base + (5 - d) * DENSITY_STEP)));
}

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
    path: "borders.county",
    id: "boundary-county",
    sourceLayer: "boundary",
    type: "line",
    filter: ["in", ["get", "admin_level"], ["literal", [5, 6]]],
  },
  {
    path: "borders.city",
    id: "boundary-city",
    sourceLayer: "boundary",
    type: "line",
    filter: ["in", ["get", "admin_level"], ["literal", [7, 8]]],
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
    sourceLayer: "waterway",
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

const ROAD_BASE_WIDTH: Record<string, [number, number]> = {
  motorway:  [1.2, 4],
  trunk:     [1.0, 3.5],
  primary:   [0.8, 3],
  secondary: [0.6, 2.5],
  tertiary:  [0.5, 2],
  minor:     [0.35, 1.5],
  service:   [0.25, 1],
  path:      [0.15, 0.6],
  track:     [0.15, 0.6],
  pedestrian: [0.3, 1.4],
  street:    [0.35, 1.5],
  street_limited: [0.35, 1.5],
  rail:      [0.2, 1],
  transit:   [0.2, 1],
};

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
      ["landcover-rock", "landcover", "rock", land.rock],
      ["landcover-wetland", "landcover", "wetland", land.wetland],
      ["landcover-farmland", "landcover", "farmland", land.farmland],
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
        minzoom: zoomFor(field.minZoom),
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
        minzoom: zoomFor(park.minZoom),
        paint: {
          ...(park.color ? { "fill-color": park.color } : {}),
          ...(park.opacity !== undefined ? { "fill-opacity": opacity01(park.opacity) } : {}),
        },
      });
    }
  }

  for (const def of LAYERS) {
    if (!def.path.startsWith("water.") || def.type === "symbol") continue;
    const field = getPath(c, def.path) as FieldBase | undefined;
    if (!field || field.show === false) continue;
    const waterDensity = c.water?.density;
    const layer: Record<string, unknown> = {
      id: def.id,
      type: def.type,
      source: "openmaptiles",
      "source-layer": def.sourceLayer,
      minzoom: zoomFor(field.minZoom, waterDensity),
    };
    if (def.filter) layer.filter = def.filter;
    layer.paint = paintProps(def.type, field);
    layers.push(layer);
  }

  if (c.buildings && c.buildings.show !== false) {
    const buildings = c.buildings;
    layers.push({
      id: "building",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "building",
      minzoom: 4,
      paint: {
        ...(buildings.color ? { "fill-color": buildings.color } : {}),
        ...(buildings.opacity !== undefined
          ? { "fill-opacity": opacity01(buildings.opacity) }
          : {}),
      },
    });
  }

  if (c.roads && c.roads.show !== false) {
    for (const cls of ROAD_CLASSES) {
      const field = c.roads[cls];
      if (!field || field.show === false) continue;
      const base = ROAD_BASE_WIDTH[cls] ?? [0.5, 2];
      const multiplier = field.width ?? 1;
      const brunnelFilters: unknown[] = [];
      if (c.roads.hideTunnels) brunnelFilters.push(["!=", ["get", "brunnel"], "tunnel"]);
      if (c.roads.hideBridges) brunnelFilters.push(["!=", ["get", "brunnel"], "bridge"]);
      const filter = brunnelFilters.length === 0
        ? ["==", ["get", "class"], cls]
        : ["all", ["==", ["get", "class"], cls], ...brunnelFilters];
      layers.push({
        id: `road-${cls}`,
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        minzoom: zoomFor(field.minZoom, c.roads.density),
        filter,
        layout: {
          "line-cap": c.roads.lineCap ?? "round",
          "line-join": c.roads.lineJoin ?? "round",
        },
        paint: {
          ...paintProps("line", field),
          "line-width": [
            "interpolate", ["linear"], ["zoom"],
            4, base[0] * multiplier * 0.5,
            14, base[0] * multiplier * 1.5,
            20, base[1] * multiplier,
          ],
        },
      });
    }
  }

  for (const def of LAYERS) {
    if (def.path.startsWith("water.") && def.type !== "symbol") continue;
    const field = getPath(c, def.path) as FieldBase | undefined;
    if (!field || field.show === false) continue;
    const waterDensity = def.path.startsWith("water.") ? c.water?.density : undefined;
    const minzoom = def.path.startsWith("borders.") ? 0 : zoomFor(field.minZoom, waterDensity);
    const layer: Record<string, unknown> = {
      id: def.id,
      type: def.type,
      source: "openmaptiles",
      "source-layer": def.sourceLayer,
      minzoom,
    };
    let filter = def.type === "symbol" ? labelFilter(field, def.filter) : def.filter;
    if (def.path.startsWith("borders.")) {
      const b = c.borders;
      const extra: unknown[] = [];
      if (b?.showMaritime === false) extra.push(["!=", ["get", "maritime"], 1]);
      if (b?.showDisputed === false) extra.push(["!=", ["get", "disputed"], 1]);
      if (extra.length > 0) filter = ["all", ...(filter ? [filter] : []), ...extra];
    }
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