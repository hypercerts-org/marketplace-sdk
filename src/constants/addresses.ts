import { Addresses, ChainId } from "../types";
import { deployments } from "@hypercerts-org/contracts";

const goerliAddresses: Addresses = {
  EXCHANGE_V2: deployments[5].HypercertExchange as string,
  TRANSFER_MANAGER_V2: deployments[5].TransferManager as string,
  WETH: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  ORDER_VALIDATOR_V2: deployments[5].OrderValidatorV2A as string,
};

const sepoliaAddresses: Addresses = {
  EXCHANGE_V2: deployments[11155111].HypercertExchange as string,
  TRANSFER_MANAGER_V2: deployments[11155111].TransferManager as string,
  WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
  ORDER_VALIDATOR_V2: deployments[11155111].OrderValidatorV2A as string,
};

/**
 * List of useful contract addresses
 */
export const addressesByNetwork: { [chainId in ChainId]: Addresses } = {
  [ChainId.GOERLI]: goerliAddresses,
  [ChainId.HARDHAT]: goerliAddresses,
  [ChainId.SEPOLIA]: sepoliaAddresses,
};
