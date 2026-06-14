"use client";

import { Format as ArkFormat } from "@ark-ui/react/format";

export const FormatByte = (
  props
) => <ArkFormat.Byte data-slot="format-byte" {...props} />;

export const FormatNumber = (
  props
) => <ArkFormat.Number data-slot="format-number" {...props} />;

export const FormatRelativeTime = (
  props
) => <ArkFormat.RelativeTime data-slot="format-relative-time" {...props} />;
