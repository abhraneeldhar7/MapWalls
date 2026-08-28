"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CopyIcon, MinusIcon, PlusIcon, Tick02Icon } from "@/components/ui/icons";
import { HexColorPicker } from "react-colorful";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TransitionBox } from "@/components/shared/transition-box";
import { useMapProvider } from "@/components/providers/map-provider";
import { mapMenus, type ControlConfig, type MenuConfig, type SubEntityConfig } from "@/lib/controlPanelOptions";
import { getPath, setPaths, copyToClipboard } from "@/lib/utils";
import type { MapStyleConfig } from "@/lib/types";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { ButtonGroup, ButtonGroupText } from "../ui/button-group";
import { Kbd, KbdGroup } from "../ui/kbd";

import ShadcnPic from "@/public/images/shadcn.webp";
import JaredPic from "@/public/images/jaredPic.webp";
import Image from "next/image";
import { CheckmarkBadge02Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "../ui/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import TemplatePreview from "../map/tempaltePreview";
import { templates } from "@/lib/templates";

type Values = Partial<MapStyleConfig>;
type SetStyles = (updater: (prev: Values) => Values) => void;

function applyControl(setStyles: SetStyles, control: ControlConfig, value: unknown) {
  setStyles((prev) => setPaths(prev, control.targets, value));
}

function Control({ control }: { control: ControlConfig }) {
  const { styles, setStyles } = useMapProvider();
  const current = control.targets[0] ? getPath(styles, control.targets[0]) : undefined;

  if (control.type === "switch") {
    const checked = typeof current === "boolean" ? current : control.defaultValue === false ? false : true;
    return (
      <div className="flex items-center justify-between">
        <Label>{control.label}</Label>
        <Switch checked={checked} onCheckedChange={(checked) => applyControl(setStyles, control, checked)} />
      </div>
    );
  }

  if (control.type === "color") {
    const color = typeof current === "string" ? current : "#ffffff00";
    const [copied, setCopied] = useState(false);
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
                <Input
                  value={color}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9a-fA-F]{0,8}$/.test(v)) applyControl(setStyles, control, v);
                  }}
                  className="h-8 sm:h-8 absolute inset-0 absolute"
                />
              </div>
              <Button
                variant="secondary"
                size="icon-sm"
                onClick={async () => {
                  await copyToClipboard(color);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
                }}
              >
                {copied ? <Tick02Icon /> : <CopyIcon />}
              </Button>
            </div>
            <HexColorPicker color={color} onChange={(next) => applyControl(setStyles, control, next)} />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  if (control.type === "slider") {
    const value = typeof current === "number" ? current : (typeof control.defaultValue === "number" ? control.defaultValue : 0);
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

  if (control.type === "buttongroup") {
    const step = control.step ?? 1;
    const def = typeof control.defaultValue === "number" ? control.defaultValue : (control.min ?? 0);
    const value = typeof current === "number" ? current : def;
    return (
      <div className="flex items-center justify-between">
        <Label>{control.label}</Label>
        <ButtonGroup orientation="horizontal" aria-label={control.label} className="h-fit">
          <Button variant="outline" size="icon-sm" onClick={() => applyControl(setStyles, control, Math.max(control.min ?? 0, value - step))}>
            <MinusIcon />
          </Button>
          <ButtonGroupText className="px-2.5 text-sm tabular-nums">{value}</ButtonGroupText>
          <Button variant="outline" size="icon-sm" onClick={() => applyControl(setStyles, control, Math.min(control.max ?? 24, value + step))}>
            <PlusIcon />
          </Button>
        </ButtonGroup>
      </div>
    );
  }

  if (control.type === "select") {
    const selected = typeof current === "string"
      ? current
      : (typeof control.defaultValue === "string" ? control.defaultValue : control.options?.[0]?.value ?? "");
    const selectedLabel = control.options?.find((o) => o.value === selected)?.label ?? selected;
    return (
      <div className="flex items-center justify-between">
        <Label>{control.label}</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
              {selectedLabel}
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {control.options?.map((o) => (
              <DropdownMenuItem key={o.value} onSelect={() => applyControl(setStyles, control, o.value)}>
                {o.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return null;
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


function SubMenuContent({ menu }: { menu: { label: string; controls: ControlConfig[] } }) {
  return (
    <div className="flex flex-col p-1.5 gap-5">
      <p className="font-semibold text-center opacity-80">{menu.label}</p>
      <div className="px-2 space-y-4">
        <ControlsGroup controls={menu.controls} />
      </div>
    </div>
  );
}

export default function CustomizeSidebar() {
  const [index, setIndex] = useState(0);
  const [subMenu, setSubMenu] = useState<MenuConfig | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      setCommandOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Sidebar variant="floating" collapsible="offcanvas">
      <SidebarContent>
        <div className="relative h-full w-full">
          <TransitionBox activationIndex={0} currentIndex={index} className="space-y-2">
            <SidebarGroup>
              <SidebarGroupLabel>Quick access</SidebarGroupLabel>
              <div className="relative" onClick={() => setCommandOpen(true)}><Input placeholder="Go to..." /><KbdGroup className="absolute right-2 top-[50%] translate-y-[-50%]"><Kbd>⌘</Kbd><span className="opacity-60">+</span><Kbd>K</Kbd></KbdGroup></div>

              <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
                <Command>
                  <CommandInput placeholder="Type a command or search..." />
                  <CommandList>
                    <CommandEmpty>No actions found</CommandEmpty>

                    <CommandGroup heading="About Artografer">
                      <CommandItem>
                        About us
                      </CommandItem>
                      <CommandItem>
                        Blogs
                      </CommandItem>
                      <CommandItem>
                        Terms of service
                      </CommandItem>
                      <CommandItem>
                        Privacy policy
                      </CommandItem>
                      <CommandItem>
                        Contact me
                      </CommandItem>
                    </CommandGroup>
                    <CommandGroup heading="Customize">
                      <CommandItem>
                        <span>Home</span>
                        <CommandShortcut>⌘H</CommandShortcut>
                      </CommandItem>


                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Actions">
                      <CommandItem>
                        <PlusIcon />
                        <span>New File</span>
                        <CommandShortcut>⌘N</CommandShortcut>
                      </CommandItem>

                    </CommandGroup>

                  </CommandList>
                </Command>
              </CommandDialog>
            </SidebarGroup>


            <SidebarGroup>
              <SidebarGroupLabel className="justify-between">Templates
                <Button variant="secondary" size="xs">Show more</Button>
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <div className="grid grid-cols-2 gap-2">
                  {templates.slice(0, 2).map((template) => (
                    <div key={template.name} className="aspect-square overflow-hidden rounded-md border">
                      <TemplatePreview styles={template.config} />
                    </div>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>


            <SidebarGroup>
              <SidebarGroupLabel>
                Customize Map
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="flex flex-col gap-0">
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
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <Link href="https://x.com/shadcn/status/2092675296411460075" target="_blank" className="gap-2.5 flex items-start hover:border-border border-transparent border transition-all p-2 hover:bg-muted rounded-md">
                <Image src={ShadcnPic.src} height={100} width={100} alt="" className="rounded-[50%] shrink-0 w-10 h-10 mt-[2px]" />
                <div className="flex flex-col">
                  <span className="text-sm flex items-center gap-1">
                    <span className="font-bold">shadcn</span><HugeiconsIcon icon={CheckmarkBadge02Icon} fill="#1d9bf0" className="text-background" size={20} />
                    <span className="opacity-70">@shadcn</span>
                    <div className="opacity-60 bg-foreground h-[3px] w-[3px] rounded-[50%] mx-1" />
                    <span className="opacity-70 text-xs">Aug 26</span>
                  </span>
                  <span className="font-medium">sidebar-first design</span>
                  <div className="gap-2 flex items-start border p-2 rounded-md mt-2">
                    <Image src={JaredPic.src} height={100} width={100} alt="" className="rounded-[50%] shrink-0 w-5 h-5 mt-[2px]" />
                    <div className="flex flex-col">
                      <span className="text-sm flex items-center gap-1">
                        <span className="font-bold shrink-0">Jared Palmer</span>
                        <HugeiconsIcon icon={CheckmarkBadge02Icon} fill="#1d9bf0" className="text-background shrink-0" size={20} />
                        <span className="opacity-70 truncate">@jaredpalmer</span>
                      </span>
                      <p className="text-sm font-medium">everything is sidebar</p>
                    </div>
                  </div>
                </div>
              </Link>
            </SidebarGroup>


          </TransitionBox>
          <TransitionBox activationIndex={1} currentIndex={index}>
            {subMenu && (
              <div className="p-1.5 space-y-4">
                <div className="flex items-center">
                  <Button className="w-full justify-start" variant="secondary" onClick={() => setIndex(0)} aria-label="Back">
                    <ChevronLeftIcon />
                    Return
                  </Button>
                </div>
                <SubMenuContent menu={subMenu} />

                {/* <div className="border rounded-md w-full h-40 bg-muted">
                preview here
                </div> */}

                {subMenu.submenu.length > 0 && (
                  <Button variant="secondary" className="justify-end w-full" onClick={() => setIndex(2)}>Advanced <ChevronRightIcon /></Button>
                )}
              </div>
            )}
          </TransitionBox>

          <TransitionBox activationIndex={2} currentIndex={index}>
            {subMenu && subMenu.submenu.length > 0 && (
              <div className="p-1.5 space-y-4">
                <div className="flex items-center">
                  <Button className="w-full justify-start" variant="secondary" onClick={() => setIndex(1)} aria-label="Back">
                    <ChevronLeftIcon />
                    Return
                  </Button>
                </div>
                <div className="space-y-5">
                  {subMenu.submenu.map((sub: SubEntityConfig, index) => (
                    <div key={index} className="flex flex-col gap-4">
                      <p className="font-semibold text-center opacity-80">{sub.label}</p>
                      <ControlsGroup controls={sub.controls} />
                    </div>
                  ))}
                </div>
                {/* <div className="fixed bottom-0 z-2 border rounded-md h-40 bg-muted">
                preview here
                </div> */}
              </div>
            )}
          </TransitionBox>
        </div>
      </SidebarContent >
    </Sidebar >
  );
}