---
title: "Selling entire fraction"
group: Guides
---

> [!WARNING]
>
> These code snippets are just examples and the data should never be used as is

# How to create a direct sale for an entire fraction

The code snippet below is an example of how to create a maker ask using the `@hypercerts-org/marketplace-sdk` library.

The main steps are:

1. Initialize a HypercertExchangeClient class instance by providing the chain id, [RPC provider](https://docs.ethers.io/v6/api/providers/) and a [signer](https://docs.ethers.org/v6/api/providers/#Signer).
2. Use the `createDirectFractionsSaleMakerAsk` method to create a maker ask to sell all units in a hypercert fraction in a single sale.
3. Check and grant necessary approvals for transferring assets.
4. Sign the maker ask order with `signMakerOrder` method.

Here is an example:

```ts
import { parseEther } from "ethers";
import { HypercertExchangeClient, ChainId, CollectionType, StrategyType } from "@hypercerts-org/marketplace-sdk";

const hypercertExchangeClient = new HypercertExchangeClient(ChainId.OPTIMISM, provider, signer);

// The ID of the fraction that will be put on sale
const fractionId = 13601086205829910384631083059047775411896320n;

// Create the fractional sale order for a hypercert
// This will also take care of fetching and setting the order nonce
const order = await hypercertExchangeClient.createDirectFractionsSaleMakerAsk({
  startTime: Date.now() / 1000 + 5 * 60, // Use it to create an order that will be valid 5 minutes from now (Optional, defaults to the current timestamp in seconds)
  endTime: Date.now() / 1000 + 60 * 60, // If you use a timestamp in ms, the function will revert (this order will be valid for one hour)
  itemIds: [fractionId], // ID of the fraction that will be put on sale
  price: parseUnits("1", 6), // Price for all units in the hypercert fraction, in this example we're selling for 1 USDC.
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

# How to execute a direct sale for an entire fraction

The order used here has the same structure as a [maker order](../src/types.ts#L116), but with an added field `signature: string`.

```ts
import { HypercertExchangeClient, ChainId } from "@hypercerts-org/marketplace-sdk";

const hypercertExchangeClient = new HypercertExchangeClient(ChainId.OPTIMISM, provider, signer);

// Generate the taker order
const takerOrder = hypercertExchangeClient.createTaker(
  order, // The order you want to buy, retrieved from the API
  address: '0x123', // Address that should receive the fraction. Optional, defaults to the used wallet's address.
);

// Set ERC20 approval if needed
const totalPrice = BigInt(order.price);
const currentAllowance = await getCurrentERC20Allowance(
  order.currency as `0x${string}`,
);

const approveTx = await hypercertExchangeClient.approveErc20(
  order.currency,
  totalPrice,
);
await approveTx.wait();

// Only required the first time a user interacts with the contract
// It will grant the Exchange contract with the right to use your collections approvals done on the transfer manager.
const isTransferManagerApproved = await hypercertExchangeClient.isTransferManagerApproved();
if (!isTransferManagerApproved) {
  const transferManagerApprove = await hypercertExchangeClient
    .grantTransferManagerApproval()
    .call();
    await transferManagerApprove.wait();
}

// Set the value if the currency is the zero address currency (ETH)
const overrides = currency.address === zeroAddress ? { value: totalPrice } : undefined;
const tx = await hypercertExchangeClient.executeOrder(
  order,
  takerOrder,
  order.signature,
  undefined,
  overrides,
).call();
await tx.wait();
```
