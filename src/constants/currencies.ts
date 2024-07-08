import { ChainId, Currencies } from "../types";
import { ZeroAddress } from "ethers";

type CurrenciesForChain = {
  ETH: `0x${string}`;
  WETH: `0x${string}`;
  DAI: `0x${string}`;
  USDC: `0x${string}`;
};

const currencyAddressesPerChain: Record<ChainId, CurrenciesForChain> = {
  [ChainId.SEPOLIA]: {
    ETH: ZeroAddress as `0x${string}`,
    WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    DAI: "0x68194a729C2450ad26072b3D33ADaCbcef39D574",
    USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  },
  [ChainId.HARDHAT]: {
    ETH: ZeroAddress as `0x${string}`,
    WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    DAI: "0x68194a729C2450ad26072b3D33ADaCbcef39D574",
    USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  },
  [ChainId.BASE_SEPOLIA]: {
    ETH: ZeroAddress as `0x${string}`,
    WETH: "0x1BDD24840e119DC2602dCC587Dd182812427A5Cc",
    DAI: "0xbEC8ab89b34835F6b99fFc29c088426E8e708ceA",
    USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  },
  [ChainId.OPTIMISM]: {
    ETH: ZeroAddress as `0x${string}`,
    WETH: "0x4200000000000000000000000000000000000006",
    DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    USDC: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  },
  [ChainId.CELO]: {
    ETH: ZeroAddress as `0x${string}`,
    WETH: "0x66803fb87abd4aac3cbb3fad7c3aa01f6f3fb207",
    DAI: "0xE4fE50cdD716522A56204352f00AA110F731932d",
    USDC: "0xef4229c8c3250C675F21BCefa42f58EfbfF6002a",
  },
  [ChainId.BASE]: {
    ETH: ZeroAddress as `0x${string}`,
    WETH: "0x4200000000000000000000000000000000000006",
    DAI: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
};

const getCurrencies = (chainId: ChainId): Currencies => {
  const currenciesForChain = currencyAddressesPerChain[chainId];

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
};

export const currenciesByNetwork: Record<ChainId, Currencies> = {
  [ChainId.SEPOLIA]: getCurrencies(ChainId.SEPOLIA),
  [ChainId.HARDHAT]: getCurrencies(ChainId.HARDHAT),
  [ChainId.BASE_SEPOLIA]: getCurrencies(ChainId.BASE_SEPOLIA),
  [ChainId.OPTIMISM]: getCurrencies(ChainId.OPTIMISM),
  [ChainId.CELO]: getCurrencies(ChainId.CELO),
  [ChainId.BASE]: getCurrencies(ChainId.BASE),
};
