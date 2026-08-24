"use client";

import { MapView } from "@/components/map/map-view";
import { SearchBar } from "@/components/map/search-bar";
import { CustomizeButton } from "@/components/customize/customize-button";
import { MapProvider, useMapInstance } from "@/lib/map-style/context";
import type { PlaceResult } from "@/lib/api/services/geocode";

function HomeContent() {
  const { map } = useMapInstance();

  function handleSelectPlace(place: PlaceResult) {
    map?.flyTo({ center: place.center, zoom: place.zoom });
  }

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <div className="flex justify-centerd fixed top-4 left-[50%] translate-x-[-50%] z-5">
        <SearchBar onSelectPlace={handleSelectPlace} />
      </div>

      <MapView />

      <CustomizeButton />
    </main>
  );
}

export default function Home() {
  return (
    <MapProvider>
      <HomeContent />
    </MapProvider>
  );
}
