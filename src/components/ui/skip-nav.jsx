"use client";;
import { ark } from "@ark-ui/react/factory";
import { cn } from "@/lib/utils";

const SKIP_NAV_ID = "skip-nav-content";

export const SkipNavLink = (props) => {
  const { id = SKIP_NAV_ID, className, children, ...rest } = props;

  return (
    <ark.a
      className={cn(
        "focus:fixed focus:inset-s-4 focus:top-4 focus:z-9999",
        "focus:px-4 focus:py-2",
        "focus:bg-primary",
        "focus:text-primary-foreground focus:text-sm",
        "sr-only focus:not-sr-only",
        "focus:rounded-lg",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        className
      )}
      data-slot="skip-nav-link"
      href={`#${id}`}
      {...rest}>
      {children ?? "Skip to content"}
    </ark.a>
  );
};

export const SkipNavContent = (props) => {
  const { id = SKIP_NAV_ID, className, ...rest } = props;

  return (
    <ark.div
      className={cn("outline-none", className)}
      data-slot="skip-nav-content"
      id={id}
      tabIndex={-1}
      {...rest} />
  );
};
