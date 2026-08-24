"use client";

import { SlidersHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CustomizeMenu } from "./customize-menu";

export function CustomizeButton() {
  return (
    <div className="fixed bottom-4 left-[50%] z-5 translate-x-[-50%]">
      <Popover>
        <div className="flex items-center rounded-[10px] bg-background p-[2px] shadow-sm">
          <PopoverTrigger asChild>
            <Button variant="ghost" className="gap-2 rounded-lg text-sm">
              <SlidersHorizontalIcon />
              Customize
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          side="top"
          align="center"
          className="w-[320px] gap-0 overflow-hidden rounded-xl p-0"
        >
          <CustomizeMenu />
        </PopoverContent>
      </Popover>
    </div>
  );
}
