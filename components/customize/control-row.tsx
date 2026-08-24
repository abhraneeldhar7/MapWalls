"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useMapInstance } from "@/lib/map-style/context";
import type { Control, StyleValues } from "@/lib/map-style/types";
import { ColorPicker } from "./color-picker";

function ControlValue({ control }: { control: Control }) {
  const { values, setValues } = useMapInstance();
  const key = (control.sets ?? [control.id])[0] as keyof StyleValues;
  const value = values[key];

  function update(next: string | number | boolean) {
    setValues((prev) => {
      const patch: Partial<StyleValues> = {};
      for (const k of control.sets ?? [control.id]) {
        patch[k as keyof StyleValues] = next as never;
      }
      if (control.type === "buttongroup" && control.showKey) {
        const showKey = control.showKey as keyof StyleValues;
        if ((next as number) <= control.min) {
          patch[showKey] = false as never;
        } else if (
          !prev[showKey] &&
          prev[control.id as keyof StyleValues] === control.min
        ) {
          patch[showKey] = true as never;
        }
      }
      const nextValues = { ...prev, ...patch };
      if (process.env.NEXT_PUBLIC_ENVIRONMENT !== "production") {
        console.log(`[MapStyle] ${control.label}: ${next}`);
        console.log("[MapStyle] template:", JSON.stringify(nextValues, null, 2));
      }
      return nextValues;
    });
  }

  switch (control.type) {
    case "switch":
      return (
        <Switch
          checked={value as boolean}
          onCheckedChange={(checked) => update(checked)}
        />
      );
    case "slider":
      return (
        <Slider
          className="w-28"
          value={[value as number]}
          min={control.min}
          max={control.max}
          step={control.step}
          onValueChange={([next]) => update(next)}
        />
      );
    case "buttongroup":
      return (
        <ButtonGroup orientation="horizontal" className="w-fit">
          <Button
            variant="outline"
            size="icon"
            disabled={(value as number) >= control.max}
            onClick={() =>
              update(Math.min((value as number) + control.step, control.max))
            }
          >
            <PlusIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={(value as number) <= control.min}
            onClick={() =>
              update(Math.max((value as number) - control.step, control.min))
            }
          >
            <MinusIcon />
          </Button>
        </ButtonGroup>
      );
    case "color":
      return (
        <ColorPicker
          label={control.label}
          value={value as string}
          onChange={(next) => update(next)}
        />
      );
  }
}

export function ControlRow({ control }: { control: Control }) {
  return (
    <div className="flex h-9 items-center justify-between gap-3">
      <span className="text-sm">{control.label}</span>
      <ControlValue control={control} />
    </div>
  );
}
