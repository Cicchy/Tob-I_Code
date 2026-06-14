"use client";;
import { ark } from "@ark-ui/react/factory";
import {
  TreeView as ArkTreeView,
  createTreeCollection as arkCreateTreeCollection,
  useTreeViewContext as useArkTreeViewContext,
} from "@ark-ui/react/tree-view";
import {
  CheckIcon,
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  MinusIcon,
} from "lucide-react";
import React from "react";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils";
import { checkboxVariants } from "@/components/ui/checkbox";

export const useTreeView = useArkTreeViewContext;

export const createTreeCollection = options => arkCreateTreeCollection({
  nodeToValue: (node) => node.id,
  nodeToString: (node) => node.name,
  ...options,
});

const TreeViewContext = React.createContext({});

export const TreeView = (props) => {
  const {
    fileIcons,
    lazyMount = true,
    unmountOnExit = true,
    className,
    ...rest
  } = props;

  return (
    <TreeViewContext.Provider value={{ fileIcons }}>
      <ArkTreeView.Root
        className={cn(
          "[--indentation:--spacing(4)] [--item-gap:--spacing(2)]",
          "[--padding-block:--spacing(1.5)] [--padding-inline:--spacing(3)]",
          "[--icon-size:--spacing(4)]",
          "w-full",
          "flex flex-col gap-2",
          "text-foreground",
          className
        )}
        data-slot="tree-view"
        lazyMount={lazyMount}
        unmountOnExit={unmountOnExit}
        {...rest} />
    </TreeViewContext.Provider>
  );
};

export const TreeViewLabel = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkTreeView.Label
      className={cn("select-none font-medium text-foreground text-sm", className)}
      data-slot="tree-view-label"
      {...rest} />
  );
};

export const TreeViewTree = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkTreeView.Tree
      className={cn(
        "flex flex-col text-sm",
        "[&_svg]:size-(--icon-size) [&_svg]:shrink-0",
        className
      )}
      data-slot="tree-view-tree"
      {...rest} />
  );
};

export const TreeViewNode = props => <ArkTreeView.NodeProvider data-slot="tree-view-node" {...props} />;

export const TreeViewBranch = (
  props
) => (
  <ArkTreeView.Branch className={cn("relative")} data-slot="tree-view-branch" {...props} />
);

const treeViewControlVariants = tv({
  base: [
    "peer",
    "relative my-px",
    "flex items-center gap-(--item-gap)",
    "min-h-8 w-full",
    "py-(--padding-block) ps-[calc(var(--padding-inline)+var(--indentation)*(var(--depth)-1)+var(--icon-size)*(var(--depth)-1)*0.5)] pe-(--padding-inline)",
    "bg-transparent",
    "select-none text-start font-inherit text-muted-foreground",
    "rounded-md border-none",
    "cursor-pointer",
    "hover:bg-muted hover:text-foreground",
    "outline-none focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2",
    "data-selected:bg-accent data-selected:text-accent-foreground",
    "data-focus:bg-muted data-focus:text-foreground",
    "data-disabled:opacity-64 data-disabled:grayscale",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
});

export const TreeViewBranchItem = (props) => {
  const { icon, expandedIcon, className, children, ...rest } = props;

  return (
    <ArkTreeView.BranchControl
      className={cn(treeViewControlVariants(), className)}
      data-slot="tree-view-branch-control"
      {...rest}>
      <TreeViewBranchIndicator />
      <TreeViewBranchTitle expandedIcon={expandedIcon} icon={icon}>
        {children}
      </TreeViewBranchTitle>
    </ArkTreeView.BranchControl>
  );
};

const TreeViewBranchTitle = (props) => {
  const {
    icon: Icon,
    expandedIcon: ExpandedIcon,
    className,
    children,
    ...rest
  } = props;

  return (
    <ArkTreeView.NodeContext>
      {(nodeState) => (
        <>
          {nodeState.renaming ? (
            <TreeViewNodeInput />
          ) : (
            <ArkTreeView.BranchText
              className={cn(
                "flex flex-1 items-center gap-(--item-gap)",
                "overflow-hidden text-ellipsis whitespace-nowrap",
                className
              )}
              data-slot="tree-view-branch-title"
              {...rest}>
              {Icon !== null && !nodeState.expanded && (
                <TreeViewItemIcon>
                  {Icon ? <Icon /> : <FolderIcon />}
                </TreeViewItemIcon>
              )}
              {ExpandedIcon !== null && nodeState.expanded && (
                <TreeViewItemIcon>
                  {ExpandedIcon ? <ExpandedIcon /> : <FolderOpenIcon />}
                </TreeViewItemIcon>
              )}
              {children}
            </ArkTreeView.BranchText>
          )}
        </>
      )}
    </ArkTreeView.NodeContext>
  );
};

export const TreeViewBranchIndicator = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkTreeView.BranchIndicator
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        "text-muted-foreground",
        "origin-center transition-transform duration-150",
        "data-[state=open]:rotate-90",
        "[&_svg]:size-3.5 [&_svg]:shrink-0",
        "motion-reduce:transition-none!",
        className
      )}
      data-slot="tree-view-branch-indicator"
      {...rest}>
      <ChevronRightIcon />
    </ArkTreeView.BranchIndicator>
  );
};

