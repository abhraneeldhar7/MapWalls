"use client";

import { useState } from "react";
import { PipetteIcon } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type EyeDropperResult = { sRGBHex: string };

declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<EyeDropperResult> };
  }
}

function useScreenPickerSupported() {
  return typeof window !== "undefined" && "EyeDropper" in window;
}

export function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const supported = useScreenPickerSupported();

  async function pickFromScreen() {
    if (!window.EyeDropper) return;
    try {
      const result = await new window.EyeDropper().open();
      onChange(result.sRGBHex);
    } catch {}
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label={`${label} color`}
          className="size-7 shrink-0 cursor-pointer rounded-md border border-border shadow-xs"
          style={{ backgroundColor: value }}
        />
      </PopoverTrigger>
      <PopoverContent side="left" align="center" className="w-fit gap-0 p-3">
        <div className="flex flex-col items-center gap-2.5">
          {supported && (
            <Button variant="outline" size="sm" className="w-full" onClick={pickFromScreen}>
              <PipetteIcon />
              Pick from screen
            </Button>
          )}
          <HexColorPicker color={value} onChange={onChange} />
          <span className="text-xs text-muted-foreground uppercase">
            {value}
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
