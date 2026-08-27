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
  height?: number;
  base?: number;
  verticalGradient?: boolean;
  minZoom?: number;
};

export type LabelField = {
  show?: boolean;
  color?: string;
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
    opacity?: number;
    forest?: string;
    grass?: string;
    sand?: string;
    ice?: string;
    residential?: string;
    commercial?: string;
    industrial?: string;
    park?: string;
  };
  water: {
    ocean?: FillField;
    lake?: FillField;
    river?: LineField;
    stream?: LineField;
  };
  roads: {
    show?: boolean;
    lineCap?: "butt" | "round" | "square";
    lineJoin?: "bevel" | "round" | "miter";
    motorway?: LineField;
    trunk?: LineField;
    primary?: LineField;
    secondary?: LineField;
    tertiary?: LineField;
    minor?: LineField;
    service?: LineField;
    path?: LineField;
  };
  buildings: BuildingField;
  borders: {
    country?: LineField;
    state?: LineField;
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
