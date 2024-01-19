import { ChainId, ChainInfo } from "../types";

export const chainInfo: { [chainId in ChainId]: ChainInfo } = {
  // [ChainId.GOERLI]: {
  //   label: "Goerli",
  //   appUrl: "https://goerli.looksrare.org",
  //   explorer: "https://goerli.etherscan.io",
  //   rpcUrl: "https://eth-goerli.g.alchemy.com/v2",
  //   baseApiUrl: "https://graphql-goerli.looksrare.org",
  //   osApiUrl: "https://testnets-api.opensea.io",
  // },
  [ChainId.SEPOLIA]: {
    label: "Sepolia",
    appUrl: "https://sepolia.looksrare.org",
    explorer: "https://sepolia.etherscan.io",
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2",
    baseApiUrl: "https://graphql-sepolia.looksrare.org",
    osApiUrl: "https://testnets-api.opensea.io",
  },
  // [ChainId.HARDHAT]: {
  //   label: "Hardhat",
  //   appUrl: "http://localhost:3000",
  //   explorer: "https://etherscan.io",
  //   rpcUrl: "http://127.0.0.1:8545",
  //   baseApiUrl: "http://localhost:4000",
  //   osApiUrl: "https://testnets-api.opensea.io",
  // },
};
