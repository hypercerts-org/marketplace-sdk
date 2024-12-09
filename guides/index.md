---
title: Getting Started
group: Guides
---

# Getting started

## Install

This package currently has a peer dependency on [etherjs V6](https://docs.ethers.io/v6/).

```bash
yarn add @hypercerts-org/marketplace-sdk ethers
```

```bash
npm install @hypercerts-org/marketplace-sdk ethers --save
```

```bash
pnpm add @hypercerts-org/marketplace-sdk ethers
```

## Initialization

The SDK exposes a main class that's used to perform all onchain operations:

```ts
import { HypercertExchangeClient, ChainId } from "@hypercerts-org/marketplace-sdk";
const hypercertExchangeClient = new HypercertExchangeClient(ChainId.OPTIMISM, provider, signer);
```

The signer is optional if you need access to read only data (:warning: Calls to functions that need a signer will throw a `Signer is undefined` exception):

```ts
import { HypercertExchangeClient, ChainId } from "@hypercerts-org/marketplace-sdk";
const hypercertExchangeClient = new HypercertExchangeClient(ChainId.OPTIMISM, provider);
```

If you work on a Hardhat setup, you can override the addresses as follows:

```ts
import { HypercertExchangeClient, ChainId } from "@hypercerts-org/marketplace-sdk";
const addresses: Addresses = {...};
const hypercertExchangeClient = new HypercertExchangeClient(ChainId.HARDHAT, provider, signer, addresses);
```

# Guides

- [How to sell an entire fraction at once](./createDirectFractionsSaleMakerAsk.md)
- [How to sell part of a fraction](./createFractionalSaleMakerAsk.md)
- [How to create a Maker Ask manually](./createMakerAsk.md)
- [How to create a Taker order and execute a trade](./executeTrade.md)
- [How to cancel orders](./cancelOrders.md)
- [Verify order validity](./orderValidity.md)
- [FAQ](./faq.md)