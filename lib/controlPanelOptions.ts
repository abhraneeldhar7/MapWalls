import * as H from "@hugeicons/core-free-icons";

type IconSvgObject = ReadonlyArray<readonly [string, { readonly [key: string]: string | number }]>;

export type ControlType = "switch" | "color" | "slider" | "buttongroup" | "select" | "options";

export type ControlConfig = {
  label: string;
  type: ControlType;
  targets: string[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | string | boolean;
  options?: { label: string; value: string }[];
};

export type SubEntityConfig = {
  id: string;
  label: string;
  icon: IconSvgObject;
  controls: ControlConfig[];
};

export type MenuConfig = {
  id: string;
  label: string;
  icon: IconSvgObject;
  controls: ControlConfig[];
  submenu: SubEntityConfig[];
};

const ROADS = [
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

const ROAD_ICONS: Record<(typeof ROADS)[number], IconSvgObject> = {
  motorway: H.Road01Icon,
  trunk: H.Road02Icon,
  primary: H.Route01Icon,
  secondary: H.Route02Icon,
  tertiary: H.RoadWaysideIcon,
  minor: H.PathIcon,
  service: H.Wrench01Icon,
  path: H.HikingIcon,
  track: H.RoadIcon,
  pedestrian: H.WalkingIcon,
  street: H.RoadLocation01Icon,
  street_limited: H.RoadLocation02Icon,
  rail: H.Train01Icon,
  transit: H.Train02Icon,
};

const roadLabel = (cls: string) => (cls === "street_limited" ? "Street limited" : cls.charAt(0).toUpperCase() + cls.slice(1));

const roadPaths = (suffix: string) => ROADS.map((cls) => `roads.${cls}.${suffix}`);
const roadSubmenu: SubEntityConfig[] = ROADS.map((cls) => ({
  id: cls,
  label: roadLabel(cls),
  icon: ROAD_ICONS[cls],
  controls: [
    { label: "Show", type: "switch", targets: [`roads.${cls}.show`] },
    { label: "Color", type: "color", targets: [`roads.${cls}.color`] },
    { label: "Opacity", type: "slider", targets: [`roads.${cls}.opacity`], min: 0, max: 100, step: 1, defaultValue: 100 },
    { label: "Thickness", type: "slider", targets: [`roads.${cls}.width`], min: 0.2, max: 3, step: 0.1, defaultValue: 1 },
    { label: "Density", type: "buttongroup", targets: [`roads.${cls}.minZoom`], min: 0, max: 16, step: 1, defaultValue: 5 },
  ],
}));

const LAND_CLASSES = [
  ["forest", "forest"],
  ["grass", "grass"],
  ["sand", "sand"],
  ["ice", "ice"],
  ["rock", "rock"],
  ["wetland", "wetland"],
  ["farmland", "farmland"],
  ["residential", "residential"],
  ["commercial", "commercial"],
  ["industrial", "industrial"],
  ["park", "park"],
] as const;

const LAND_ICONS: Record<(typeof LAND_CLASSES)[number][0], IconSvgObject> = {
  forest: H.Tree01Icon,
  grass: H.SproutIcon,
  sand: H.DesertIcon,
  ice: H.SnowflakeIcon,
  rock: H.MountainIcon,
  wetland: H.WavesIcon,
  farmland: H.WheatIcon,
  residential: H.Home01Icon,
  commercial: H.Store01Icon,
  industrial: H.Factory01Icon,
  park: H.TreesIcon,
};

const landSubmenu: SubEntityConfig[] = LAND_CLASSES.map(([id, key]) => ({
  id,
  label: id.charAt(0).toUpperCase() + id.slice(1),
  icon: LAND_ICONS[id],
  controls: [
    { label: "Show", type: "switch", targets: [`land.${key}.show`] },
    { label: "Color", type: "color", targets: [`land.${key}.color`] },
    { label: "Opacity", type: "slider", targets: [`land.${key}.opacity`], min: 0, max: 100, step: 1, defaultValue: 100 },
  ],
}));

const WATER_ENTITIES = [
  ["ocean", "Ocean"],
  ["lake", "Lake"],
  ["river", "River"],
  ["stream", "Stream"],
] as const;

const WATER_ICONS: Record<(typeof WATER_ENTITIES)[number][0], IconSvgObject> = {
  ocean: H.WavesIcon,
  lake: H.LakeIcon,
  river: H.DropletIcon,
  stream: H.RainIcon,
};

const waterSubmenu: SubEntityConfig[] = WATER_ENTITIES.map(([id, label]) => ({
  id,
  label,
  icon: WATER_ICONS[id],
  controls: [
    { label: "Show", type: "switch", targets: [`water.${id}.show`] },
    { label: "Color", type: "color", targets: [`water.${id}.color`] },
    { label: "Opacity", type: "slider", targets: [`water.${id}.opacity`], min: 0, max: 100, step: 1, defaultValue: 100 },
    { label: "Density", type: "buttongroup", targets: [`water.${id}.minZoom`], min: 0, max: 16, step: 1, defaultValue: 5 },
    ...(id === "river" || id === "stream"
      ? [{ label: "Thickness", type: "slider" as const, targets: [`water.${id}.width`], min: 0.5, max: 3, step: 0.1, defaultValue: 1 }]
      : []),
  ],
}));

const BORDER_ENTITIES = [
  ["country", "Country"],
  ["state", "State"],
  ["county", "County"],
  ["city", "City"],
] as const;

const BORDER_ICONS: Record<(typeof BORDER_ENTITIES)[number][0], IconSvgObject> = {
  country: H.GlobeIcon,
  state: H.Flag01Icon,
  county: H.MapIcon,
  city: H.MapPinIcon,
};

const borderSubmenu: SubEntityConfig[] = BORDER_ENTITIES.map(([id, label]) => ({
  id,
  label,
  icon: BORDER_ICONS[id],
  controls: [
    { label: "Show", type: "switch", targets: [`borders.${id}.show`] },
    { label: "Color", type: "color", targets: [`borders.${id}.color`] },
    { label: "Opacity", type: "slider", targets: [`borders.${id}.opacity`], min: 0, max: 100, step: 1, defaultValue: 100 },
    { label: "Thickness", type: "slider", targets: [`borders.${id}.width`], min: 0.5, max: 3, step: 0.1, defaultValue: 1 },
  ],
}));

const LABEL_ENTITIES = [
  ["place", "Place"],
  ["road", "Road Names"],
  ["river", "River Names"],
  ["lake", "Lake Names"],
  ["poi", "POIs"],
] as const;

const LABEL_ICONS: Record<(typeof LABEL_ENTITIES)[number][0], IconSvgObject> = {
  place: H.MapPinIcon,
  road: H.SignpostIcon,
  river: H.DropletIcon,
  lake: H.LakeIcon,
  poi: H.Tag01Icon,
};

const labelSubmenu: SubEntityConfig[] = LABEL_ENTITIES.map(([id, label]) => ({
  id,
  label,
  icon: LABEL_ICONS[id],
  controls: [
    { label: "Show", type: "switch", targets: [`labels.${id}.show`] },
    { label: "Color", type: "color", targets: [`labels.${id}.color`] },
    { label: "Opacity", type: "slider", targets: [`labels.${id}.opacity`], min: 0, max: 100, step: 1, defaultValue: 100 },
    { label: "Font size", type: "buttongroup", targets: [`labels.${id}.size`], min: 8, max: 24, step: 1, defaultValue: 12 },
  ],
}));

export const mapMenus: MenuConfig[] = [
  {
    id: "land",
    label: "Land",
    icon: H.Tree01Icon,
    controls: [
      { label: "Show land", type: "switch", targets: ["land.show", ...LAND_CLASSES.map(([, key]) => `land.${key}.show`)] },
      {
        label: "Color",
        type: "color",
        targets: ["background.color", ...LAND_CLASSES.map(([, key]) => `land.${key}.color`)],
      },
      {
        label: "Opacity",
        type: "slider",
        targets: ["background.opacity", ...LAND_CLASSES.map(([, key]) => `land.${key}.opacity`)],
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 100,
      },
    ],
    submenu: landSubmenu,
  },
  {
    id: "roads",
    label: "Roads",
    icon: H.Road01Icon,
    controls: [
      { label: "Show roads", type: "switch", targets: ["roads.show"] },
      { label: "Color", type: "color", targets: roadPaths("color") },
      { label: "Opacity", type: "slider", targets: roadPaths("opacity"), min: 0, max: 100, step: 1, defaultValue: 100 },
      { label: "Thickness", type: "slider", targets: roadPaths("width"), min: 0.2, max: 3, step: 0.1, defaultValue: 1 },
      { label: "Density", type: "buttongroup", targets: ["roads.density"], min: 0, max: 10, step: 1, defaultValue: 5 },
      { label: "Line cap", type: "select", targets: ["roads.lineCap"], defaultValue: "round", options: [
        { label: "Butt", value: "butt" },
        { label: "Round", value: "round" },
        { label: "Square", value: "square" },
      ] },
      { label: "Line join", type: "select", targets: ["roads.lineJoin"], defaultValue: "round", options: [
        { label: "Bevel", value: "bevel" },
        { label: "Round", value: "round" },
        { label: "Miter", value: "miter" },
      ] },
      { label: "Hide tunnels", type: "switch", targets: ["roads.hideTunnels"], defaultValue: false },
      { label: "Hide bridges", type: "switch", targets: ["roads.hideBridges"], defaultValue: false },
    ],
    submenu: roadSubmenu,
  },
  {
    id: "water",
    label: "Water",
    icon: H.WavesIcon,
    controls: [
      { label: "Show water", type: "switch", targets: WATER_ENTITIES.map(([id]) => `water.${id}.show`) },
      { label: "Color", type: "color", targets: WATER_ENTITIES.map(([id]) => `water.${id}.color`) },
      { label: "Opacity", type: "slider", targets: WATER_ENTITIES.map(([id]) => `water.${id}.opacity`), min: 0, max: 100, step: 1, defaultValue: 100 },
      { label: "Thickness", type: "slider", targets: ["water.river.width", "water.stream.width"], min: 0.5, max: 3, step: 0.1, defaultValue: 1 },
      { label: "Density", type: "buttongroup", targets: ["water.density"], min: 0, max: 10, step: 1, defaultValue: 5 },
    ],
    submenu: waterSubmenu,
  },
  {
    id: "buildings",
    label: "Buildings",
    icon: H.Building01Icon,
    controls: [
      { label: "Show buildings", type: "switch", targets: ["buildings.show"] },
      { label: "Color", type: "color", targets: ["buildings.color"] },
      { label: "Opacity", type: "slider", targets: ["buildings.opacity"], min: 0, max: 100, step: 1, defaultValue: 100 },
    ],
    submenu: [],
  },
  {
    id: "boundaries",
    label: "Boundaries",
    icon: H.GlobeIcon,
    controls: [
      { label: "Show boundaries", type: "switch", targets: BORDER_ENTITIES.map(([id]) => `borders.${id}.show`) },
      { label: "Color", type: "color", targets: BORDER_ENTITIES.map(([id]) => `borders.${id}.color`) },
      { label: "Opacity", type: "slider", targets: BORDER_ENTITIES.map(([id]) => `borders.${id}.opacity`), min: 0, max: 100, step: 1, defaultValue: 100 },
      { label: "Thickness", type: "slider", targets: BORDER_ENTITIES.map(([id]) => `borders.${id}.width`), min: 0.5, max: 3, step: 0.1, defaultValue: 1 },
      { label: "Show maritime", type: "switch", targets: ["borders.showMaritime"] },
      { label: "Show disputed", type: "switch", targets: ["borders.showDisputed"] },
    ],
    submenu: borderSubmenu,
  },
  {
    id: "labels",
    label: "Labels",
    icon: H.TextFontIcon,
    controls: [
      { label: "Show labels", type: "switch", targets: LABEL_ENTITIES.map(([id]) => `labels.${id}.show`) },
      { label: "Color", type: "color", targets: LABEL_ENTITIES.map(([id]) => `labels.${id}.color`) },
      { label: "Opacity", type: "slider", targets: LABEL_ENTITIES.map(([id]) => `labels.${id}.opacity`), min: 0, max: 100, step: 1, defaultValue: 100 },
      { label: "Font size", type: "buttongroup", targets: LABEL_ENTITIES.map(([id]) => `labels.${id}.size`), min: 8, max: 24, step: 1, defaultValue: 12 },
    ],
    submenu: labelSubmenu,
  },
];
