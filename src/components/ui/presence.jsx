"use client";;
import { Presence as ArkPresence } from "@ark-ui/react/presence";

export const Presence = (props) => {
  const { lazyMount = true, unmountOnExit = true, ...rest } = props;

  return (
    <ArkPresence
      data-slot="presence"
      lazyMount={lazyMount}
      unmountOnExit={unmountOnExit}
      {...rest} />
  );
};
