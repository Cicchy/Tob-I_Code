"use client";;
import {
  Clipboard as ArkClipboard,
  useClipboardContext,
} from "@ark-ui/react/clipboard";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils";
import { inputVariants } from "@/components/ui/input";

export const useClipboard = useClipboardContext;

export const Clipboard = (props) => {
  const { rootClassName, className, children, ...rest } = props;

  return (
    <ArkClipboard.Root className={cn(rootClassName)} data-slot="clipboard" {...rest}>
      <ArkClipboard.Control
        className={cn("flex items-center gap-2", className)}
        data-slot="clipboard-control">
        {children}
      </ArkClipboard.Control>
    </ArkClipboard.Root>
  );
};

export const ClipboardTrigger = (
  props
) => <ArkClipboard.Trigger data-slot="clipboard-trigger" {...props} />;

export const ClipboardInput = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkClipboard.Input
      className={cn(inputVariants(), className)}
      data-slot="clipboard-input"
      {...rest} />
  );
};

const clipboardValueVariants = tv({
  base: [
    "inline-flex items-center",
    "px-3",
    "bg-transparent dark:bg-input/30",
    "text-base md:text-sm",
    "rounded-lg border border-input shadow-sm/5",
  ],
  variants: {
    size: {
      xs: "h-6",
      sm: "h-7",
      md: "h-8",
      lg: "h-9",
      xl: "h-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const ClipboardValue = (props) => {
  const { size, className, ...rest } = props;

  return (
    <ArkClipboard.ValueText
      className={cn(clipboardValueVariants({ size }), className)}
      data-slot="clipboard-value"
      {...rest} />
  );
};

export const ClipboardIndicator = (
  props
) => {
  const { copied = <CheckIcon />, className, children, ...rest } = props;

  return (
    <ArkClipboard.Indicator
      className={cn("pointer-events-none", className)}
      copied={copied}
      data-slot="clipboard-indicator"
      {...rest}>
      {children || <ClipboardIcon />}
    </ArkClipboard.Indicator>
  );
};
