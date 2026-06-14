"use client";;
import { ark } from "@ark-ui/react/factory";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils";

const kbdVariants = tv({
  base: [
    "h-5 min-w-5",
    "px-1",
    "inline-flex items-center justify-center gap-1",
    "select-none font-medium font-sans text-foreground text-xs",
    "rounded-sm border border-transparent",
    "pointer-events-none",
    "in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background",
    "[&_svg:not([class*='size-'])]:size-3",
  ],
  variants: {
    variant: {
      default: "bg-muted",
      outline: "border border-border",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const Kbd = (props) => {
  const { variant = "default", className, ...rest } = props;

  return (
    <ark.kbd
      className={cn(kbdVariants({ variant }), className)}
      data-slot="kbd"
      {...rest} />
  );
};

export const KbdGroup = (props) => {
  const { className, ...rest } = props;

  return (
    <ark.div
      className={cn("inline-flex items-center gap-1", className)}
      data-slot="kbd-group"
      {...rest} />
  );
};
