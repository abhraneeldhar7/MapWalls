import type { LayerSpecification } from "maplibre-gl";

export const BASE_STYLE = {
  version: 8,
  name: "MapWalls",
  sources: {
    openmaptiles: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
    },
  },
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  layers: [] as LayerSpecification[],
};
