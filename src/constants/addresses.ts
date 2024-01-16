import { Addresses, ChainId } from "../types";
import { deployments } from "@hypercerts-org/sdk";

const celoAddresses: Addresses = {
  EXCHANGE_V2: deployments[42220].addresses?.HypercertExchange as string,
  TRANSFER_MANAGER_V2: deployments[42220].addresses?.TransferManager as string,
  WETH: "0x122013fd7dF1C6F636a5bb8f03108E876548b455",
  ORDER_VALIDATOR_V2: deployments[42220].addresses?.OrderValidator as string,
};

const sepoliaAddresses: Addresses = {
  EXCHANGE_V2: deployments[10].addresses?.HypercertExchange as string,
  TRANSFER_MANAGER_V2: deployments[10].addresses?.TransferManager as string,
  WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
  ORDER_VALIDATOR_V2: deployments[10].addresses?.OrderValidator as string,
};

/**
 * List of useful contract addresses
 */
export const addressesByNetwork: { [chainId in ChainId]: Addresses } = {
  [ChainId.CELO]: celoAddresses,
  [ChainId.HARDHAT]: celoAddresses,
  [ChainId.SEPOLIA]: sepoliaAddresses,
};
