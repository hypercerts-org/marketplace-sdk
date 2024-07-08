import { ChainId, ChainInfo } from "../types";

export const chainInfo: { [chainId in ChainId]: ChainInfo } = {
  [ChainId.SEPOLIA]: {
    label: "Sepolia",
    appUrl: "https://sepolia.looksrare.org",
    explorer: "https://sepolia.etherscan.io",
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2",
    baseApiUrl: "https://graphql-sepolia.looksrare.org",
    osApiUrl: "https://testnets-api.opensea.io",
  },
  [ChainId.HARDHAT]: {
    label: "Hardhat",
    appUrl: "http://localhost:3000",
    explorer: "https://etherscan.io",
    rpcUrl: "http://127.0.0.1:8545",
    baseApiUrl: "http://localhost:4000",
    osApiUrl: "https://testnets-api.opensea.io",
  },
  [ChainId.BASE_SEPOLIA]: {
    label: "Base Sepolia",
    appUrl: "https://sepolia.base.looksrare.org",
    explorer: "https://sepolia.basescan.org",
    rpcUrl: "https://sepolia.base.org",
    baseApiUrl: "https://api-sepolia.basescan.org/api",
    osApiUrl: "https://testnets-api.opensea.io",
  },
  [ChainId.OPTIMISM]: {
    label: "Optimism",
    appUrl: "https://optimism.looksrare.org",
    explorer: "https://optimism.etherscan.io",
    rpcUrl: "https://optimism.g.alchemy.com/v2",
    baseApiUrl: "https://graphql-optimism.looksrare.org",
    osApiUrl: "https://testnets-api.opensea.io",
  },
  [ChainId.CELO]: {
    label: "Celo",
    appUrl: "https://celo.looksrare.org",
    explorer: "https://explorer.celo.org",
    rpcUrl: "https://forno.celo.org",
    baseApiUrl: "https://api.celo.looksrare.org",
    osApiUrl: "https://testnets-api.opensea.io",
  },
  [ChainId.BASE]: {
    label: "Base",
    appUrl: "https://base.looksrare.org",
    explorer: "https://base.etherscan.io",
    rpcUrl: "https://eth-base.g.alchemy.com/v2",
    baseApiUrl: "https://graphql-base.looksrare.org",
    osApiUrl: "https://testnets-api.opensea.io",
  },
};
