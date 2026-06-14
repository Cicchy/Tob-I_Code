"use client";;
import { ark } from "@ark-ui/react/factory";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Breadcrumb = (props) => {
  const { "aria-label": ariaLabel = "Breadcrumb", ...rest } = props;

  return <ark.nav aria-label={ariaLabel} data-slot="breadcrumb" {...rest} />;
};

export const BreadcrumbList = (props) => {
  const { className, ...rest } = props;

  return (
    <ark.ol
      className={cn(
        "flex flex-wrap items-center gap-1.5 sm:gap-2.5",
        "wrap-break-word text-muted-foreground text-sm",
        className
      )}
      data-slot="breadcrumb-list"
      role="list"
      {...rest} />
  );
};

export const BreadcrumbItem = (props) => {
  const { className, ...rest } = props;

  return (
    <ark.li
      className={cn("inline-flex items-center gap-1.5", className)}
      data-slot="breadcrumb-item"
      {...rest} />
  );
};

export const BreadcrumbLink = (props) => {
  const { className, ...rest } = props;

  return (
    <ark.a
      className={cn(
        "text-nowrap",
        "rounded-md border border-transparent",
        "transition-colors",
        "hover:text-foreground",
        "outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/32 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "motion-reduce:transition-none!",
        className
      )}
      data-slot="breadcrumb-link"
      {...rest} />
  );
};

export const BreadcrumbPage = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ark.span
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      data-slot="breadcrumb-page"
      {...rest} />
  );
};

export const BreadcrumbSeparator = (
  props
) => {
  const { children, className, ...rest } = props;

  return (
    <ark.li
      aria-hidden="true"
      className={cn("opacity-64 [&_svg]:size-4", className)}
      data-slot="breadcrumb-separator"
      role="presentation"
      {...rest}>
      {children ?? <ChevronRightIcon />}
    </ark.li>
  );
};

export const BreadcrumbEllipsis = (
  props
) => (
  <ark.span
    aria-hidden="true"
    data-slot="breadcrumb-ellipsis"
    role="presentation"
    {...props}>
    <MoreHorizontalIcon className="size-4" />
  </ark.span>
);
