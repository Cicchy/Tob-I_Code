"use client";

import { ClientOnly as ArkClientOnly } from "@ark-ui/react/client-only";

export const ClientOnly = (
  props
) => <ArkClientOnly data-slot="client-only" {...props} />;
