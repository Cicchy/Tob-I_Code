"use client";;
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const AlertDialog = (props) => (
  <Dialog data-slot="alert-dialog-root" role="alertdialog" {...props} />
);

export const AlertDialogTrigger = (
  props
) => <DialogTrigger data-slot="alert-dialog-trigger" {...props} />;

export const AlertDialogContent = (
  props
) => (
  <DialogContent data-slot="alert-dialog-content" showCloseButton={false} {...props} />
);

export const AlertDialogBody = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <DialogBody
      className={cn(
        "in-[[data-slot=alert-dialog-content]:has([data-slot=alert-dialog-header])]:pt-0",
        className
      )}
      data-slot="alert-dialog-body"
      {...rest} />
  );
};

export const AlertDialogHeader = (
  props
) => <DialogHeader data-slot="alert-dialog-header" {...props} />;

export const AlertDialogTitle = (
  props
) => <DialogTitle data-slot="alert-dialog-title" {...props} />;

export const AlertDialogDescription = (
  props
) => <DialogDescription data-slot="alert-dialog-description" {...props} />;

export const AlertDialogClose = (
  props
) => <DialogClose data-slot="alert-dialog-close" {...props} />;

export const AlertDialogFooter = (
  props
) => <DialogFooter data-slot="alert-dialog-footer" {...props} />;

export const AlertDialogAction = (props) => {
  const { variant = "default", ...rest } = props;

  return <Button variant={variant} {...rest} />;
};

export const AlertDialogCancel = (props) => (
  <AlertDialogClose asChild data-slot="alert-dialog-cancel">
    <Button variant="outline" {...props} />
  </AlertDialogClose>
);
