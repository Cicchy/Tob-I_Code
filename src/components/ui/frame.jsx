"use client";;
import { ark } from "@ark-ui/react/factory";
import { cn } from "@/lib/utils";

export const Frame = (props) => {
  const { className, ...rest } = props;

  return (
    <ark.div
      className={cn(
        "relative",
        "p-1",
        "flex flex-col",
        "bg-muted/72",
        "rounded-2xl",
        "*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-1",
        className
      )}
      data-slot="frame"
      {...rest} />
  );
};

export const FramePanel = (props) => {
  const { className, ...rest } = props;

  return (
    <ark.div
      className={cn(
        "relative",
        "p-5",
        "bg-background",
        "rounded-xl border shadow-xs/5",
        className
      )}
      data-slot="frame-panel"
      {...rest} />
  );
};

export const FrameHeader = (props) => {
  const { title, description, className, children, ...rest } = props;

  return (
    <ark.header
      className={cn("flex flex-col", "px-5 py-4", className)}
      data-slot="frame-panel-header"
      {...rest}>
      {!!title && <FrameTitle>{title}</FrameTitle>}
      {!!description && <FrameDescription>{description}</FrameDescription>}
      {!title && typeof children === "string" ? (
        <FrameTitle>{children}</FrameTitle>
      ) : (
        children
      )}
    </ark.header>
  );
};

export const FrameTitle = (props) => {
  const { className, ...rest } = props;

  return (
    <ark.div
      className={cn("font-semibold text-sm", className)}
      data-slot="frame-panel-title"
      {...rest} />
  );
};

export const FrameDescription = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ark.div
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="frame-panel-description"
      {...rest} />
  );
};

export const FrameFooter = (props) => {
  const { className, ...rest } = props;

  return (
    <ark.footer
      className={cn("px-5 py-4", className)}
      data-slot="frame-panel-footer"
      {...rest} />
  );
};
