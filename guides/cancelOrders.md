---
title: "Canceling orders"
group: Guides
---

> [!WARNING]
>
> These code snippets are just examples and the data should never be used as is

# How to cancel orders

## Cancel orders using order nonces

This method is used to invalidate the `orderNonce`. If multiple maker orders share the same nonce, they will all be cancelled and non-executable. An `orderNonce` is also invalidated once an order with that nonce is executed.

```ts
import { HypercertExchangeClient, ChainId } from "@hypercerts-org/marketplace-sdk";

const hypercertExchangeClient = new HypercertExchangeClient(ChainId.OPTIMISM, provider, signer);

// Cancel order nonce 0
const tx = await hypercertExchangeClient.cancelOrders([0]).call();
const receipt = await tx.wait();

// Cancel order nonce 0 and 12
const tx = await hypercertExchangeClient.cancelOrders([0, 12]).call();
const receipt = await tx.wait();
```

## Cancel all your bids and/or all your asks

This function can be used to cancel all the sender's bids or all the sender's asks, or both in a single call. The following example showcases all the possible combinations.

```ts
import { HypercertExchangeClient, ChainId } from "@hypercerts-org/marketplace-sdk";

const hypercertExchangeClient = new HypercertExchangeClient(ChainId.OPTIMISM, provider, signer);

// Cancel all bids
const tx = await hypercertExchangeClient.cancelAllOrders(true, false).call();
const receipt = await tx.wait();

// Cancel all asks
const tx = await hypercertExchangeClient.cancelAllOrders(false, true).call();
const receipt = await tx.wait();

// Cancel all bids and asks
const tx = await hypercertExchangeClient.cancelAllOrders(true, true).call();
const receipt = await tx.wait();
```

For more details on the nonce system, see the related documentation: [Nonce system](./nonce-system.md)
