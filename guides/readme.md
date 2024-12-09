---
title: Developer guide
children:
- ./createDirectFractionsSaleMakerAsk.md
- ./createFractionalSaleMakerAsk.md
- ./createMakerBid.md
- ./executeTrade.md
- ./cancelOrders.md
- ./orderValidity.md
- ./faq.md
---

# Quickstart

## Install

This package currently has a peer dependency on [etherjs V5](https://docs.ethers.io/v5/).

```bash
yarn add @hypercerts-org/marketplace-sdk ethers
```

```bash
npm install @hypercerts-org/marketplace-sdk ethers --save
```

```bash
pnpm add @hypercerts-org/marketplace-sdk ethers
```

## Getting Started

The SDK expose a main class used to perform all the onchain operations:

```ts
import { ChainId } from "@hypercerts-org/marketplace-sdk";
const hypercertExchangeClient = new HypercertExchangeClient(ChainId.MAINNET, provider, signer);
```

The signer is optional if you need access to read only data (:warning: Calls to function that need a signer will throw a `Signer is undefined` exception):

```ts
import { ChainId } from "@hypercerts-org/marketplace-sdk";
const hypercertExchangeClient = new HypercertExchangeClient(ChainId.MAINNET, provider);
```

If you work on a hardhat setup, you can override the addresses as follow:

```ts
import { Addresses } from "@hypercerts-org/marketplace-sdk";
const addresses: Addresses = {...};
const hypercertExchangeClient = new HypercertExchangeClient(ChainId.HARDHAT, provider, signer, addresses);
```

:information_source: Use [`JsonRpcProvider`](https://docs.ethers.org/v6/api/providers/jsonrpc/#JsonRpcApiProviderOptions) from `ethers v6` if you want to make batched RPC calls.

```ts
import { JsonRpcProvider, Network } from "ethers";

// Create a HTTP/HTTPS batch call provider
const provider = new JsonRpcProvider(RPC_URL, CHAIN_ID, { staticNetwork: Network.from(CHAIN_ID) });

// Create HypercertExchangeClient instance using this provider
const hypercertExchangeClient = new HypercertExchangeClient(ChainId.HARDHAT, provider, signer, addresses);
```

# Guides

- [How to sell an entire fraction at once](./createDirectFractionsSaleMakerAsk.md)
- [How to sell part of a fraction](./createFractionalSaleMakerAsk.md)
- [How to create a maker bid order manually](./createMakerBid.md)
- [How to create a Taker order and execute a trade](./executeTrade.md)
- [How to cancel orders](./cancelOrders.md)
- [Verify order validity](./orderValidity.md)
- [FAQ](./faq.md)