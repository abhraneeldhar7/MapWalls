"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CopyIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";
import { HexColorPicker } from "react-colorful";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TransitionBox } from "@/components/shared/transition-box";
import { useMapProvider } from "@/components/providers/map-provider";
import { mapMenus, type ControlConfig, type MenuConfig, type SubEntityConfig } from "@/lib/controlPanelOptions";
import { getPath, setPaths } from "@/lib/utils";
import type { MapStyleConfig } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { ScrollArea } from "../ui/scroll-area";

type Values = Partial<MapStyleConfig>;
type SetStyles = (updater: (prev: Values) => Values) => void;

function applyControl(setStyles: SetStyles, control: ControlConfig, value: unknown) {
  setStyles((prev) => setPaths(prev, control.targets, value));
}

function Control({ control }: { control: ControlConfig }) {
  const { styles, setStyles } = useMapProvider();
  const current = control.targets[0] ? getPath(styles, control.targets[0]) : undefined;

  if (control.type === "switch") {
    return (
      <div className="flex items-center justify-between">
        <Label>{control.label}</Label>
        <Switch checked={current !== false} onCheckedChange={(checked) => applyControl(setStyles, control, checked)} />
      </div>
    );
  }

  if (control.type === "color") {
    const color = typeof current === "string" ? current : "#ffffff00";
    return (
      <div className="flex items-center justify-between">
        <Label>{control.label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="size-8 rounded-xs border"
              style={{ backgroundColor: color }}
              aria-label={control.label}
            />
          </PopoverTrigger>
          <PopoverContent className="w-fit p-1 gap-1" side="right" align="start">
            <div className="flex gap-1 items-center">
              <div className="flex-1 relative h-8">
                <Input value={color} className="h-8 sm:h-8 absolute inset-0 absolute" />
              </div>
              <Button variant="secondary" size="icon-sm"><CopyIcon /></Button>
            </div>
            <HexColorPicker color={color} onChange={(next) => applyControl(setStyles, control, next)} />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  if (control.type === "slider") {
    const value = typeof current === "number" ? current : (control.defaultValue ?? 0);
    return (
      <div className="flex flex-col gap-3">
        <Label>{control.label}</Label>
        <Slider
          min={control.min}
          max={control.max}
          step={control.step}
          value={[value]}
          onValueChange={([next]) => applyControl(setStyles, control, next)}
        />
      </div>
    );
  }

  const step = control.step ?? 1;
  const value = typeof current === "number" ? current : (control.defaultValue ?? control.min ?? 0);
  return (
    <div className="flex items-center justify-between">
      <Label>{control.label}</Label>
      <div className="flex items-center gap-2">
        <Button
          size="icon-xs"
          variant="secondary"
          onClick={() => applyControl(setStyles, control, Math.max(control.min ?? 0, value - step))}
        >
          <MinusIcon />
        </Button>
        <span className="w-8 text-center text-sm tabular-nums">{value}</span>
        <Button
          size="icon-xs"
          variant="secondary"
          onClick={() => applyControl(setStyles, control, Math.min(control.max ?? 24, value + step))}
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}

function ControlsGroup({ controls }: { controls: ControlConfig[] }) {
  return (
    <div className="flex flex-col gap-5">
      {controls.map((control) => (
        <Control key={control.label} control={control} />
      ))}
    </div>
  );
}


function SubMenuContent({ menu, onBack }: { menu: MenuConfig; onBack: () => void }) {
  return (
    <div className="flex flex-col p-1.5 gap-4">
      <div className="flex items-center gap-1">
        <Button className="w-full justify-start" variant="secondary" onClick={onBack} aria-label="Back">
          <ChevronLeftIcon />
          Return
        </Button>
      </div>

      <p className="font-semibold text-center opacity-80">{menu.label}</p>

      <div className="px-2 flex-1 space-y-5">
        <ControlsGroup controls={menu.controls} />
        {menu.submenu.length > 0 && (
          <Accordion type="multiple">
            {menu.submenu.map((sub: SubEntityConfig) => (
              <AccordionItem key={sub.id} value={sub.id}>
                <AccordionTrigger>{sub.label}</AccordionTrigger>
                <AccordionContent>
                  <ControlsGroup controls={sub.controls} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}

export default function CustomizeSidebar() {
  const [index, setIndex] = useState(0);
  const [subMenu, setSubMenu] = useState<MenuConfig | null>(null);

  return (
    <Sidebar variant="floating" collapsible="offcanvas">
      <SidebarContent>
        <div className="relative h-full w-full">
          <TransitionBox activationIndex={0} currentIndex={index}>
            <div className="flex flex-col gap-0 p-1.5">
              {mapMenus.map((menu, index) => (
                <Button variant="ghost" className="justify-between" key={index} onClick={() => {
                  setSubMenu(menu);
                  setIndex(1);
                }}>
                  <div className="flex items-center gap-2"><HugeiconsIcon icon={menu.icon} /> {menu.label}</div>
                  <ChevronRightIcon />
                </Button>
              ))}
            </div>
          </TransitionBox>
          <TransitionBox activationIndex={1} currentIndex={index}>
            {subMenu && (
              <SubMenuContent
                menu={subMenu}
                onBack={() => setIndex(0)}
              />
            )}
          </TransitionBox>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}