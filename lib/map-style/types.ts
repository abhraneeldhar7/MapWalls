export type StyleValues = {
  landBackground: string;
  landForest: string;
  landGrass: string;
  landSand: string;
  landSnow: string;
  landParks: string;
  landResidential: string;

  waterOceanShow: boolean;
  waterOcean: string;
  waterLakesShow: boolean;
  waterLakes: string;
  waterRiversShow: boolean;
  waterRivers: string;
  waterStreamsShow: boolean;
  waterStreams: string;
  waterwayDensity: number;

  roadsShow: boolean;
  roadsColor: string;
  roadsDensity: number;
  roadsWidth: number;
  roadsClarity: number;
  roadsMotorwayShow: boolean;
  roadsMotorway: string;
  roadsTrunkShow: boolean;
  roadsTrunk: string;
  roadsPrimaryShow: boolean;
  roadsPrimary: string;
  roadsSecondaryShow: boolean;
  roadsSecondary: string;
  roadsTertiaryShow: boolean;
  roadsTertiary: string;
  roadsMinorShow: boolean;
  roadsMinor: string;
  roadsServiceShow: boolean;
  roadsService: string;
  roadsPathsShow: boolean;
  roadsPaths: string;

  buildingsShow: boolean;
  buildingsColor: string;
  buildingsOutline: string;
  buildingsOpacity: number;
  buildingsDensity: number;

  bordersShow: boolean;
  bordersColor: string;
  bordersWidth: number;

  labelsPlaceNames: boolean;
  labelsRoadNames: boolean;
  labelsRiverNames: boolean;
  labelsLakeNames: boolean;
  labelsPois: boolean;
};

type ControlBase = {
  id: string;
  label: string;
  advanced?: boolean;
  sets?: string[];
  group?: string;
  showKey?: string;
};

export type SwitchControl = ControlBase & { type: "switch" };

export type SliderControl = ControlBase & {
  type: "slider";
  min: number;
  max: number;
  step: number;
};

export type ColorControl = ControlBase & { type: "color" };

export type ButtonGroupControl = ControlBase & {
  type: "buttongroup";
  min: number;
  max: number;
  step: number;
};

export type Control =
  | SwitchControl
  | SliderControl
  | ColorControl
  | ButtonGroupControl;

export type CategoryConfig = {
  id: string;
  label: string;
  controls: Control[];
};
