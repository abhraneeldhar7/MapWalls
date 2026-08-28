export type FillField = {
  show?: boolean;
  color?: string;
  opacity?: number;
  outline?: string;
  minZoom?: number;
};

export type LineField = {
  show?: boolean;
  color?: string;
  width?: number;
  opacity?: number;
  blur?: number;
  dash?: number[];
  minZoom?: number;
};

export type BuildingField = {
  show?: boolean;
  color?: string;
  opacity?: number;
  minZoom?: number;
};

export type LabelField = {
  show?: boolean;
  color?: string;
  opacity?: number;
  haloColor?: string;
  haloWidth?: number;
  haloBlur?: number;
  font?: string;
  size?: number;
  letterSpacing?: number;
  transform?: "none" | "uppercase" | "lowercase";
  allowOverlap?: boolean;
  classes?: string[];
  rank?: number;
  minZoom?: number;
};

export type MapStyleConfig = {
  background: {
    color?: string;
    opacity?: number;
  };
  land: {
    show?: boolean;
    forest?: FillField;
    grass?: FillField;
    sand?: FillField;
    ice?: FillField;
    rock?: FillField;
    wetland?: FillField;
    farmland?: FillField;
    residential?: FillField;
    commercial?: FillField;
    industrial?: FillField;
    park?: FillField;
  };
  water: {
    ocean?: FillField;
    lake?: FillField;
    river?: LineField;
    stream?: LineField;
    density?: number;
  };
  roads: {
    show?: boolean;
    lineCap?: "butt" | "round" | "square";
    lineJoin?: "bevel" | "round" | "miter";
    hideTunnels?: boolean;
    hideBridges?: boolean;
    motorway?: LineField;
    trunk?: LineField;
    primary?: LineField;
    secondary?: LineField;
    tertiary?: LineField;
    minor?: LineField;
    service?: LineField;
    path?: LineField;
    track?: LineField;
    pedestrian?: LineField;
    street?: LineField;
    street_limited?: LineField;
    rail?: LineField;
    transit?: LineField;
    density?: number;
  };
  buildings: BuildingField;
  borders: {
    country?: LineField;
    state?: LineField;
    county?: LineField;
    city?: LineField;
    showMaritime?: boolean;
    showDisputed?: boolean;
  };
  labels: {
    place?: LabelField;
    road?: LabelField;
    river?: LabelField;
    lake?: LabelField;
    poi?: LabelField;
  };
  transition: {
    duration?: number;
    delay?: number;
  };
  light: {
    color?: string;
    intensity?: number;
    position?: [number, number, number];
  };
};

export type MapTemplate = {
  name: string;
  config: Partial<MapStyleConfig>;
};
