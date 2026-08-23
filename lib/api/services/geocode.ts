import { NOMINATIM_SEARCH_URL } from "@/lib/api/services/endpoints";

export interface PlaceResult {
  id: string;
  label: string;
  center: [number, number];
  zoom: number;
  boundingbox?: [number, number, number, number];
  osmType?: string;
  osmId?: number;
  category?: string;
  type?: string;
  placeRank?: number;
  importance?: number;
}

interface GeocodeResponseItem {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  category?: string;
  type?: string;
  place_rank?: number;
  importance?: number;
  boundingbox: [string, string, string, string];
}

const ZOOM_BY_TYPE: Record<string, number> = {
  country: 5,
  state: 6,
  county: 9,
  city: 11,
  town: 13,
  village: 14,
  suburb: 14,
  neighbourhood: 15,
  road: 16,
  house: 17,
  building: 17,
};

function zoomFor(item: GeocodeResponseItem): number {
  if (item.type && ZOOM_BY_TYPE[item.type] !== undefined) return ZOOM_BY_TYPE[item.type];
  if (item.category === "boundary") return 9;
  return 13;
}

const RETRY_DELAY_MS = 1000;

async function fetchResults(query: string): Promise<Response> {
  const url = `${NOMINATIM_SEARCH_URL}?q=${encodeURIComponent(query)}&format=jsonv2&limit=6`;
  try {
    const response = await fetch(url);
    if (!response.ok && response.status >= 500) throw new Error(String(response.status));
    return response;
  } catch {
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    return fetch(url);
  }
}

export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  const response = await fetchResults(query);
  if (!response.ok) throw new Error(`Search failed with ${response.status}`);

  const items: GeocodeResponseItem[] = await response.json();
  console.log("[geocode] raw:", items);

  const results = items.map((item) => ({
    id: String(item.place_id),
    label: item.display_name,
    center: [Number.parseFloat(item.lon), Number.parseFloat(item.lat)] as [number, number],
    zoom: zoomFor(item),
    boundingbox: item.boundingbox.map(Number) as [number, number, number, number],
    osmType: item.osm_type,
    osmId: item.osm_id,
    category: item.category,
    type: item.type,
    placeRank: item.place_rank,
    importance: item.importance,
  }));
  console.log("[geocode] mapped:", results);

  return results;
}
