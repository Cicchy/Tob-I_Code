"use client";;
import { ark } from "@ark-ui/react/factory";
import { cn } from "@/lib/utils";

export const AspectRatio = (props) => {
  const { className, ...rest } = props;

  return (
    <ark.div
      className={cn("[--ratio:1]", "relative", "w-full", "aspect-(--ratio)", className)}
      data-slot="aspect-ratio"
      {...rest} />
  );
};
