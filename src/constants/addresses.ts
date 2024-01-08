import { Addresses, ChainId } from "../types";
import { deployments } from "@hypercerts-org/contracts";

const goerliAddresses: Addresses = {
  EXCHANGE_V2: deployments[5].HypercertExchange as string,
  TRANSFER_MANAGER_V2: deployments[5].TransferManager as string,
  WETH: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  ORDER_VALIDATOR_V2: deployments[5].OrderValidatorV2A as string,
};

const sepoliaAddresses: Addresses = {
  // EXCHANGE_V2: deployments[11155111].HypercertExchange as string,
  // EXCHANGE_V2: "0x2d7C5512bC3BBE1A12FB9EC1F8CD7Ab0C99E6de5",
  EXCHANGE_V2: "0x7d7b6011c7BaB5A850Bd44f7A5B29C3502fd6491",
  // TRANSFER_MANAGER_V2: deployments[11155111].TransferManager as string,
  TRANSFER_MANAGER_V2: "0x2aDc7d015701e347C75415477dEb0203C36E082e",
  WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
  // ORDER_VALIDATOR_V2: deployments[11155111].OrderValidatorV2A as string,
  ORDER_VALIDATOR_V2: "0xff9ef4786bf31158ba152638746c2a678d2c4ade",
};

/**
 * List of useful contract addresses
 */
export const addressesByNetwork: { [chainId in ChainId]: Addresses } = {
  [ChainId.GOERLI]: goerliAddresses,
  [ChainId.HARDHAT]: goerliAddresses,
  [ChainId.SEPOLIA]: sepoliaAddresses,
};
