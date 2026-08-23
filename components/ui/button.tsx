import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { LoaderCircle } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-sm border border-transparent bg-clip-padding font-[400] whitespace-nowrap transition-all outline-none select-none  disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:transition-all [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[16px] duration-default leading-[1em] cursor-pointer disabled:opacity-70 opacity-100",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/80 active:bg-foreground/90",
        outline:
          "border-border border bg-background/20 hover:bg-background/40 active-hover:bg-background/40 backdrop-blur-[3px] hover:backdrop-blur-[7px] active-hover:backdrop-blur-[5px] hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-foreground/12 active:bg-secondary/60 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground border-foreground/12",
        ghost:
          "hover:bg-muted text-foreground hover:text-foreground active:bg-muted aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/70 disabled:hover:bg-[unset] dark:disabled:hover:bg-[unset] border-0 [&_svg]:opacity-70 [&_svg]:group-hover/button:text-foreground",
        destructive:
          "bg-destructive text-[white] hover:bg-destructive/70",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-12 sm:h-10 gap-2 text-sm px-4 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-7 gap-1 rounded-xs px-3 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 sm:h-8 gap-2 rounded-xs px-2.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-[14px] justify-start",
        lg: "h-16 md:h-14 text-md md:text-base gap-3 px-5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-4.5 [&_svg:not([class*='size-'])]:mb-1 rounded-md sm:rounded-sm",
        icon: "h-11 sm:h-10 aspect-square rounded-sm text-foreground shrink-0 [&_svg:not([class*='size-'])]:size-[16px] [&_svg]:opacity-70 hover:[&_svg]:opacity-100 [&_svg]:transition-all",
        "icon-xs":
          "size-[22px] rounded-[min(var(--radius-xs),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-[10px]",
        "icon-sm":
          "size-8 rounded-sm [&_svg:not([class*='size-'])]:size-[14px]",
        "icon-lg": "size-20 [&_svg:not([class*='size-'])]:size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      aria-busy={loading}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle className="animate-spin" /> : children}
    </Comp>
  )
}

export { Button, buttonVariants }
