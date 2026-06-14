"use client";;
import { ark } from "@ark-ui/react/factory";
import { PinInput as ArkPinInput } from "@ark-ui/react/pin-input";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export const InputOTP = (props) => {
  const { placeholder, otp = true, className, children, ...rest } = props;

  return (
    <ArkPinInput.Root
      className="group/input-otp"
      data-slot="input-otp"
      otp={otp}
      placeholder={placeholder ?? ""}
      {...rest}>
      <ArkPinInput.Control
        className={cn(
          "flex items-center gap-2",
          "*:data-[slot=input-otp-input]:size-9",
          className
        )}
        data-slot="input-otp-control">
        {children}
      </ArkPinInput.Control>
      <ArkPinInput.HiddenInput />
    </ArkPinInput.Root>
  );
};

export const InputOTPSlot = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ArkPinInput.Input asChild data-slot="input-otp-input" {...rest}>
      <Input
        className={cn("relative p-0 text-center text-base tabular-nums", className)} />
    </ArkPinInput.Input>
  );
};

export const InputOTPSeparator = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <ark.hr
      className={cn("h-0.5 w-2 rounded-full bg-foreground", className)}
      data-slot="input-otp-separator"
      {...rest} />
  );
};
