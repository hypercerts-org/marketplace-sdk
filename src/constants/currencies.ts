import { ChainId, Currencies } from "../types";
import { ZeroAddress } from "ethers";

type DefaultCurrencies = {
  ETH: `0x${string}`;
  WETH: `0x${string}`;
  DAI: `0x${string}`;
  USDC: `0x${string}`;
};

type CeloCurrencies = {
  CELO: `0x${string}`;
  cUSD: `0x${string}`;
  USDC: `0x${string}`;
  USDT: `0x${string}`;
  USDGLO: `0x${string}`;
};

type CurrenciesForChain = DefaultCurrencies | CeloCurrencies;

const currencyAddressesPerChain: Record<ChainId, CurrenciesForChain> = {
  [ChainId.SEPOLIA]: {
    ETH: ZeroAddress as `0x${string}`,
    WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    DAI: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  },
  [ChainId.HARDHAT]: {
    ETH: ZeroAddress as `0x${string}`,
    WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    DAI: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  },
  [ChainId.BASE_SEPOLIA]: {
    ETH: ZeroAddress as `0x${string}`,
    WETH: "0x4200000000000000000000000000000000000006",
    DAI: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
    USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  },
  [ChainId.ARBITRUM_SEPOLIA]: {
    ETH: ZeroAddress as `0x${string}`,
    WETH: "0x3031a6D5D9648BA5f50f656Cd4a1672E1167a34A",
    DAI: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
    USDC: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
  },
  [ChainId.OPTIMISM]: {
    ETH: ZeroAddress as `0x${string}`,
    WETH: "0x4200000000000000000000000000000000000006",
    DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    USDC: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  },
  [ChainId.CELO]: {
    CELO: "0x471EcE3750Da237f93B8E339c536989b8978a438",
    cUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
    USDC: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
    USDT: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
    USDGLO: "0x4F604735c1cF31399C6E711D5962b2B3E0225AD3",
  },
  [ChainId.ARBITRUM]: {
    ETH: ZeroAddress as `0x${string}`,
    WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  },
};

const getCurrencies = (chainId: ChainId): Currencies => {
  const currenciesForChain = currencyAddressesPerChain[chainId];

  if ("ETH" in currenciesForChain) {
    return {
      ETH: {
        symbol: "ETH",
        address: currenciesForChain.ETH,
        decimals: 18,
      },
      WETH: {
        symbol: "WETH",
        address: currenciesForChain.WETH,
        decimals: 18,
      },
      DAI: {
        symbol: "DAI",
        address: currenciesForChain.DAI,
        decimals: 18,
      },
      USDC: {
        symbol: "USDC",
        address: currenciesForChain.USDC,
        decimals: 6,
      },
    };
  }

  return {
    CELO: {
      symbol: "CELO",
      address: currenciesForChain.CELO,
      decimals: 18,
    },
    cUSD: {
      symbol: "cUSD",
      address: currenciesForChain.cUSD,
      decimals: 18,
    },
    USDC: {
      symbol: "USDC",
      address: currenciesForChain.USDC,
      decimals: 6,
    },
    USDT: {
      symbol: "USDT",
      address: currenciesForChain.USDT,
      decimals: 6,
    },
    USDGLO: {
      symbol: "USDGLO",
      address: currenciesForChain.USDGLO,
      decimals: 18,
    },
  };
};

export const currenciesByNetwork: Record<ChainId, Currencies> = {
  [ChainId.SEPOLIA]: getCurrencies(ChainId.SEPOLIA),
  [ChainId.HARDHAT]: getCurrencies(ChainId.HARDHAT),
  [ChainId.BASE_SEPOLIA]: getCurrencies(ChainId.BASE_SEPOLIA),
  [ChainId.OPTIMISM]: getCurrencies(ChainId.OPTIMISM),
  [ChainId.CELO]: getCurrencies(ChainId.CELO),
  [ChainId.ARBITRUM_SEPOLIA]: getCurrencies(ChainId.ARBITRUM_SEPOLIA),
  [ChainId.ARBITRUM]: getCurrencies(ChainId.ARBITRUM),
};
