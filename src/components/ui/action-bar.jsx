"use client";;
import { Portal } from "@ark-ui/react";
import { ark } from "@ark-ui/react/factory";
import { Presence } from "@ark-ui/react/presence";
import React from "react";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ActionBarContext = React.createContext({});

const defaultPositioning = {
  placement: "bottom",
  gutter: "16px"
};

export const ActionBar = (props) => {
  const {
    open,
    defaultOpen = false,
    closeOnEscape = true,
    positioning,
    lazyMount = true,
    unmountOnExit = true,
    onOpenChange,
    ...rest
  } = props;

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleClose = React.useCallback(() => {
    if (!isControlled) {
      setInternalOpen(false);
    }

    onOpenChange?.(false);
  }, [isControlled, onOpenChange]);

  const handleOpen = React.useCallback(() => {
    if (!isControlled) {
      setInternalOpen(true);
    }

    onOpenChange?.(true);
  }, [isControlled, onOpenChange]);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!closeOnEscape) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      if (event.defaultPrevented) {
        return;
      }

      event.preventDefault();
      handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeOnEscape, handleClose, isOpen]);

  const context = React.useMemo(() => ({
    onClose: handleClose,
    onOpen: handleOpen,
    isOpen,
    positioning: { ...defaultPositioning, ...positioning },
    lazyMount,
    unmountOnExit,
  }), [handleClose, handleOpen, isOpen, lazyMount, unmountOnExit, positioning]);

  return <ActionBarContext.Provider value={context} {...rest} />;
};

export const ActionBarTrigger = (props) => {
  const { onClick, ...rest } = props;

  const { onOpen, isOpen } = _useActionBar();

  const handleClick = (event) => {
    onOpen?.();
    onClick?.(event);
  };

  return (
    <ark.button
      aria-expanded={isOpen}
      data-slot="action-bar-trigger"
      data-state={isOpen ? "open" : "closed"}
      onClick={handleClick}
      type="button"
      {...rest} />
  );
};

const actionBarPositionerVariants = tv({
  base: [
    "fixed inset-x-0 bottom-0 z-50",
    "flex",
    "px-4 pb-[calc(var(--gutter)+env(safe-area-inset-bottom,0))]",
    "pointer-events-none",
    "data-[state=closed]:animate-out data-[state=open]:animate-in",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2",
    "motion-reduce:animate-none!",
  ],
  variants: {
    placement: {
      bottom: "justify-center",
      "bottom-end": "justify-end",
      "bottom-start": "justify-start",
    },
  },
  defaultVariants: {
    placement: "bottom",
  },
});

export const ActionBarContent = (props) => {
  const { "aria-labelledby": ariaLabelledby, className, ...rest } = props;

  const { isOpen, lazyMount, unmountOnExit, positioning } = _useActionBar();

  const placement = positioning.placement;
  const gutter = positioning.gutter;

  return (
    <Portal>
      <Presence
        asChild
        lazyMount={lazyMount}
        present={isOpen}
        unmountOnExit={unmountOnExit}>
        <ark.div
          className={cn(actionBarPositionerVariants({ placement }))}
          data-placement={placement}
          data-slot="action-bar-positioner"
          style={{
            "--gutter": gutter
          }}>
          <ark.div
            aria-labelledby={ariaLabelledby}
            className={cn(
              "[--space:--spacing(2)]",
              "flex w-fit items-center gap-1",
              "rounded-xl border shadow-lg/5",
              "px-[calc(var(--space)+2px)] py-(--space)",
              "bg-popover",
              "text-popover-foreground",
              "pointer-events-auto",
              className
            )}
            data-slot="action-bar-content"
            role="toolbar"
            {...rest} />
        </ark.div>
      </Presence>
    </Portal>
  );
};

export const ActionBarSeparator = (props) => {
  const { className, ...rest } = props;

  return (
    <Separator
      className={cn("mx-1 h-1/2", className)}
      data-slot="action-bar-separator"
      orientation="vertical"
      {...rest} />
  );
};

export const ActionBarClose = (props) => {
  const { className, onClick, ...rest } = props;

  const { onClose, isOpen } = _useActionBar();

  const handleClick = (event) => {
    onClose?.();
    onClick?.(event);
  };

  return (
    <ark.button
      aria-label="Close"
      className={cn(
        "opacity-64 transition-opacity",
        "hover:opacity-100",
        "motion-reduce:transition-none!",
        className
      )}
      data-slot="action-bar-close"
      data-state={isOpen ? "open" : "closed"}
      onClick={handleClick}
      type="button"
      {...rest} />
  );
};

export const ActionBarValue = (props) => {
  const { label, count = 0, className, children, ...rest } = props;

  return (
    <Badge
      className={cn("shrink-0 font-medium text-sm tabular-nums", className)}
      data-slot="action-bar-value"
      variant="secondary"
      {...rest}>
      {children ?? label ?? count}
    </Badge>
  );
};

export const ActionBarBody = (props) => {
  const { className, ...rest } = props;

  return (
    <ark.div
      className={cn(
        "flex items-center gap-1",
        "**:data-[slot=action-bar-separator]:h-2",
        className
      )}
      {...rest} />
  );
};

const _useActionBar = () => {
  const context = React.useContext(ActionBarContext);

  if (!context) {
    throw new Error("useActionBar must be used within a ActionBarProvider.");
  }

  return context;
};