export const TreeViewBranchContent = (
  props
) => {
  const { className, children, ...rest } = props;

  return (
    <ArkTreeView.BranchContent
      className={cn(
        "relative overflow-hidden",
        "data-[state=open]:animate-[expand_150ms_ease-out]",
        "data-[state=closed]:animate-[collapse_150ms_ease-out]",
        "motion-reduce:animate-none!",
        className
      )}
      data-slot="tree-view-branch-content"
      {...rest}>
      <TreeViewBranchIndentGuide />
      {children}
    </ArkTreeView.BranchContent>
  );
};

const TreeViewBranchIndentGuide = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkTreeView.BranchIndentGuide
      className={cn(
        "absolute z-1",
        "h-full w-px",
        "bg-border",
        "inset-s-[calc(var(--padding-inline)+var(--indentation)*(var(--depth)-1)+var(--icon-size)*0.5*var(--depth))]",
        "pointer-events-none",
        className
      )}
      data-slot="tree-view-branch-indent-guide"
      {...rest} />
  );
};

export const TreeViewContent = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkTreeView.Item
      className={cn(treeViewControlVariants(), className)}
      data-slot="tree-view-item"
      {...rest} />
  );
};

export const TreeViewItem = (props) => {
  const { icon: Icon = FileIcon, className, children, ...rest } = props;

  const { fileIcons } = _useTreeView();

  const getFileIcon = value => {
    const extension = getFileExtension(value);
    const resolved = extension ? fileIcons?.[extension] : undefined;
    return resolved ?? Icon;
  };

  return (
    <ArkTreeView.NodeContext>
      {(nodeState) => {
        const ResolvedIcon = getFileIcon(nodeState.value);

        return (
          <>
            <TreeViewItemIcon>
              <ResolvedIcon />
            </TreeViewItemIcon>
            {nodeState.renaming ? (
              <TreeViewNodeInput />
            ) : (
              <TreeViewItemTitle {...rest}>{children}</TreeViewItemTitle>
            )}
          </>
        );
      }}
    </ArkTreeView.NodeContext>
  );
};

const TreeViewItemIcon = (props) => {
  const { className, ...rest } = props;

  return (
    <ark.span
      className={cn(
        "in-[[data-slot=tree-view-item]:has([data-slot=tree-view-checkbox])]:hidden",
        className
      )}
      data-slot="tree-view-item-icon"
      {...rest} />
  );
};

const TreeViewItemTitle = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkTreeView.ItemText
      className={cn(
        "flex flex-1 items-center gap-(--item-gap)",
        "text-ellipsis whitespace-nowrap",
        "overflow-hidden",
        className
      )}
      data-slot="tree-view-item-title"
      {...rest} />
  );
};

export const TreeViewCheckbox = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkTreeView.NodeCheckbox
      className={cn(checkboxVariants(), "[&_svg]:size-3!", className)}
      data-slot="tree-view-checkbox"
      {...rest}>
      <ArkTreeView.NodeCheckboxIndicator indeterminate={<MinusIcon />}>
        <CheckIcon />
      </ArkTreeView.NodeCheckboxIndicator>
    </ArkTreeView.NodeCheckbox>
  );
};

const TreeViewNodeInput = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkTreeView.NodeRenameInput
      className={cn(
        "h-full min-w-0",
        "flex-1",
        "-my-px px-2 py-0",
        "text-sm",
        "border-primary bg-popover text-foreground",
        "rounded-md border",
        "selection:bg-primary/20 selection:text-foreground",
        "outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/32",
        className
      )}
      data-slot="tree-view-node-rename-input"
      {...rest} />
  );
};

const _useTreeView = () => {
  const context = React.useContext(TreeViewContext);

  if (!context) {
    throw new Error("useTreeViewContext must be used within a TreeViewProvider");
  }

  return context;
};

export const createFileIcons = (args) => ({ ...args });

const getFileExtension = (file) => {
  const name = file.includes(".")
    ? file.split(".").at(-1)?.toLowerCase()
    : null;

  return name ? `.${name}` : null;
};
