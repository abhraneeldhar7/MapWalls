import type { MapTemplate } from "@/lib/types";

export const minimal: MapTemplate = {
  name: "Minimal",
  config: {
    background: { color: "#f7f4ef" },
    water: {
      ocean: { color: "#aad3df" },
      lake: { color: "#aad3df" },
      river: { color: "#aad3df", width: 1 },
    },
    roads: {
      lineCap: "round",
      lineJoin: "round",
      motorway: { color: "#9a9a9a", width: 1.5 },
      trunk: { color: "#9a9a9a", width: 1.2 },
      primary: { color: "#9a9a9a", width: 1 },
      secondary: { color: "#9a9a9a", width: 0.8 },
      tertiary: { color: "#9a9a9a", width: 0.6 },
      minor: { color: "#9a9a9a", width: 0.4 },
    },
    labels: {
      road: { color: "#333333", size: 15, minZoom: 5 },
      place: { color: "#333333", size: 12 },
    },
  },
};
