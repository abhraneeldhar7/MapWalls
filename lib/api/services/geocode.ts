import { NOMINATIM_SEARCH_URL } from "@/lib/api/endpoints";
import * as H from "@hugeicons/core-free-icons";

type IconSvgObject = ReadonlyArray<readonly [string, { readonly [key: string]: string | number }]>;

const CATEGORY_ICONS: Record<string, IconSvgObject> = {
  place: H.MapPinIcon,
  natural: H.MountainIcon,
  water: H.WavesIcon,
  highway: H.Road01Icon,
  tourism: H.Camera01Icon,
  amenity: H.Store01Icon,
  shop: H.Store01Icon,
  leisure: H.TreesIcon,
  historic: H.LandmarkIcon,
  landuse: H.Tree01Icon,
  building: H.Building01Icon,
  boundary: H.GlobeIcon,
  emergency: H.Hospital01Icon,
  healthcare: H.Hospital01Icon,
  military: H.Flag03Icon,
  aeroway: H.Airport02Icon,
  man_made: H.Factory01Icon,
  power: H.ElectricTower01Icon,
  railway: H.Train01Icon,
};

export function getCategoryIcon(category: string): IconSvgObject {
  return CATEGORY_ICONS[category] ?? H.MapPinIcon;
}

export type GeocodeResult = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  category: string;
};

export async function searchPlaces(query: string): Promise<GeocodeResult[]> {
  const params = new URLSearchParams({
    format: "jsonv2",
    q: query,
    limit: "5",
  });
  const res = await fetch(`${NOMINATIM_SEARCH_URL}?${params}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Geocoding request failed");
  return res.json();
}