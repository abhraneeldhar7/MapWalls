"use client";

import { MapPinIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDebouncedAsync } from "@/hooks/useDebouncedAsync";
import { searchPlaces, type PlaceResult } from "@/lib/api/services/geocode";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 450;

type SearchBarProps = {
  onSelectPlace: (place: PlaceResult) => void;
  className?: string;
};

export function SearchBar({ onSelectPlace, className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [openResults, setOpenResults] = useState(false);
  const [locating, setLocating] = useState(false);

  const { status, data } = useDebouncedAsync(
    query,
    searchPlaces,
    DEBOUNCE_MS,
    (trimmed) => trimmed.length < MIN_QUERY_LENGTH,
  );

  useEffect(() => {
    if (status === "success" && data && data.length > 0) setOpenResults(true);
    else if (status !== "loading") setOpenResults(false);
  }, [status, data]);

  function handleOpenChange(next: boolean) {
    if (!next) setOpenResults(false);
    // opening is code-driven only; ignore the trigger's click-to-open attempts
  }

  function select(place: PlaceResult) {
    setOpenResults(false);
    onSelectPlace(place);
  }

  function locate() {
    if (!navigator.geolocation || locating) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        select({
          id: "gps",
          label: "My location",
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 15,
        });
      },
      () => setLocating(false),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  const results = status === "success" && data ? data : [];
  const [searchbarOpen, setSearchbarOpen] = useState(false);

  return (
    <div className={cn("w-fit h-fit flex flex-col gap-1.5", className)}>
      <div className={` transition-all ${searchbarOpen ? "gap-1.5 bg-background flex items-center rounded-[10px] p-[2px]" : "gap-0 rounded-0"} p-0`} >
        <Button
          className={`transition-all w-fit overflow-hidden duration-fast hover:scale-[0.97] active:scale-[0.95]  ${!searchbarOpen ? "max-w-100 p-3 oapcity-100" : "max-w-0 opacity-0 p-0"} bg-background`}
          onClick={() => { setSearchbarOpen(true) }}
          aria-label="Search places"
          size="icon"
          variant="ghost">
          <SearchIcon />
        </Button>

        <div className={`overflow-hidden w-fit ${searchbarOpen ? "max-w-100 px-2" : "max-w-0 px-0"} transition-all relative`}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search places..."
            className="w-full md:w-50 text-md sm:text-base border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 bg-transparent"
          />
        </div>

        {status === "loading" ?
          <Button
            size="icon"
            variant="ghost"
            className="bg-transparent!">
            <Spinner />
          </Button> :
          <Button
            className={`transition-all w-fit overflow-hidden hover:scale-[0.97] active:scale-[0.95]  ${searchbarOpen ? "max-w-100 oapcity-100" : "max-w-0 opacity-0"} `}
            onClick={locate}
            aria-label="Use my location"
            disabled={locating}
            size="icon"
            variant="ghost">
            <MapPinIcon />
          </Button>
        }
      </div>

      <div className="relative w-full">
        {(openResults && results.length > 0) &&
          <div className="absolute top-0 h-fit w-full bg-muted p-1 rounded-[10px] flex flex-col gap-1">
            {results.map((place) => (
              <Button size="sm" variant="ghost" className="w-full" onClick={() => select(place)}>
                <span className="truncate">
                  {place.label}
                </span>
              </Button>
            ))}
          </div>
        }
      </div>
    </div>
  );
}
