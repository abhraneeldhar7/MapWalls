"use client";

import { Loader2, LocateFixed, MapPin, MapPinIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedAsync } from "@/hooks/useDebouncedAsync";
import { searchPlaces, type PlaceResult } from "@/lib/api/services/geocode";

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 450;

type SearchBarProps = {
  onSelectPlace: (place: PlaceResult) => void;
};

export function SearchBar({ onSelectPlace }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);

  const { status, data } = useDebouncedAsync(
    query,
    searchPlaces,
    DEBOUNCE_MS,
    (trimmed) => trimmed.length < MIN_QUERY_LENGTH,
  );

  useEffect(() => {
    if (status === "success" && data && data.length > 0) setOpen(true);
    else if (status !== "loading") setOpen(false);
  }, [status, data]);

  function handleOpenChange(next: boolean) {
    if (!next) setOpen(false);
    // opening is code-driven only; ignore the trigger's click-to-open attempts
  }

  function select(place: PlaceResult) {
    setOpen(false);
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
    <div className="fixed top-4 left-[50%] translate-x-[-50%] z-5 w-fit h-fit">
      <div className={`rounded-sm bg-input border transition-all flex items-center ${searchbarOpen ? "gap-1.5" : "gap-0"}`} >
        <Button
          className={`transition-all w-fit overflow-hidden hover:scale-[0.97] active:scale-[0.95]  ${!searchbarOpen ? "max-w-100 p-3 oapcity-100" : "max-w-0 opacity-0 p-0"} `}
          onClick={() => { setSearchbarOpen(true) }}
          aria-label="Search places"
          size="icon"
          variant="ghost">
          <SearchIcon />
        </Button>

        <div className={`overflow-hidden w-fit ${searchbarOpen ? "max-w-100 p-3" : "max-w-0 p-0"} transition-all`}>
          <input
            placeholder="Search places..."
            className="w-full md:w-50 px-2 text-md sm:text-base border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 bg-transparent "
          />
        </div>

        <div className={`w-fit transition-all ${searchbarOpen ? "max-w-100 p-4 oapcity-100" : "max-w-0 opacity-0 p-0"} overflow-hidden hover:scale-[0.97] rounded-sm hover:bg-muted-foreground/20 active:scale-[0.95] cursor-pointer select-none`}>
        </div>
        <Button
          className={`transition-all w-fit overflow-hidden hover:scale-[0.97] active:scale-[0.95]  ${searchbarOpen ? "max-w-100 p-3 oapcity-100" : "max-w-0 opacity-0 p-0"} `}
          onClick={locate}
          aria-label="Use my location"
          disabled={locating}
          size="icon"
          variant="ghost">
          <MapPinIcon size={16} />
        </Button>

      </div>

      {/* <div className="relative flex-1">
        <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !open && results.length > 0) select(results[0]);
          }}
          placeholder="Search a place…"
          className="bg-input pl-10"
        />
        {status === "loading" && (
          <Loader2 className="absolute top-1/2 right-2.5 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={locate}
        aria-label="Use my location"
        disabled={locating}
      >
        {locating ? <Loader2 className="animate-spin" /> : <LocateFixed />}
      </Button> */}

      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuContent>
          {results.map((place) => (
            <DropdownMenuItem key={place.id} onClick={() => select(place)}>
              <MapPin />
              <span className="truncate">{place.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
