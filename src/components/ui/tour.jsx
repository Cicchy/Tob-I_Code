"use client";;
import { Portal } from "@ark-ui/react";
import { ark } from "@ark-ui/react/factory";
import { Tour as ArkTour, useTour } from "@ark-ui/react/tour";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DialogBody, DialogFooter, DialogHeader, dialogOverlayVariants } from "@/components/ui/dialog";

const TourProvider = React.createContext({});

export const Tour = (props) => {
  const { steps = [], lazyMount = true, unmountOnExit = true, ...rest } = props;

  const [isStarted, setIsStarted] = React.useState(false);

  const tour = useTour({ steps });

  React.useEffect(() => {
    if (isStarted) {
      document.body.classList.add("relative");
    } else {
      document.body.classList.remove("relative");
    }

    return () => {
      document.body.classList.remove("relative");
    };
  }, [isStarted]);

  const handleStart = React.useCallback(() => {
    setIsStarted(true);
    tour.start();
  }, [tour]);

  return (
    <TourProvider.Provider value={{ tour, handleStart }}>
      <ArkTour.Root
        data-slot="tour"
        lazyMount={lazyMount}
        tour={tour}
        unmountOnExit={unmountOnExit}
        {...rest} />
    </TourProvider.Provider>
  );
};

export const TourTrigger = (props) => {
  const { onClick, ...rest } = props;

  const { handleStart } = useTourContext();

  const handleClick = (e) => {
    onClick?.(e);
    handleStart();
  };

  return (<ark.button data-slot="tour-trigger" type="button" {...rest} onClick={handleClick} />);
};

export const TourActionTrigger = (
  props
) => <ArkTour.ActionTrigger data-slot="tour-action-trigger" {...props} />;

export const TourOverlay = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkTour.Backdrop
      className={cn(dialogOverlayVariants(), "duration-initial", className)}
      data-slot="tour-overlay"
      {...rest} />
  );
};
export const TourPositioner = (
  props
) => (
  <ArkTour.Positioner
    className={cn(
      "z-50",
      "flex items-center justify-center",
      "data-[type=dialog]:fixed data-[type=dialog]:inset-0",
      "data-[type=tooltip]:absolute"
    )}
    data-slot="tour-positioner"
    {...props} />
);

export const TourContent = (props) => {
  const { showCloseButton = true, className, children, ...rest } = props;

  return (
    <Portal>
      <TourOverlay />
      <TourPositioner>
        <ArkTour.Content
          className={cn(
            "[--space:--spacing(4)]",
            "z-[calc(50+var(--layer-index,0))]",
            "relative",
            "w-full max-w-md",
            "flex flex-col gap-4",
            "bg-background",
            "rounded-lg border shadow-lg",
            "focus:outline-none focus:ring-0",
            "data-[state=closed]:animate-out data-[state=open]:animate-in",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            "motion-reduce:animate-none!",
            className
          )}
          data-slot="tour-content"
          {...rest}>
          {children}

          {!!showCloseButton && (
            <TourClose asChild className="absolute top-4 right-4">
              <Button
                className="size-8 border-none opacity-70 hover:opacity-100"
                size="icon-md"
                variant="ghost">
                <X />

                <span className="sr-only">Close</span>
              </Button>
            </TourClose>
          )}
        </ArkTour.Content>
      </TourPositioner>
      <TourSpotlight />
    </Portal>
  );
};

export const TourBody = (props) => (
  <DialogBody data-slot="tour-body" {...props} />
);

export const TourSpotlight = (
  props
) => (
  <ArkTour.Spotlight
    className="z-50 border-2 border-primary"
    data-slot="tour-spotlight"
    {...props} />
);

export const TourHeader = (
  props
) => <DialogHeader data-slot="tour-header" {...props} />;

export const TourTitle = (
  props
) => {
  const { className, ...rest } = props;

  const { tour } = useTourContext();

  return (
    <ArkTour.Title
      className={cn("font-semibold text-base leading-none tracking-tight", className)}
      data-slot="tour-title"
      {...rest}>
      {tour.step?.title}
    </ArkTour.Title>
  );
};

export const TourDescription = (
  props
) => {
  const { className, ...rest } = props;

  const { tour } = useTourContext();

  return (
    <ArkTour.Description
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="tour-description"
      {...rest}>
      {tour.step?.description}
    </ArkTour.Description>
  );
};

export const TourProgressText = (
  props
) => {
  const { className, ...rest } = props;

  const { tour } = useTourContext();

  return (
    <ArkTour.ProgressText
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="tour-progress-text"
      {...rest}>
      {tour.getProgressText()}
    </ArkTour.ProgressText>
  );
};

export const TourClose = (
  props
) => <ArkTour.CloseTrigger data-slot="tour-close-trigger" {...props} />;

export const TourFooter = (
  props
) => {
  const { children, ...rest } = props;

  return (
    <ArkTour.Control {...rest} asChild>
      <DialogFooter data-slot="tour-control">{children}</DialogFooter>
    </ArkTour.Control>
  );
};

export const TourActions = (
  props
) => {
  const { className, ...rest } = props;

  const { tour } = useTourContext();

  const actions = tour.step?.actions ?? [];

  if (actions.length === 0) {
    return null;
  }

  return (
    <ArkTour.Control {...rest} asChild>
      <DialogFooter
        className={cn("flex flex-wrap gap-2", className)}
        data-slot="tour-actions">
        {actions.map((action) => (
          <TourActionTrigger action={action} asChild key={action.label}>
            <Button
              size="sm"
              variant={
                action.action === "dismiss" || action.action === "prev"
                  ? "outline"
                  : "default"
              }>
              {action.action === "prev" && <ChevronLeft />}
              {action.label}
              {action.action === "next" && <ChevronRight />}
            </Button>
          </TourActionTrigger>
        ))}
      </DialogFooter>
    </ArkTour.Control>
  );
};
export const TourPreviousStep = (
  props
) => {
  const { ...rest } = props;

  const { tour } = useTourContext();

  const prevAction = React.useMemo(
    () => tour.step?.actions?.find((action) => action.action === "prev"),
    [tour]
  );

  if (!prevAction) {
    return null;
  }

  return (
    <TourActionTrigger data-slot="tour-previous-step" {...rest} action={prevAction} asChild>
      <Button size="sm" variant="outline">
        <ChevronLeft />
        {prevAction.label}
      </Button>
    </TourActionTrigger>
  );
};

export const TourNextStep = (
  props
) => {
  const { ...rest } = props;

  const { tour } = useTourContext();

  const action = React.useMemo(() =>
    tour.step?.actions?.find((a) => a.action === "next" || a.action === "dismiss"), [tour]);

  const actionType = React.useMemo(() => action?.action, [action]);

  if (!action) {
    return null;
  }

  return (
    <TourActionTrigger data-slot="tour-next-step" {...rest} action={action} asChild>
      <Button size="sm">
        {action.label}

        {actionType === "next" && <ChevronRight />}
      </Button>
    </TourActionTrigger>
  );
};

export const useTourContext = () => {
  const context = React.use(TourProvider);

  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }

  return context;
};
