---
title: "Manually creating maker ask"
group: Guides
---

> [!WARNING]
>
> These code snippets are just examples and the data should never be used as is

# How to create a maker ask order

The code snippet below is an example of how to create a maker ask using the `@hypercerts-org/marketplace-sdk` library.

The main steps are:

1. Initialize a HypercertExchangeClient class instance by providing the chain id, [RPC provider](https://docs.ethers.io/v6/api/providers/) and a [signer](https://docs.ethers.org/v6/api/providers/#Signer).
2. Use the `createMakerAsk` method to create a maker ask with the parameters of your order.
3. Check and grant necessary approvals for transferring assets.
4. Sign the maker ask order with `signMakerOrder` method.

> The `orderNonce` has to be retrieved via our Public API, see [get order nonce](https://api.hypercerts.org/spec/#/Marketplace/UpdateOrderNonce).

Here is an example:

```ts
import { parseEther } from "ethers";
import { HypercertExchangeClient, ChainId, CollectionType, StrategyType } from "@hypercerts-org/marketplace-sdk";

const hypercertExchangeClient = new HypercertExchangeClient(ChainId.OPTIMISM, provider, signer);
const orderNonce = await hypercertExchangeClient.api.fetchOrderNonce({
  address, // Your address
  chainId: ChainId.OPTIMISM, // Chain ID
});

// The ID of the fraction to be sold
const fractionId = 13601086205829910384631083059047775411896320n;

const { maker, isCollectionApproved, isTransferManagerApproved } = await hypercertExchangeClient.createMakerAsk({
  collection: "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941", // Collection address, in this case the hypercert minter address
  collectionType: CollectionType.HYPERCERT,
  strategyId: StrategyType.standard,
  subsetNonce: 0, // keep 0 if you don't know what it is used for
  orderNonce: orderNonce, // You need to retrieve this value from the API
  endTime: Math.floor(Date.now() / 1000) + 86400, // If you use a timestamp in ms, the function will revert
  price: parseEther("1"), // Be careful to use a price in wei, this example is for 1 ETH
  itemIds: [fractionId], // ID of fraction you want to sell
  startTime: Math.floor(Date.now() / 1000), // Use it to create an order that will be valid in the future (Optional, Default to now)
  currency: hypercertExchangeClient.currencies.USDC, // Currency address (0x0 for ETH)
});

// Grant the TransferManager the right to transfer assets on behalf of the Hypercert Exchange Protocol
if (!isTransferManagerApproved) {
  const tx = await hypercertExchangeClient.grantTransferManagerApproval().call();
  await tx.wait();
}

// Approve the hypercert fractions to be transferred by the TransferManager
if (!isCollectionApproved) {
  const tx = await hypercertExchangeClient.approveAllCollectionItems(maker.collection);
  await tx.wait();
}

// Sign your maker order
const signature = await hypercertExchangeClient.signMakerOrder(maker);

// Register the order with our API
const result = await hypercertExchangeClient.registerOrder({
  order,
  signature,
});
```
