import { ChainId, ChainInfo } from "../types";

export const chainInfo: { [chainId in ChainId]: ChainInfo } = {
  [ChainId.SEPOLIA]: {
    label: "Sepolia",
    appUrl: "https://testnet.hypercerts.org",
    explorer: "https://sepolia.etherscan.io",
    rpcUrl: "https://rpc.sepolia.org",
    baseApiUrl: "https://staging-api.hypercerts.org",
    osApiUrl: "https://testnets-api.opensea.io"
  },
  [ChainId.HARDHAT]: {
    label: "Hardhat",
    appUrl: "http://localhost:3000",
    explorer: "https://etherscan.io",
    rpcUrl: "http://127.0.0.1:8545",
    baseApiUrl: "http://localhost:4000",
    osApiUrl: "https://testnets-api.opensea.io"
  },
  [ChainId.BASE_SEPOLIA]: {
    label: "Base Sepolia",
    appUrl: "https://testnet.hypercerts.org",
    explorer: "https://sepolia.basescan.org",
    rpcUrl: "https://sepolia.base.org",
    baseApiUrl: "https://staging-api.hypercerts.org",
    osApiUrl: "https://testnets-api.opensea.io"
  },
  [ChainId.ARBITRUM_SEPOLIA]: {
    label: "Arbitrum Sepolia",
    appUrl: "https://testnet.hypercerts.org",
    explorer: "https://sepolia.arbiscan.io",
    rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
    baseApiUrl: "https://staging-api.hypercerts.org",
    osApiUrl: "https://testnets-api.opensea.io"
  },
  [ChainId.OPTIMISM]: {
    label: "Optimism",
    appUrl: "https://app.hypercerts.org",
    explorer: "https://optimistic.etherscan.io",
    rpcUrl: "https://opt-mainnet.g.alchemy.com/v2",
    baseApiUrl: "https://api.hypercerts.org",
    osApiUrl: "https://testnets-api.opensea.io"
  },
  [ChainId.CELO]: {
    label: "Celo",
    appUrl: "https://app.hypercerts.org",
    explorer: "https://explorer.celo.org",
    rpcUrl: "https://forno.celo.org",
    baseApiUrl: "https://api.hypercerts.org",
    osApiUrl: "https://testnets-api.opensea.io"
  },
  [ChainId.BASE]: {
    label: "Base",
    appUrl: "https://app.hypercerts.org",
    explorer: "https://basescan.io",
    rpcUrl: "https://mainnet.base.org",
    baseApiUrl: "https://api.hypercerts.org",
    osApiUrl: "https://testnets-api.opensea.io"
  }
};
