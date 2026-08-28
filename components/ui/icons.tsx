"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import * as H from "@hugeicons/core-free-icons";

type IconSvgObject = ReadonlyArray<readonly [string, { readonly [key: string]: string | number }]>;

function makeIcon(icon: IconSvgObject) {
  return function Icon(props: { className?: string }) {
    return <HugeiconsIcon strokeWidth={2} icon={icon} className={props.className} />;
  };
}

export const CheckIcon = makeIcon(H.CheckIcon);
export const ChevronDownIcon = makeIcon(H.ChevronDownIcon);
export const ChevronUpIcon = makeIcon(H.ChevronUpIcon);
export const ChevronRightIcon = makeIcon(H.ChevronRightIcon);
export const ChevronLeftIcon = makeIcon(H.ChevronLeftIcon);
export const XIcon = makeIcon(H.XIcon);
export const CopyIcon = makeIcon(H.CopyIcon);
export const MinusIcon = makeIcon(H.MinusIcon);
export const PlusIcon = makeIcon(H.PlusIcon);
export const LoaderCircle = makeIcon(H.LoaderCircleIcon);
export const Loader2Icon = makeIcon(H.LoaderIcon);
export const SearchIcon = makeIcon(H.Search01Icon);
export const PanelLeftIcon = makeIcon(H.PanelLeftIcon);
export const InfoIcon = makeIcon(H.InfoIcon);
export const TriangleAlertIcon = makeIcon(H.TriangleAlertIcon);
export const CircleCheckIcon = makeIcon(H.CircleCheckIcon);
export const OctagonXIcon = makeIcon(H.OctagonXIcon);
export const Location05Icon = makeIcon(H.Location05Icon);
export const Tick02Icon = makeIcon(H.Tick02Icon);
export const CheckmarkBadge02Icon = makeIcon(H.CheckmarkBadge02Icon)

export { HugeiconsIcon };