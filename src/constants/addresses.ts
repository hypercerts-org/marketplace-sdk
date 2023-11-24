import { Addresses, ChainId } from "../types";
import { deployments } from "@hypercerts-org/contracts";

const goerliAddresses: Addresses = {
  EXCHANGE_V2: "0x483e634b79A933CDf369c46f6138a781B7495233",
  TRANSFER_MANAGER_V2: "0x7AAC4C1407f5F83256581eCc913dC8b20F7bdab1",
  // EXCHANGE_V2: deployments[5].HypercertExchange as string,
  // TRANSFER_MANAGER_V2: deployments[5].TransferManager as string,
  WETH: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  ORDER_VALIDATOR_V2: "0x7454Cc9AEB024bcE6A2CDC49ad4733B4D8215fb8",
};

const sepoliaAddresses: Addresses = {
  EXCHANGE_V2: deployments[11155111].HypercertExchange as string,
  TRANSFER_MANAGER_V2: deployments[11155111].TransferManager as string,
  WETH: "",
  ORDER_VALIDATOR_V2: "0x0bc129E4c1f8D7b5583eAbAeb1F7468935B6ec0C",
};

/**
 * List of useful contract addresses
 */
export const addressesByNetwork: { [chainId in ChainId]: Addresses } = {
  [ChainId.GOERLI]: goerliAddresses,
  [ChainId.HARDHAT]: goerliAddresses,
  [ChainId.SEPOLIA]: sepoliaAddresses,
};
