import { Contract, Overrides, Provider, Signer } from "ethers";
import { HypercertExchange, HypercertExchangeAbi as abi } from "@hypercerts-org/contracts";
import { StrategyType, StrategyInfo } from "../../types";

export const strategyInfo = async (
  signerOrProvider: Provider | Signer,
  address: string,
  strategyId: StrategyType,
  overrides?: Overrides
): Promise<StrategyInfo> => {
  const contract = new Contract(address, abi).connect(signerOrProvider) as HypercertExchange;
  const strategy = await contract.strategyInfo(strategyId, { ...overrides });
  return {
    isActive: strategy.isActive,
    standardProtocolFeeBp: Number(strategy.standardProtocolFeeBp),
    minTotalFeeBp: Number(strategy.minTotalFeeBp),
    maxProtocolFeeBp: Number(strategy.maxProtocolFeeBp),
  };
};
