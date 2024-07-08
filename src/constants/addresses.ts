import { Addresses, ChainId } from "../types";
import { deployments } from "@hypercerts-org/contracts";

const sepoliaAddresses: Addresses = {
  EXCHANGE_V2: deployments[11155111].HypercertExchange!,
  TRANSFER_MANAGER_V2: deployments[11155111].TransferManager!,
  ORDER_VALIDATOR_V2: deployments[11155111].OrderValidatorV2A!,
  MINTER: deployments[11155111].HypercertMinterUUPS!,
};

const baseSepoliaAddresses: Addresses = {
  EXCHANGE_V2: deployments[84532].HypercertExchange!,
  TRANSFER_MANAGER_V2: deployments[84532].TransferManager!,
  ORDER_VALIDATOR_V2: deployments[84532].OrderValidatorV2A!,
  MINTER: deployments[84532].HypercertMinterUUPS!,
};

const optimismAddresses: Addresses = {
  EXCHANGE_V2: deployments[10].HypercertExchange!,
  TRANSFER_MANAGER_V2: deployments[10].TransferManager!,
  ORDER_VALIDATOR_V2: deployments[10].OrderValidatorV2A!,
  MINTER: deployments[10].HypercertMinterUUPS!,
};

const celoAddresses: Addresses = {
  EXCHANGE_V2: deployments[42220].HypercertExchange!,
  TRANSFER_MANAGER_V2: deployments[42220].TransferManager!,
  ORDER_VALIDATOR_V2: deployments[42220].OrderValidatorV2A!,
  MINTER: deployments[42220].HypercertMinterUUPS!,
};

const baseAddresses: Addresses = {
  EXCHANGE_V2: deployments[8453].HypercertExchange!,
  TRANSFER_MANAGER_V2: deployments[8453].TransferManager!,
  ORDER_VALIDATOR_V2: deployments[8453].OrderValidatorV2A!,
  MINTER: deployments[8453].HypercertMinterUUPS!,
};

/**
 * List of useful contract addresses
 */
export const addressesByNetwork: { [chainId in ChainId]: Addresses } = {
  // Testnets
  [ChainId.SEPOLIA]: sepoliaAddresses,
  [ChainId.HARDHAT]: sepoliaAddresses,
  [ChainId.BASE_SEPOLIA]: baseSepoliaAddresses,

  // Production nets
  [ChainId.OPTIMISM]: optimismAddresses,
  [ChainId.CELO]: celoAddresses,
  [ChainId.BASE]: baseAddresses,
};
