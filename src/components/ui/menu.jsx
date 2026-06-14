"use client";;
import { Portal } from "@ark-ui/react";
import { ark } from "@ark-ui/react/factory";
import { Menu as ArkMenu, useMenuContext } from "@ark-ui/react/menu";
import { CheckIcon, ChevronRight } from "lucide-react";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils";

export const useMenu = useMenuContext;

export const Menu = (props) => {
  const {
    lazyMount = true,
    positioning = { placement: "bottom-end" },
    unmountOnExit = true,
    ...rest
  } = props;

  return (
    <ArkMenu.Root
      data-slot="menu"
      lazyMount={lazyMount}
      positioning={positioning}
      unmountOnExit={unmountOnExit}
      {...rest} />
  );
};

export const MenuTrigger = (
  props
) => <ArkMenu.Trigger data-slot="menu-trigger" {...props} />;

export const MenuPositioner = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkMenu.Positioner
      className={cn("outline-none", className)}
      data-slot="menu-positioner"
      {...rest} />
  );
};

export const menuContentVariants = tv({
  base: [
    "z-[1000]",
    "max-h-(--available-height) not-[class*='w-']:min-w-32",
    "p-1",
    "bg-popover",
    "text-popover-foreground",
    "rounded-xl border shadow-lg/5",
    "origin-(--transform-origin)",
    "outline-none",
    "overflow-y-auto",
    "duration-100",
    "data-[state=open]:animate-in",
    "data-[state=open]:fade-in-0",
    "data-[state=open]:zoom-in-[98%]",
    "data-[placement=bottom]:slide-in-from-top-2",
    "data-[placement=left]:slide-in-from-end-2",
    "data-[placement=right]:slide-in-from-start-2",
    "data-[placement=top]:slide-in-from-bottom-2",
    "motion-reduce:animate-none!",
  ],
});

export const MenuContent = (props) => {
  const { className, children, ...rest } = props;

  return (
    <Portal>
      <MenuPositioner>
        <ArkMenu.Content
          className={cn(menuContentVariants(), className)}
          data-slot="menu-content"
          {...rest}>
          {children}
        </ArkMenu.Content>
      </MenuPositioner>
    </Portal>
  );
};

export const MenuGroup = (props) => {
  const { heading, children, ...rest } = props;

  return (
    <ArkMenu.ItemGroup data-slot="menu-group" {...rest}>
      {!!heading && <MenuGroupLabel>{heading}</MenuGroupLabel>}
      {children}
    </ArkMenu.ItemGroup>
  );
};

export const MenuSeparator = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkMenu.Separator
      className={cn("my-1 h-px bg-border", className)}
      data-slot="menu-separator"
      {...rest} />
  );
};

const menuItemVariants = tv({
  base: [
    "group/menu-item",
    "relative",
    "w-full",
    "px-2.5 py-1.5",
    "flex items-center gap-2",
    "select-none text-sm",
    "rounded-lg",
    "outline-hidden",
    "group-data-[date=open]/trigger-item:bg-accent group-data-[date=open]/trigger-item:text-accent-foreground",
    "data-disabled:pointer-events-none data-disabled:opacity-64",
    "[&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  variants: {
    variant: {
      default: [
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      ],
      destructive: [
        "text-destructive dark:text-destructive-foreground",
        "data-highlighted:bg-destructive/10 dark:data-highlighted:bg-destructive-foreground/10",
        "**:[svg]:text-destructive! dark:**:[svg]:text-destructive-foreground!",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const MenuItem = (props) => {
  const { variant = "default", className, ...rest } = props;

  return (
    <ArkMenu.Item
      className={cn(menuItemVariants({ variant }), className)}
      data-variant={variant}
      {...rest} />
  );
};

export const MenuQuickItem = (props) => {
  const { variant = "default", className, ...rest } = props;

  return (
    <ArkMenu.Item
      className={cn(
        menuItemVariants({ variant }),
        "flex-col gap-1",
        "[&_svg:not([class*='size-'])]:size-4.5",
        className
      )}
      {...rest} />
  );
};

export const MenuCheckboxItem = (
  props
) => {
  const { className, children, ...rest } = props;

  return (
    <ArkMenu.CheckboxItem
      className={cn(menuItemVariants({ variant: "default" }), "ps-8", className)}
      {...rest}>
      <ArkMenu.ItemIndicator
        className="pointer-events-none absolute inset-s-2 flex size-3.5 items-center justify-center">
        <CheckIcon />
      </ArkMenu.ItemIndicator>
      <ArkMenu.ItemText>{children}</ArkMenu.ItemText>
    </ArkMenu.CheckboxItem>
  );
};

export const MenuRadioGroup = (props) => {
  const { heading, children, ...rest } = props;

  return (
    <ArkMenu.RadioItemGroup data-slot="menu-radio-group" {...rest}>
      {!!heading && <MenuGroupLabel>{heading}</MenuGroupLabel>}
      {children}
    </ArkMenu.RadioItemGroup>
  );
};

export const MenuGroupLabel = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkMenu.ItemGroupLabel
      className={cn(
        "px-2 py-1.5",
        "font-medium text-muted-foreground text-sm",
        "pointer-events-none",
        className
      )}
      data-slot="menu-group-label"
      {...rest} />
  );
};

export const MenuRadioItem = (
  props
) => {
  const { className, children, ...rest } = props;

  return (
    <ArkMenu.RadioItem
      className={cn(menuItemVariants({ variant: "default" }), "ps-8", className)}
      data-slot="menu-radio-item"
      {...rest}>
      <ArkMenu.ItemIndicator
        className="pointer-events-none absolute inset-s-2 flex size-3.5 items-center justify-center">
        <CheckIcon />
      </ArkMenu.ItemIndicator>
      <ArkMenu.ItemText data-slot="menu-radio-item-text">
        {children}
      </ArkMenu.ItemText>
    </ArkMenu.RadioItem>
  );
};

export const MenuSub = (props) => (
  <Menu data-slot="menu-sub" {...props} />
);

export const MenuSubContent = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <Portal>
      <MenuPositioner data-slot="menu-sub-positioner">
        <ArkMenu.Content
          className={cn(menuContentVariants(), className)}
          data-slot="menu-sub-content"
          {...rest} />
      </MenuPositioner>
    </Portal>
  );
};

export const MenuSubTrigger = (
  props
) => {
  const { className, children, ...rest } = props;

  return (
    <ArkMenu.TriggerItem
      className={cn(menuItemVariants({ variant: "default" }), className)}
      data-slot="menu-sub-trigger"
      {...rest}>
      {children}
      <MenuShortcut>
        <ChevronRight />
      </MenuShortcut>
    </ArkMenu.TriggerItem>
  );
};

export const MenuShortcut = (props) => {
  const { className, ...rest } = props;

  return (
    <ark.span
      className={cn(
        "ms-auto rtl:me-auto",
        "text-muted-foreground text-xs tracking-widest",
        "group-data-highlighted/menu-item:group-data-[variant=destructive]/menu-item:text-destructive dark:group-data-highlighted/menu-item:group-data-[variant=destructive]/menu-item:text-destructive-foreground",
        className
      )}
      data-slot="menu-shortcut"
      {...rest} />
  );
};

export const MenuArrow = (
  props
) => {
  const { style, ...rest } = props;

  return (
    <ArkMenu.Arrow
      style={
        {
          "--arrow-background": "var(--popover)",
          "--arrow-size": "calc(1.5 * var(--spacing))",
          ...style,
          left: "20px"
        }
      }
      {...rest}>
      <ArkMenu.ArrowTip className="border-s border-t" />
    </ArkMenu.Arrow>
  );
};
