"use client";;
import { Combobox as ArkCombobox, useComboboxContext as useArkComboboxContext } from "@ark-ui/react/combobox";
import { Portal } from "@ark-ui/react/portal";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export const useCombobox = useArkComboboxContext;

export const ComboboxContext = ArkCombobox.Context;

export const Combobox = (props) => {
  const {
    openOnClick = true,
    lazyMount = true,
    unmountOnExit = true,
    ...rest
  } = props;

  return (
    <ArkCombobox.Root
      data-slot="combobox"
      lazyMount={lazyMount}
      openOnClick={openOnClick}
      unmountOnExit={unmountOnExit}
      {...rest} />
  );
};

export const ComboboxControl = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkCombobox.Control
      className={cn(
        "group/combobox-control",
        "relative flex flex-wrap items-center gap-1",
        className
      )}
      data-slot="combobox-control"
      {...rest} />
  );
};

export const ComboboxInput = (props) => {
  const {
    size = "md",
    showTrigger = true,
    showClear = false,
    className,
    children,
    ...rest
  } = props;

  const { inputValue } = useCombobox();

  return (
    <ComboboxControl data-size={size}>
      <InputGroup className={cn(className)} size={size}>
        {children}
        <ArkCombobox.Input asChild>
          <InputGroupInput {...rest} />
        </ArkCombobox.Input>
        <InputGroupAddon align="inline-end">
          {showTrigger && (
            <InputGroupButton
              asChild
              className="group-has-data-[slot=combobox-clear]/input-group:hidden"
              size="icon-xs"
              variant="ghost">
              <ComboboxTrigger />
            </InputGroupButton>
          )}
          {showClear && inputValue && (
            <ComboboxClear asChild>
              <InputGroupButton size="icon-xs" variant="ghost">
                <XIcon />
              </InputGroupButton>
            </ComboboxClear>
          )}
        </InputGroupAddon>
      </InputGroup>
    </ComboboxControl>
  );
};

export const ComboboxTrigger = (
  props
) => {
  const { className, children, ...rest } = props;

  return (
    <ArkCombobox.Trigger
      className={cn("absolute inset-e-1 inset-y-0", className)}
      data-slot="combobox-trigger"
      {...rest}
      asChild>
      {children ?? (
        <Button className="size-4" variant="ghost">
          <ChevronsUpDownIcon />
        </Button>
      )}
    </ArkCombobox.Trigger>
  );
};

export const ComboboxClear = (
  props
) => <ArkCombobox.ClearTrigger data-slot="combobox-clear" {...props} />;

/** Composable combobox input for custom controls (e.g. Tags Input). */
export const ComboboxFieldInput = (
  props
) => <ArkCombobox.Input data-slot="combobox-field-input" {...props} />;

export const ComboboxPositioner = (
  props
) => <ArkCombobox.Positioner data-slot="combobox-positioner" {...props} />;

export const ComboboxContent = (
  props
) => {
  const { className, children, ...rest } = props;

  return (
    <Portal>
      <ComboboxPositioner>
        <ArkCombobox.Content
          className={cn(
            "relative z-50",
            "max-h-96 min-w-48",
            "origin-(--transform-origin)",
            "p-1",
            "bg-popover",
            "text-popover-foreground",
            "rounded-xl border shadow-lg/5",
            "overflow-y-auto",
            "outline-none",
            "data-[state=closed]:animate-out data-[state=open]:animate-in",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=open]:zoom-in-[98%] data-[state=closed]:zoom-out-[98%]",
            "data-[placement=top]:slide-in-from-bottom-2",
            "data-[placement=bottom]:slide-in-from-top-2",
            "data-[placement=right]:slide-in-from-start-2",
            "data-[placement=left]:slide-in-from-end-2",
            "motion-reduce:animate-none!",
            className
          )}
          data-slot="combobox-content"
          {...rest}>
          {children}
        </ArkCombobox.Content>
      </ComboboxPositioner>
    </Portal>
  );
};

export const ComboboxGroup = (props) => {
  const { heading, children, ...rest } = props;

  return (
    <ArkCombobox.ItemGroup data-slot="combobox-group" {...rest}>
      {!!heading && <ComboboxGroupLabel>{heading}</ComboboxGroupLabel>}
      {children}
    </ArkCombobox.ItemGroup>
  );
};

export const ComboboxGroupLabel = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkCombobox.ItemGroupLabel
      className={cn("px-2 py-1.5 font-semibold text-muted-foreground text-xs", className)}
      data-slot="combobox-group-label"
      {...rest} />
  );
};

export const comboboxItemVariants = tv({
  base: [
    "relative",
    "py-1.5 ps-2",
    "text-sm",
    "flex w-full items-center gap-2",
    "rounded-xl",
    "select-none",
    "cursor-default",
    "outline-hidden",
    "data-[=checked]:bg-accent data-[state=checked]:text-accent-foreground",
    "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
    "data-disabled:pointer-events-none data-disabled:opacity-64",
    "[&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  variants: {
    showIndicator: {
      true: "pe-8",
      false: "pe-2",
    },
  },
  defaultVariants: {
    showIndicator: true,
  },
});

export const ComboboxItem = (props) => {
  const { showIndicator = true, className, children, ...rest } = props;

  return (
    <ArkCombobox.Item
      className={cn(comboboxItemVariants({ showIndicator }), className)}
      data-slot="combobox-item"
      persistFocus
      {...rest}>
      {children}
      {showIndicator ? (
        <span className="absolute inset-e-2 flex size-3.5 items-center justify-center">
          <ArkCombobox.ItemIndicator data-slot="combobox-item-indicator">
            <CheckIcon />
          </ArkCombobox.ItemIndicator>
        </span>
      ) : null}
    </ArkCombobox.Item>
  );
};

export const ComboboxEmpty = (
  props
) => {
  const { className, children, ...rest } = props;

  return (
    <ArkCombobox.Empty
      className={cn("px-2 py-1.5", "text-center text-muted-foreground text-sm", className)}
      data-slot="combobox-empty"
      {...rest}>
      {children || "No results found."}
    </ArkCombobox.Empty>
  );
};

export const ComboboxList = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkCombobox.List
      className={cn("flex flex-col", className)}
      data-slot="combobox-list"
      {...rest} />
  );
};
