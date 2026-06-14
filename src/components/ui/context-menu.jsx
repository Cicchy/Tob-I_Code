"use client";;
import { Menu as ArkMenu, useMenuContext } from "@ark-ui/react/menu";
import { cn } from "@/lib/utils";
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
} from "@/components/ui/menu";

export const useContextMenu = useMenuContext;

export const ContextMenu = (props) => (
  <Menu data-slot="context-menu" {...props} />
);

export const ContextMenuTrigger = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkMenu.ContextTrigger
      className={cn("cursor-default", className)}
      data-slot="context-menu-trigger"
      {...rest} />
  );
};

export const ContextMenuContent = (
  props
) => <MenuContent data-slot="context-menu-content" {...props} />;

export const ContextMenuGroup = (
  props
) => <MenuGroup data-slot="context-menu-group" {...props} />;

export const ContextMenuSeparator = (
  props
) => <MenuSeparator data-slot="context-menu-separator" {...props} />;

export const ContextMenuItem = (
  props
) => <MenuItem data-slot="context-menu-item" {...props} />;

export const ContextMenuSub = (props) => (
  <MenuSub data-slot="context-menu-sub" {...props} />
);

export const ContextMenuSubContent = (
  props
) => <MenuSubContent data-slot="context-menu-sub-content" {...props} />;

export const ContextMenuSubTrigger = (
  props
) => <MenuSubTrigger data-slot="context-menu-sub-trigger" {...props} />;

export const ContextMenuShortcut = (
  props
) => <MenuShortcut data-slot="context-menu-shortcut" {...props} />;
