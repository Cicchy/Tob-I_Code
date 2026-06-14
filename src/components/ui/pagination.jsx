"use client";;
import {
  Pagination as ArkPagination,
  usePaginationContext,
} from "@ark-ui/react/pagination";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const usePagination = usePaginationContext;

export const Pagination = (props) => {
  const { className, ...rest } = props;

  return (
    <ArkPagination.Root
      className={cn("mx-auto", "w-full", "flex justify-center gap-1", className)}
      data-slot="pagination"
      {...rest} />
  );
};

export const PaginationPrevious = (
  props
) => (
  <ArkPagination.PrevTrigger asChild data-slot="pagination-previous" {...props}>
    <Button variant="ghost">
      <ChevronLeft />
      Previous
    </Button>
  </ArkPagination.PrevTrigger>
);

export const PaginationNext = (
  props
) => (
  <ArkPagination.NextTrigger asChild data-slot="pagination-next" {...props}>
    <Button variant="ghost">
      Next
      <ChevronRight />
    </Button>
  </ArkPagination.NextTrigger>
);

export const PaginationItem = (
  props
) => {
  const { className, children, ...rest } = props;

  return (
    <ArkPagination.Item asChild data-slot="pagination-item" {...rest}>
      <Button
        className={cn(
          "tabular-nums",
          "data-selected:not-[hover]:bg-transparent dark:data-selected:not-[hover]:bg-input/30",
          "data-selected:not-[hover]:text-foreground",
          "data-selected:not-[hover]:border-input",
          className
        )}
        size="icon-md"
        variant="ghost">
        {children}
      </Button>
    </ArkPagination.Item>
  );
};

export const PaginationItems = (
  props
) => (
  <ArkPagination.Context data-slot="pagination-item s" {...props}>
    {({ pages }) =>
      pages.map((page, index) =>
        page.type === "page" ? (
          <PaginationItem key={page.value} type="page" value={page.value}>
            {page.value}
          </PaginationItem>
        ) : (
          <PaginationEllipsis index={index} key={`ellipsis-${index}`} />
        ))
    }
  </ArkPagination.Context>
);

export const PaginationItemLink = (props) => {
  const { page, children, ...rest } = props;

  const pagination = usePaginationContext();

  const pageValue = () => {
    if (page === "previous") {
      return pagination.previousPage;
    }

    if (page === "next") {
      return pagination.nextPage;
    }

    return page;
  };

  if (typeof page === "number") {
    return (
      <Button asChild variant="outline" {...rest}>
        <a href={`?page=${pageValue()}`}>{children}</a>
      </Button>
    );
  }

  return (
    <Button asChild variant="ghost" {...rest}>
      <a href={`?page=${pageValue()}`}>{children}</a>
    </Button>
  );
};

export const PaginationEllipsis = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkPagination.Ellipsis
      className={cn(
        "h-8 w-12",
        "flex items-end justify-center",
        "text-muted-foreground",
        "pointer-events-none select-none",
        "[&_svg]:size-4",
        className
      )}
      data-slot="pagination-ellipsis"
      {...rest}>
      <Ellipsis />
    </ArkPagination.Ellipsis>
  );
};
