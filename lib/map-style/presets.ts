import type { StyleSpecification } from "maplibre-gl";
import { BASE_STYLE } from "./base";
import type { StyleValues } from "./types";

export const DEFAULT_VALUES: StyleValues = {
  landBackground: "#f7f4ef",
  landForest: "#f7f4ef",
  landGrass: "#f7f4ef",
  landSand: "#f7f4ef",
  landSnow: "#f7f4ef",
  landParks: "#f7f4ef",
  landResidential: "#f7f4ef",

  waterOceanShow: true,
  waterOcean: "#ffffff",
  waterLakesShow: true,
  waterLakes: "#ffffff",
  waterRiversShow: true,
  waterRivers: "#ffffff",
  waterStreamsShow: true,
  waterStreams: "#ffffff",
  waterwayDensity: 3,

  roadsShow: true,
  roadsColor: "#111111",
  roadsDensity: 3,
  roadsWidth: 1,
  roadsClarity: 1,
  roadsMotorwayShow: true,
  roadsMotorway: "#111111",
  roadsTrunkShow: true,
  roadsTrunk: "#111111",
  roadsPrimaryShow: true,
  roadsPrimary: "#111111",
  roadsSecondaryShow: true,
  roadsSecondary: "#111111",
  roadsTertiaryShow: true,
  roadsTertiary: "#111111",
  roadsMinorShow: true,
  roadsMinor: "#111111",
  roadsServiceShow: true,
  roadsService: "#111111",
  roadsPathsShow: true,
  roadsPaths: "#111111",

  buildingsShow: false,
  buildingsColor: "#111111",
  buildingsOutline: "#111111",
  buildingsOpacity: 1,
  buildingsDensity: 3,

  bordersShow: false,
  bordersColor: "#111111",
  bordersWidth: 1,

  labelsPlaceNames: false,
  labelsRoadNames: false,
  labelsRiverNames: false,
  labelsLakeNames: false,
  labelsPois: false,
};

type RoadClass = {
  key: keyof StyleValues;
  showKey: keyof StyleValues;
  class: string;
  minZoom: number;
  widths: [number, number][];
};

const ROAD_CLASSES: RoadClass[] = [
  {
    key: "roadsMotorway",
    showKey: "roadsMotorwayShow",
    class: "motorway",
    minZoom: 5,
    widths: [[5, 0.5], [8, 0.8], [10, 1.2], [13, 1.8], [16, 2.8], [20, 6]],
  },
  {
    key: "roadsTrunk",
    showKey: "roadsTrunkShow",
    class: "trunk",
    minZoom: 6,
    widths: [[6, 0.4], [9, 0.7], [12, 1.1], [15, 2], [20, 5]],
  },
  {
    key: "roadsPrimary",
    showKey: "roadsPrimaryShow",
    class: "primary",
    minZoom: 7,
    widths: [[7, 0.4], [10, 0.7], [13, 1.2], [16, 2.2], [20, 5]],
  },
  {
    key: "roadsSecondary",
    showKey: "roadsSecondaryShow",
    class: "secondary",
    minZoom: 8,
    widths: [[9, 0.35], [11, 0.6], [14, 1.2], [17, 2.4], [20, 4.5]],
  },
  {
    key: "roadsTertiary",
    showKey: "roadsTertiaryShow",
    class: "tertiary",
    minZoom: 9,
    widths: [[10, 0.35], [12, 0.6], [15, 1.2], [17, 2.2], [20, 4]],
  },
  {
    key: "roadsMinor",
    showKey: "roadsMinorShow",
    class: "minor",
    minZoom: 11,
    widths: [[12, 0.3], [14, 0.6], [16, 1.2], [18, 2.2], [20, 3.5]],
  },
  {
    key: "roadsService",
    showKey: "roadsServiceShow",
    class: "service",
    minZoom: 12,
    widths: [[13, 0.25], [15, 0.5], [17, 1], [20, 2.5]],
  },
  {
    key: "roadsPaths",
    showKey: "roadsPathsShow",
    class: "path",
    minZoom: 13,
    widths: [[14, 0.2], [16, 0.5], [18, 1], [20, 2]],
  },
];

function roadWidthExpr(
  widths: [number, number][],
  clarity: number,
  multiplier: number,
) {
  const mean = widths.reduce((sum, [, w]) => sum + w, 0) / widths.length;
  const expr: unknown[] = ["interpolate", ["linear"], ["zoom"]];
  for (const [zoom, width] of widths) {
    expr.push(zoom, mean * Math.pow(width / mean, clarity) * multiplier);
  }
  return expr;
}

function labelPaint(values: StyleValues) {
  return {
    "text-color": "#111111",
    "text-halo-color": values.landBackground,
    "text-halo-width": 1,
  };
}

