import { ChainId } from "../types";

export const asDeployedChain = (chainId: number): ChainId => {
  if (!Object.values(ChainId).includes(chainId)) {
    throw new Error(`Invalid chainId: ${chainId}`);
  }
  return chainId as ChainId;
};
