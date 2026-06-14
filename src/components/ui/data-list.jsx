"use client";;
import { ark } from "@ark-ui/react/factory";
import { cn } from "@/lib/utils";

export const DataList = (props) => {
  const { orientation = "horizontal", className, children, ...rest } = props;

  return (
    <ark.dl
      className={cn("group/data-list", "flex flex-col gap-1", "text-sm", className)}
      data-orientation={orientation}
      data-slot="data-list"
      {...rest}>
      {children}
    </ark.dl>
  );
};

export const DataListItem = (props) => {
  const { className, ...rest } = props;

  return (
    <ark.div
      className={cn(
        "flex gap-4 py-2",
        "group-data-[orientation=horizontal]/data-list:flex-row group-data-[orientation=horizontal]/data-list:items-center",
        "group-data-[orientation=vertical]/data-list:flex-col group-data-[orientation=vertical]/data-list:gap-1",
        className
      )}
      data-slot="data-list-item"
      {...rest} />
  );
};

export const DataListItemLabel = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ark.dt
      className={cn(
        "min-w-24 shrink-0",
        "font-medium text-muted-foreground",
        "group-data-[orientation=vertical]/data-list:min-w-0",
        className
      )}
      data-slot="data-list-item-label"
      {...rest} />
  );
};

export const DataListItemValue = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ark.dd
      className={cn("flex-1", "text-foreground", className)}
      data-slot="data-list-item-value"
      {...rest} />
  );
};
