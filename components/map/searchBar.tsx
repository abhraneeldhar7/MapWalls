"use client"

import { useEffect, useRef, useState } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { useMap } from "react-map-gl/maplibre";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Location05Icon, SearchIcon, Loader2Icon } from "../ui/icons";
import { CommandEmpty, CommandItem, CommandList } from "../ui/command";
import { useDebouncedAsync } from "@/hooks/useDebouncedAsync";
import { searchPlaces, getCategoryIcon, type GeocodeResult } from "@/lib/api/services/geocode";
import { HugeiconsIcon } from "@hugeicons/react";

export default function SearchBar() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { default: map } = useMap();

    const { status, data } = useDebouncedAsync(query, searchPlaces, 400, (v) => v === "");

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const closeAndClear = () => {
        setOpen(false);
        setQuery("");
    };

    const selectResult = (result: GeocodeResult) => {
        map?.flyTo({ center: [Number(result.lon), Number(result.lat)], zoom: 14 });
        setOpen(false);
        setTimeout(() => setQuery(""), 400);
    };

    const handleLocate = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                map?.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 15 });
                closeAndClear();
            },
            () => {
                toast.error("Could not get your location");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return (
        <CommandPrimitive ref={containerRef} shouldFilter={false} className={`relative flex transition-all items-center bg-background/50 backdrop-blur-[10px] rounded-md`}>
            <Button size="icon" variant="secondary" className={`hover:scale-[0.95] active:scale-[0.95] overflow-hidden ${open ? "max-w-0 max-h-0 border-0" : "max-w-20 max-h-20 border-1"}`} onClick={() => {
                setOpen(true);
                inputRef.current?.focus();
            }}><SearchIcon /></Button>
            <CommandPrimitive.Input ref={inputRef} placeholder="Search places..." value={query} onValueChange={setQuery} className={`bg-[unset] h-11 sm:h-11 transition-all w-70 sm:w-80 overflow-hidden rounded-md  ${open ? "max-w-100 max-h-100 pl-3 border-1" : "max-w-0 p-0 max-h-0 border-0 pl-0"}`} />
            <Button variant="secondary" className={`absolute right-[4px] top-[50%] sm:h-9 h-9 w-9 translate-y-[-50%] overflow-hidden rounded-[8px] ${open ? "max-w-20 max-h-20 border-1" : "max-w-0 max-h-0 border-0"}`} onClick={handleLocate}><Location05Icon /></Button>
            {open && query.trim().length > 0 && (
                <CommandList className="absolute top-full left-0 right-0 z-10 mt-1 overflow-hidden rounded-sm border border-border bg-background p-1 group">
                    {status === "loading" && (
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                            <Loader2Icon className="size-4 animate-spin" />
                            Searching...
                        </div>
                    )}
                    {status === "error" && (
                        <div className="px-3 py-2 text-sm text-muted-foreground">Search failed</div>
                    )}
                    {status === "success" && data && data.length === 0 && (
                        <CommandEmpty>No results found</CommandEmpty>
                    )}
                    {status === "success" && data && data.map((result) => (
                        <CommandItem
                            key={result.place_id}
                            value={String(result.place_id)}
                            onSelect={() => selectResult(result)}
                            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xs text-sm hover:bg-foreground/10 data-selected:bg-foreground/10 active:bg-foreground/20"
                        >
                            <div className="flex gap-2">
                                <HugeiconsIcon icon={getCategoryIcon(result.category)} className="size-5" />
                                <span className="line-clamp-2">{result.display_name}</span>
                            </div>
                        </CommandItem>
                    ))}
                </CommandList>
            )}
        </CommandPrimitive>
    )
}