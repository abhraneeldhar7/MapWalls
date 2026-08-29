"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CopyIcon, MinusIcon, PlusIcon, Tick02Icon } from "@/components/ui/icons";
import { HexColorPicker } from "react-colorful";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarSeparator } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TransitionBox } from "@/components/shared/transition-box";
import { useMapProvider } from "@/components/providers/map-provider";
import { useEditor } from "@/components/providers/editor-provider";
import { mapMenus, type ControlConfig, type MenuConfig, type SubEntityConfig } from "@/lib/controlPanelOptions";
import { getPath, setPaths, copyToClipboard, cn } from "@/lib/utils";
import { canvasControls, mapAspectControls, getAspectValue, applyAspectRatio } from "@/lib/editorPanelOptions";
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

function Control({ control, value, onChange }: { control: ControlConfig; value: unknown; onChange: (next: unknown) => void }) {
  if (control.type === "switch") {
    const checked = typeof value === "boolean" ? value : control.defaultValue === false ? false : true;
    return (
      <div className="flex items-center justify-between">
        <Label>{control.label}</Label>
        <Switch checked={checked} onCheckedChange={onChange} />
      </div>
    );
  }

  if (control.type === "color") {
    const color = typeof value === "string" ? value : "#ffffff00";
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
                    if (/^#[0-9a-fA-F]{0,8}$/.test(v)) onChange(v);
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
            <HexColorPicker color={color} onChange={onChange} />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  if (control.type === "slider") {
    const num = typeof value === "number" ? value : (typeof control.defaultValue === "number" ? control.defaultValue : 0);
    return (
      <div className="flex flex-col gap-3">
        <Label>{control.label}</Label>
        <Slider
          min={control.min}
          max={control.max}
          step={control.step}
          value={[num]}
          onValueChange={([next]) => onChange(next)}
        />
      </div>
    );
  }

  if (control.type === "buttongroup") {
    const step = control.step ?? 1;
    const def = typeof control.defaultValue === "number" ? control.defaultValue : (control.min ?? 0);
    const num = typeof value === "number" ? value : def;
    return (
      <div className="flex items-center justify-between">
        <Label>{control.label}</Label>
        <ButtonGroup orientation="horizontal" aria-label={control.label} className="h-fit">
          <Button variant="outline" size="icon-sm" onClick={() => onChange(Math.max(control.min ?? 0, num - step))}>
            <MinusIcon />
          </Button>
          <ButtonGroupText className="px-2.5 text-sm tabular-nums">{num}</ButtonGroupText>
          <Button variant="outline" size="icon-sm" onClick={() => onChange(Math.min(control.max ?? 24, num + step))}>
            <PlusIcon />
          </Button>
        </ButtonGroup>
      </div>
    );
  }

  if (control.type === "select") {
    const selected = typeof value === "string"
      ? value
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
              <DropdownMenuItem key={o.value} onSelect={() => onChange(o.value)}>
                {o.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  if (control.type === "options") {
    const current = typeof value === "string"
      ? value
      : (typeof control.defaultValue === "string" ? control.defaultValue : control.options?.[0]?.value ?? "");
    return (
      <div className="flex flex-col gap-2">
        <Label>{control.label}</Label>
        <div className="flex flex-wrap gap-1.5">
          {control.options?.map((o) => (
            <Button key={o.value} variant={o.value === current ? "secondary" : "outline"} size="sm" onClick={() => onChange(o.value)}>
              {o.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

function ControlsGroup({ controls, get, set }: {
  controls: ControlConfig[];
  get: (path: string) => unknown;
  set: (paths: string[], value: unknown) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {controls.map((control) => (
        <Control key={control.label} control={control} value={get(control.targets[0])} onChange={(value) => set(control.targets, value)} />
      ))}
    </div>
  );
}

function LocationRow() {
  const { viewState, setViewState } = useMapProvider();
  const currentText = `${viewState.longitude.toFixed(4)}, ${viewState.latitude.toFixed(4)}`;
  const [value, setValue] = useState(currentText);
  const [copied, setCopied] = useState(false);
  const changed = value !== currentText;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (changed) {
      const [lon, lat] = value.split(",").map((s) => parseFloat(s.trim()));
      if (!isNaN(lon) && !isNaN(lat)) {
        setViewState({ ...viewState, longitude: lon, latitude: lat });
        setValue(`${lon.toFixed(4)}, ${lat.toFixed(4)}`);
        setCopied(false);
      }
    } else {
      copyToClipboard(currentText);
      setCopied(true);
      setTimeout(() => setCopied(false), 400);
    }
  };

  return (
    <form className="flex flex-col gap-1.5" onSubmit={onSubmit}>
      <Label>Location</Label>
      <div className="flex items-center justify-between gap-1">
        <Input value={value} onChange={(e) => setValue(e.target.value)} className="flex-1 h-8 sm:h-8" />
        <Button type="submit" variant="secondary" size="icon-sm">
          {changed ? <HugeiconsIcon icon={CheckmarkBadge02Icon} /> : copied ? <Tick02Icon /> : <CopyIcon />}
        </Button>
      </div>
    </form>
  );
}

function CustomizeMenuList({ onSelect }: { onSelect: (menu: MenuConfig) => void }) {
  return (
    <div className="flex flex-col gap-0">
      {mapMenus.map((menu) => (
        <Button variant="ghost" className="justify-between" key={menu.id} onClick={() => onSelect(menu)}>
          <div className="flex items-center gap-2"><HugeiconsIcon icon={menu.icon} /> {menu.label}</div>
          <ChevronRightIcon />
        </Button>
      ))}
    </div>
  );
}

function ReturnButton({ onClick, className }: { onClick: () => void, className?: string }) {
  return (
    <Button className={cn("w-full justify-start", className)} variant="secondary" onClick={onClick} aria-label="Back">
      <ChevronLeftIcon />
      Return
    </Button>
  );
}

export default function CustomizeSidebar() {
  const [subLevel, setSubLevel] = useState(0);
  const [subMenu, setSubMenu] = useState<MenuConfig | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);

  const { styles, setStyles } = useMapProvider();
  const { editorState, setEditorState, setFocusedElement, elements, updateElement, addElement } = useEditor();

  const canvasEl = elements.find((el) => el.type === "canvas");
  const mapEl = elements.find((el) => el.type === "map");

  const mapGet = (path: string) => getPath(styles, path);
  const mapSet = (paths: string[], value: unknown) => setStyles((prev) => setPaths(prev, paths, value));

  const editorGet = (path: string) => {
    if (path === "canvas.color") return canvasEl?.color;
    if (path === "canvas.aspectRatio") return canvasEl ? getAspectValue(canvasEl) : undefined;
    if (path === "map.aspectRatio") return mapEl ? getAspectValue(mapEl) : undefined;
    return undefined;
  };
  const editorSet = (paths: string[], value: unknown) => {
    const v = String(value);
    if (paths.includes("canvas.color")) updateElement("canvas", { color: v });
    if (paths.includes("canvas.aspectRatio") && canvasEl) updateElement("canvas", applyAspectRatio(canvasEl, v));
    if (paths.includes("map.aspectRatio") && mapEl) updateElement(mapEl.id, applyAspectRatio(mapEl, v));
  };

  const openMenu = (menu: MenuConfig) => {
    setSubMenu(menu);
    setSubLevel(1);
  };

  const exitEditor = () => {
    setEditorState("view");
    setSubLevel(0);
    setFocusedElement(null);
  };

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

  const baseIndex = editorState === "editor" ? 1 : 0;
  const index = subLevel === 0 ? baseIndex : subLevel + 1;

  return (
    <Sidebar variant="floating" collapsible="offcanvas">
      <SidebarContent>
        <div className="relative h-full w-full">
          <TransitionBox activationIndex={0} currentIndex={index}>
            <div className="space-y-2">
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
                  <CustomizeMenuList onSelect={openMenu} />
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
            </div>
          </TransitionBox>

          <TransitionBox activationIndex={1} currentIndex={index}>
            <div className="space-y-2">
              <div className="p-1.5">
                <ReturnButton onClick={exitEditor} />
              </div>
              <SidebarGroup>
                <SidebarGroupContent>
                  <div className="space-y-4">
                    <p className="font-semibold text-center opacity-80">Canvas</p>
                    <ControlsGroup controls={canvasControls} get={editorGet} set={editorSet} />
                  </div>
                </SidebarGroupContent>


              </SidebarGroup>

              <SidebarSeparator />

              <SidebarGroup>
                <SidebarGroupContent>
                  <div className="space-y-4">
                    <p className="font-semibold text-center opacity-80">Map</p>
                    <LocationRow />
                    <div className="flex flex-col gap-1">
                      <Label>Customize</Label>
                      <CustomizeMenuList onSelect={openMenu} />
                    </div>
                    <ControlsGroup controls={mapAspectControls} get={editorGet} set={editorSet} />
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarSeparator />

              <SidebarGroup>
                <p className="text-sm font-semibold uppercase tracking-wide">Text</p>
                <SidebarGroupContent>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const cw = canvasEl?.width ?? 900;
                      const ch = canvasEl?.height ?? 1600;
                      addElement({
                        id: `text-${Date.now()}`,
                        type: "text",
                        name: "Text",
                        zIndex: elements.length + 1,
                        x: cw / 2 - 100,
                        y: ch / 2 - 25,
                        width: 200,
                        height: 50,
                        content: "Text",
                      });
                    }}
                  >
                    Add text
                  </Button>
                </SidebarGroupContent>
              </SidebarGroup>
            </div>
          </TransitionBox>

          <TransitionBox activationIndex={2} currentIndex={index}>
            {subMenu && (
              <div className="p-1.5 space-y-4">
                <ReturnButton onClick={() => setSubLevel(0)} />
                <div className="flex flex-col p-1.5 gap-5">
                  <p className="font-semibold text-center opacity-80">{subMenu.label}</p>
                  <div className="px-2 space-y-4">
                    <ControlsGroup controls={subMenu.controls} get={mapGet} set={mapSet} />
                  </div>
                </div>
                {subMenu.submenu.length > 0 && (
                  <Button variant="secondary" className="justify-end w-full" onClick={() => setSubLevel(2)}>
                    Advanced <ChevronRightIcon />
                  </Button>
                )}
              </div>
            )}
          </TransitionBox>

          <TransitionBox activationIndex={3} currentIndex={index}>
            {subMenu && subMenu.submenu.length > 0 && (
              <div className="p-1.5 space-y-4">
                <ReturnButton onClick={() => setSubLevel(1)} />
                <div className="space-y-5">
                  {subMenu.submenu.map((sub: SubEntityConfig, i) => (
                    <div key={i} className="flex flex-col gap-4 px-2">
                      <p className="font-semibold text-center opacity-80">{sub.label}</p>
                      <ControlsGroup controls={sub.controls} get={mapGet} set={mapSet} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TransitionBox>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}