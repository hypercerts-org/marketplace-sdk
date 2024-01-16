import { Addresses, ChainId } from "../types";
import { deployments } from "@hypercerts-org/sdk";

const sepoliaAddresses: Addresses = {
  EXCHANGE_V2: deployments[10].addresses?.HypercertExchange!,
  TRANSFER_MANAGER_V2: deployments[10].addresses?.TransferManager!,
  ORDER_VALIDATOR_V2: deployments[10].addresses?.OrderValidator!,
  WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
};

/**
 * List of useful contract addresses
 */
export const addressesByNetwork: { [chainId in ChainId]: Addresses } = {
  [ChainId.SEPOLIA]: sepoliaAddresses,
};
