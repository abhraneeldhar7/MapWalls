"use client";

import { Fragment, useState } from "react";
import { ArrowLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransitionBox } from "@/components/shared/transition-box";
import { CATEGORIES } from "@/lib/map-style/categories";
import type { CategoryConfig, Control } from "@/lib/map-style/types";
import { ControlRow } from "./control-row";

function ControlList({ controls }: { controls: Control[] }) {
  return (
    <>
      {controls.map((control, index) => (
        <Fragment key={control.id}>
          {control.group && control.group !== controls[index - 1]?.group && (
            <Label className="pt-3 text-xs text-muted-foreground uppercase">
              {control.group}
            </Label>
          )}
          <ControlRow control={control} />
        </Fragment>
      ))}
    </>
  );
}

function CategorySubMenu({
  category,
  onBack,
}: {
  category: CategoryConfig;
  onBack: () => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const essential = category.controls.filter((control) => !control.advanced);
  const advanced = category.controls.filter((control) => control.advanced);

  return (
    <>
      <div className="flex items-center gap-1 p-2 pb-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Back to categories"
          onClick={onBack}
        >
          <ArrowLeftIcon />
        </Button>
        <span className="text-md">{category.label}</span>
      </div>
      <ScrollArea className="flex-1 px-3 pb-3">
        <div className="flex flex-col divide-y">
          <ControlList controls={essential} />
        </div>
        {advanced.length > 0 && (
          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-full"
              onClick={() => setShowAdvanced((value) => !value)}
            >
              {showAdvanced ? "Hide Advanced" : "Advanced"}
            </Button>
          </div>
        )}
        {showAdvanced && (
          <div className="flex flex-col divide-y pt-1">
            <ControlList controls={advanced} />
          </div>
        )}
      </ScrollArea>
    </>
  );
}

export function CustomizeMenu() {
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
  const activationIndex = categoryIndex === null ? 0 : categoryIndex + 1;

  return (
    <div className="relative h-[420px] w-full overflow-hidden">
      <TransitionBox
        activationIndex={activationIndex}
        currentIndex={0}
        className="absolute inset-0 flex flex-col"
      >
        <div className="flex flex-col gap-0.5 p-2">
          {CATEGORIES.map((category, index) => (
            <Button
              key={category.id}
              variant="ghost"
              size="sm"
              className="h-10 justify-between px-3 text-sm"
              onClick={() => setCategoryIndex(index)}
            >
              {category.label}
              <ChevronRightIcon />
            </Button>
          ))}
        </div>
      </TransitionBox>

      {CATEGORIES.map((category, index) => (
        <TransitionBox
          key={category.id}
          activationIndex={activationIndex}
          currentIndex={index + 1}
          className="absolute inset-0 flex flex-col"
        >
          <CategorySubMenu
            category={category}
            onBack={() => setCategoryIndex(null)}
          />
        </TransitionBox>
      ))}
    </div>
  );
}
