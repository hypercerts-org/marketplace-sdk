# @looksrare/sdk-v2

![GitHub package.json version](https://img.shields.io/github/package-json/v/LooksRare/sdk-v2) ![GitHub](https://img.shields.io/github/license/LooksRare/sdk-v2) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/LooksRare/sdk-v2/build.yml) ![npm](https://img.shields.io/npm/dt/@looksrare/sdk-v2)

A collection of typescript tools to interact with LooksRare protocol V2 smart contracts 👀💎

## Install

This package has a peer dependency on [etherjs V5](https://docs.ethers.io/v5/).

```bash
yarn add @looksrare/sdk-v2 ethers
```

```bash
npm install @looksrare/sdk-v2 ethers --save
```

## Getting Started

The SDK expose a main class used to perform all the onchain operations:

```ts
import { ChainId } from "@looksrare/sdk-v2";
const looksrare = new LooksRare(ChainId.MAINNET, provider, signer);
```

The signer is optional if you need access to read only data (:warning: Calls to function that need a signer will throw a `Signer is undefined` exception):

```ts
import { ChainId } from "@looksrare/sdk-v2";
const looksrare = new LooksRare(ChainId.MAINNET, provider);
```

If you work on a hardhat setup, you can override the addresses as follow:

```ts
import { Addresses } from "@looksrare/sdk-v2";
const addresses: Addresses = {...};
const looksrare = new LooksRare(ChainId.HARDHAT, provider, signer, addresses);
```

:information_source: Use [`JsonRpcProvider`](https://docs.ethers.org/v6/api/providers/jsonrpc/#JsonRpcApiProviderOptions) from `ethers v6` if you want to make batched RPC calls.

```ts
import { JsonRpcProvider, Network } from "ethers";

// Create a HTTP/HTTPS batch call provider
const provider = new JsonRpcProvider(RPC_URL, CHAIN_ID, { staticNetwork: Network.from(CHAIN_ID) });

// Create LooksRare instance using this provider
const looksrare = new LooksRare(ChainId.HARDHAT, provider, signer, addresses);
```

Prior to [`@looksrare/sdk-v2@0.9.2`](https://www.npmjs.com/package/@looksrare/sdk-v2/v/0.9.2?activeTab=readme), LooksRareSDK was making batched calls using `0xsequence/multicall`. But this is not natively supported since `@looksrare/sdk-v2@1.0.0`.

## Documentation

Read the [guides](./guides) if you need help with the implementation.

You can also read the detailed [api documentation](./doc).

## FAQ

### ❓ How to use ABIs

The SDK exposes most of the LooksRare contract [ABIs](https://github.com/LooksRare/sdk-v2/tree/master/src/abis). For convenience, some commonly used ABIs are also exported.

```js
import LooksRareProtocolABI from "@looksrare/sdk-v2/dist/abis/LooksRareProtocol.json";
```

### ❓ How to retrieve order nonce ?

Call the public api endpoint [/orders/nonce](https://looksrare.dev/reference/getordernonce), and use this nonce directly.

### ❓ What to do when the order is created and signed ?

Use the public api endpoint [/orders](https://looksrare.dev/reference/createorder) to push the order to the database. After that, the order will be visible by everyone using the API (looksrare.org, aggregators, etc..).

### ❓ When should I use merkle tree orders ?

Merkle tree orders are used to create several orders with a single signature. You shouldn't use them when using a bot. Their main purpose is to facilitate orders creation using a user interface.

### ❓ Why do I need to call grantTransferManagerApproval ?

When you approve a collection to be traded on LooksRare, you approve the TransferManager instead of the exchange. Calling `grantTransferManagerApproval` gives the exchange contract the right to call the transfer function on the TransferManager. You need to call this function only once, the first time you use the V2.

### ❓ What are subset nonces and how to use them ?

tl;dr subset nonces allow you to cancel all the orders sharing the same subset nonce.
Subset nonces allow you to group some orders together according to arbitrary rules (for example all your orders for a specific collection, all your orders above a certain threshold, etc). You can then cancel them all with a single call to `cancelSubsetOrders`.
:information_source: Unlike order nonces, executing an order with a specific subset nonce doesn't invalidate other orders sharing the same subset nonce.

## Resources

🔗 [Developer documentation](https://docs.looksrare.org/developers/welcome)

🔗 [Public API documentation](https://looksrare.dev/reference/important-information)

🔗 [Developer discord](https://discord.gg/jJA4qM5dXz)
