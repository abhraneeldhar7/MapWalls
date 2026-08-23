"use client";

import { useRef } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import { MapView } from "@/components/map/map-view";
import { SearchBar } from "@/components/map/search-bar";
import type { PlaceResult } from "@/lib/api/services/geocode";

export default function Home() {
  const mapRef = useRef<MapRef | null>(null);

  function handleSelectPlace(place: PlaceResult) {
    mapRef.current?.flyTo({ center: place.center, zoom: place.zoom });
  }

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <MapView mapRef={mapRef} />
      <SearchBar onSelectPlace={handleSelectPlace} />
    </main>
  );
}
