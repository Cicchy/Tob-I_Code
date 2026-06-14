"use client";;
import { ark, Presence } from "@ark-ui/react";
import React from "react";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils";

const HintContext = React.createContext({});

const defaultPositioning = {
  placement: "top",
  gutter: "10px"
};

export const Hint = (props) => {
  const {
    positioning,
    className,
    children,
    defaultOpen = false,
    onOpenChange,
    open: openProp,
    ...rest
  } = props;

  const positioningValue = {
    ...defaultPositioning,
    ...positioning,
  };

  const hintId = `hint${React.useId()}`;

  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isVisible = isControlled ? openProp : uncontrolledOpen;

  const setOpen = React.useCallback((next) => {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  return (
    <HintContext.Provider
      value={{
        isVisible,
        positioning: positioningValue,
        setIsVisible: setOpen,
        id: hintId,
      }}>
      <ark.div
        aria-describedby={hintId}
        className={cn("relative", className)}
        data-placement={positioningValue.placement}
        data-slot="hint"
        data-state={isVisible ? "open" : "closed"}
        style={
          {
            "--gutter": positioningValue.gutter
          }
        }
        {...rest}>
        {children}
      </ark.div>
    </HintContext.Provider>
  );
};

export const HintTrigger = (props) => {
  const { className, children, ...rest } = props;

  const { isVisible, setIsVisible, id } = _useHint();

  return (
    <ark.button
      aria-describedby={id}
      data-slot="hint-trigger"
      data-state={isVisible ? "open" : "closed"}
      onBlur={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      {...rest}>
      {children}
    </ark.button>
  );
};

const hintContentVariants = tv({
  base: [
    "absolute z-50",
    "w-fit min-w-max",
    "px-3 py-1.5",
    "bg-foreground",
    "text-background text-xs",
    "rounded-lg shadow-md/5",
    "fade-in-0 zoom-in-[98%] animate-in",
    "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[98%] data-[state=closed]:animate-out",
    "motion-reduce:animate-none!",
  ],
  variants: {
    placement: {
      bottom: [
        "inset-s-1/2 top-full -translate-x-1/2",
        "mt-(--gutter)",
        "data-[state=open]:slide-in-from-top-5 origin-bottom",
      ],
      right: [
        "inset-s-full top-1/2 ms-(--gutter) -translate-y-1/2",
        "ms-(--gutter)",
        "data-[state=open]:slide-in-from-start-5 origin-end",
      ],
      left: [
        "inset-e-full top-1/2 me-(--gutter) -translate-y-1/2",
        "me-(--gutter)",
        "data-[state=open]:slide-in-from-end-5 origin-start",
      ],
      top: [
        "inset-s-1/2 bottom-full mb-(--gutter) -translate-x-1/2",
        "mb-(--gutter)",
        "data-[state=open]:slide-in-from-bottom-5 origin-top",
      ],
    },
  },
  defaultVariants: {
    placement: "top",
  },
});

export const HintContent = (props) => {
  const {
    lazyMount = true,
    unmountOnExit = true,
    className,
    children,
    ...rest
  } = props;

  const { positioning, isVisible, id } = _useHint();

  return (
    <Presence
      asChild
      lazyMount={lazyMount}
      present={isVisible}
      unmountOnExit={unmountOnExit}>
      <ark.div
        className={cn(hintContentVariants({ placement: positioning.placement }), className)}
        data-placement={positioning.placement}
        data-slot="hint-content"
        data-state={isVisible ? "open" : "closed"}
        id={id}
        role="tooltip"
        {...rest}>
        {children}
        <HintArrow />
      </ark.div>
    </Presence>
  );
};

const hintArrowVariants = tv({
  base: "absolute rotate-225",
  variants: {
    placement: {
      bottom: ["inset-s-1/2 -top-0.5 -translate-x-1/2"],
      top: ["inset-s-1/2 -bottom-0.5 -translate-x-1/2"],
      right: ["-inset-s-0.5 top-1/2 -translate-y-1/2"],
      left: ["-inset-e-0.5 top-1/2 -translate-y-1/2"],
    },
  },
});

export const HintArrow = (props) => {
  const { className, ...rest } = props;

  const { positioning } = _useHint();

  return (
    <ark.div
      className={cn(hintArrowVariants({ placement: positioning.placement }), className)}
      data-placement={positioning.placement}
      data-slot="hint-arrow"
      {...rest}>
      <ark.div className="size-2 bg-foreground" data-slot="hint-arrow-tip" />
    </ark.div>
  );
};

const _useHint = () => {
  const context = React.useContext(HintContext);

  if (!context) {
    throw new Error("useHint must be used within a Hint");
  }

  return context;
};
