import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import type { Address } from "../types";

export const useWallet = () => {
  const { primaryWallet, user } = useDynamicContext();

  const address = primaryWallet?.address as Address | undefined;

  return {
    address,
    user,
    isConnected: !!address,
  };
};
