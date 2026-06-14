"use client";;
import { Portal } from "@ark-ui/react";
import { Combobox as ArkCombobox } from "@ark-ui/react/combobox";
import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Combobox,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxList,
  comboboxItemVariants,
} from "@/components/ui/combobox";
import {
  Dialog,
  DialogHeader,
  DialogOverlay,
  DialogPositioner,
  DialogTrigger,
  dialogContentVariants,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { MenuShortcut } from "@/components/ui/menu";
import { Separator } from "@/components/ui/separator";

export const CommandDialog = Dialog;

export const CommandDialogTrigger = (
  props
) => <DialogTrigger data-slot="command-dialog-trigger" {...props} />;

export const CommandDialogContent = (props) => {
  const {
    size = "lg",
    title = "Command Palette",
    description = "Search for a command to run...",
    className,
    children,
    ...rest
  } = props;

  return (
    <Portal>
      <DialogOverlay />
      <DialogPositioner>
        <ArkDialog.Content
          className={cn(
            "max-sm:row-start-1",
            dialogContentVariants({ size }),
            "border-0 p-0",
            className
          )}
          data-slot="command-dialog-content"
          {...rest}>
          <DialogHeader className="sr-only" description={description} title={title} />

          {children}
        </ArkDialog.Content>
      </DialogPositioner>
    </Portal>
  );
};

export const Command = (props) => {
  const { lazyMount = true, unmountOnExit = true, className, ...rest } = props;

  return (
    <Combobox
      className={cn(
        "isolate",
        "flex min-h-0 flex-1 flex-col",
        "p-2",
        "bg-popover",
        "text-popover-foreground",
        "rounded-2xl border",
        className
      )}
      closeOnSelect={false}
      disableLayer
      inputBehavior="autohighlight"
      lazyMount={lazyMount}
      loopFocus={false}
      open
      selectionBehavior="clear"
      unmountOnExit={unmountOnExit}
      {...rest} />
  );
};

export const CommandContent = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkCombobox.Content
      className={cn(
        "flex flex-1 flex-col",
        "max-h-(--available-height) min-h-0",
        "-mr-2",
        "outline-none",
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-foreground/20 overflow-auto overscroll-contain",
        "[:not(.has-[+[data-slot=command-footer]])]:rounded-b-2xl [:not(.has-[+[data-slot=command-footer]])]:border-b",
        className
      )}
      data-slot="command-content"
      {...rest} />
  );
};

export const CommandInput = (props) => {
  const { size = "md", className, ...rest } = props;

  return (
    <ComboboxControl className="mb-2">
      <InputGroup className={cn("rounded-xl bg-input/32", className)} size={size} {...rest}>
        <InputGroupAddon>
          <SearchIcon aria-hidden className="opacity-64" />
        </InputGroupAddon>
        <ArkCombobox.Input asChild data-slot="command-input">
          <InputGroupInput autoFocus />
        </ArkCombobox.Input>
      </InputGroup>
    </ComboboxControl>
  );
};

export const CommandList = (props) => {
  const { className, ...rest } = props;

  return (
    <div className="max-h-72 min-h-0 flex-1">
      <ComboboxList
        className={cn("flex-1 pr-2.5", className)}
        data-slot="command-list"
        {...rest} />
    </div>
  );
};

export const CommandEmpty = (
  props
) => {
  const { className, children, ...rest } = props;

  return (
    <ComboboxEmpty
      className={cn("py-6 text-center text-sm", className)}
      data-slot="command-empty"
      {...rest}>
      {children || "No results found."}
    </ComboboxEmpty>
  );
};

export const CommandGroup = (
  props
) => <ComboboxGroup data-slot="command-group" {...props} />;

export const CommandGroupLabel = (
  props
) => <ComboboxGroupLabel data-slot="command-group-label" {...props} />;

export const CommandItem = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkCombobox.Item
      className={cn(comboboxItemVariants({ showIndicator: false }), className)}
      data-slot="command-item"
      persistFocus
      {...rest} />
  );
};

export const CommandSeparator = (props) => {
  const { className, ...rest } = props;

  return (<Separator className={cn("my-2", className)} data-slot="command-separator" {...rest} />);
};

export const CommandShortcut = (
  props
) => <MenuShortcut data-slot="command-shortcut" {...props} />;

export const CommandFooter = (props) => {
  const { className, ...rest } = props;

  return (
    <div
      className={cn(
        "z-10",
        "flex items-center justify-between gap-2",
        "-m-2 mt-2 px-4 py-3",
        "bg-muted/48",
        "text-muted-foreground text-xs",
        "rounded-b-[calc(var(--radius-2xl,1rem)-1px)] border-t",
        className
      )}
      data-slot="command-footer"
      {...rest} />
  );
};
