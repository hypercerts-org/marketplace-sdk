import { Addresses, ChainId } from "../types";
import { deployments } from "@hypercerts-org/contracts";

const sepoliaAddresses: Addresses = {
  EXCHANGE_V2: deployments[11155111].HypercertExchange!,
  TRANSFER_MANAGER_V2: deployments[11155111].TransferManager!,
  ORDER_VALIDATOR_V2: deployments[11155111].OrderValidatorV2A!,
  WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
  MINTER: deployments[11155111].HypercertMinterUUPS!,
};

/**
 * List of useful contract addresses
 */
export const addressesByNetwork: { [chainId in ChainId]: Addresses } = {
  [ChainId.SEPOLIA]: sepoliaAddresses,
  [ChainId.HARDHAT]: sepoliaAddresses,
};