export function buildStyle(values: StyleValues): StyleSpecification {
  const layers: object[] = [];

  layers.push({
    id: "background",
    type: "background",
    paint: { "background-color": values.landBackground },
  });

  layers.push(
    {
      id: "landcover-wood",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      filter: ["==", ["get", "class"], "wood"],
      paint: { "fill-color": values.landForest },
    },
    {
      id: "landcover-grass",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      filter: ["==", ["get", "class"], "grass"],
      paint: { "fill-color": values.landGrass },
    },
    {
      id: "landcover-sand",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      filter: ["==", ["get", "class"], "sand"],
      paint: { "fill-color": values.landSand },
    },
    {
      id: "landcover-ice",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      filter: ["==", ["get", "class"], "ice"],
      paint: { "fill-color": values.landSnow },
    },
    {
      id: "park",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "park",
      paint: { "fill-color": values.landParks },
    },
    {
      id: "landuse-residential",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landuse",
      filter: ["==", ["get", "class"], "residential"],
      paint: { "fill-color": values.landResidential },
    },
  );

  if (values.waterOceanShow) {
    layers.push({
      id: "water-ocean",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      filter: ["==", ["get", "class"], "ocean"],
      paint: { "fill-color": values.waterOcean },
    });
  }

  if (values.waterLakesShow) {
    layers.push({
      id: "water-lakes",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      filter: ["!=", ["get", "class"], "ocean"],
      paint: { "fill-color": values.waterLakes },
    });
  }

  if (values.waterRiversShow) {
    layers.push({
      id: "waterway-rivers",
      type: "line",
      source: "openmaptiles",
      "source-layer": "waterway",
      filter: ["==", ["get", "class"], "river"],
      paint: {
        "line-color": values.waterRivers,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          0.3,
          12,
          0.8,
          16,
          2,
          20,
          4,
        ],
      },
    });
  }

  if (values.waterStreamsShow && values.waterwayDensity > 0) {
    layers.push({
      id: "waterway-streams",
      type: "line",
      source: "openmaptiles",
      "source-layer": "waterway",
      filter: ["!=", ["get", "class"], "river"],
      minzoom: Math.max(0, 12 - (values.waterwayDensity - 3)),
      paint: {
        "line-color": values.waterStreams,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10,
          0.25,
          14,
          0.5,
          18,
          1.2,
        ],
      },
    });
  }

  if (values.buildingsShow && values.buildingsDensity > 0) {
    layers.push({
      id: "building",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "building",
      minzoom: Math.max(0, 13 - (values.buildingsDensity - 3)),
      paint: {
        "fill-color": values.buildingsColor,
        "fill-outline-color": values.buildingsOutline,
        "fill-opacity": values.buildingsOpacity,
      },
    });
  }

  if (values.roadsShow) {
    const shift = (values.roadsDensity - 3) * 3;
    for (const road of ROAD_CLASSES) {
      if (!values[road.showKey]) continue;
      layers.push({
        id: `road-${road.class}`,
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        filter: ["==", ["get", "class"], road.class],
        minzoom: Math.max(0, road.minZoom - shift),
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": values[road.key] as string,
          "line-width": roadWidthExpr(
            road.widths,
            values.roadsClarity,
            values.roadsWidth,
          ),
        },
      });
    }
  }

  if (values.bordersShow) {
    layers.push({
      id: "boundary",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      filter: ["<=", ["get", "admin_level"], 4],
      paint: {
        "line-color": values.bordersColor,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          4,
          0.3 * values.bordersWidth,
          10,
          0.7 * values.bordersWidth,
          14,
          1.2 * values.bordersWidth,
        ],
      },
    });
  }

  if (values.labelsPlaceNames) {
    layers.push({
      id: "label-place",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Noto Sans Regular"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 4, 10, 14, 16],
        "text-letter-spacing": 0.1,
      },
      paint: labelPaint(values),
    });
  }

  if (values.labelsRoadNames) {
    layers.push({
      id: "label-road",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "transportation_name",
      minzoom: 13,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Noto Sans Regular"],
        "text-size": 10,
        "symbol-placement": "line",
      },
      paint: labelPaint(values),
    });
  }

  if (values.labelsRiverNames) {
    layers.push({
      id: "label-river",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "water_name",
      filter: ["==", ["get", "class"], "river"],
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Noto Sans Regular"],
        "text-size": 10,
        "symbol-placement": "line",
      },
      paint: labelPaint(values),
    });
  }

  if (values.labelsLakeNames) {
    layers.push({
      id: "label-lake",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "water_name",
      filter: ["!=", ["get", "class"], "river"],
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Noto Sans Regular"],
        "text-size": 10,
      },
      paint: labelPaint(values),
    });
  }

  if (values.labelsPois) {
    layers.push({
      id: "label-poi",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "poi",
      minzoom: 16,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Noto Sans Regular"],
        "text-size": 10,
        "text-letter-spacing": 0.05,
      },
      paint: labelPaint(values),
    });
  }

  return {
    ...BASE_STYLE,
    layers,
  } as StyleSpecification;
}
