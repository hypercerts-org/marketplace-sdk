import { Addresses, ChainId } from "../types";
import { deployments } from "@hypercerts-org/contracts";

const sepoliaAddresses: Addresses = {
  EXCHANGE_V2: deployments[11155111].HypercertExchange!,
  TRANSFER_MANAGER_V2: deployments[11155111].TransferManager!,
  ORDER_VALIDATOR_V2: deployments[11155111].OrderValidatorV2A!,
  WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
  MINTER: deployments[11155111].HypercertMinterUUPS!,
};

const baseSepoliaAddresses: Addresses = {
  EXCHANGE_V2: deployments[84532].HypercertExchange!,
  TRANSFER_MANAGER_V2: deployments[84532].TransferManager!,
  ORDER_VALIDATOR_V2: deployments[84532].OrderValidatorV2A!,
  WETH: "0x1BDD24840e119DC2602dCC587Dd182812427A5Cc",
  MINTER: deployments[84532].HypercertMinterUUPS!,
};

const optimismAddresses: Addresses = {
  EXCHANGE_V2: deployments[10].HypercertExchange!,
  TRANSFER_MANAGER_V2: deployments[10].TransferManager!,
  ORDER_VALIDATOR_V2: deployments[10].OrderValidatorV2A!,
  WETH: "0x4200000000000000000000000000000000000006",
  MINTER: deployments[10].HypercertMinterUUPS!,
};

const celoAddresses: Addresses = {
  EXCHANGE_V2: deployments[42220].HypercertExchange!,
  TRANSFER_MANAGER_V2: deployments[42220].TransferManager!,
  ORDER_VALIDATOR_V2: deployments[42220].OrderValidatorV2A!,
  WETH: "0x66803fb87abd4aac3cbb3fad7c3aa01f6f3fb207",
  MINTER: deployments[42220].HypercertMinterUUPS!,
};

const baseAddresses: Addresses = {
  EXCHANGE_V2: deployments[8453].HypercertExchange!,
  TRANSFER_MANAGER_V2: deployments[8453].TransferManager!,
  ORDER_VALIDATOR_V2: deployments[8453].OrderValidatorV2A!,
  WETH: "0x4200000000000000000000000000000000000006",
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
