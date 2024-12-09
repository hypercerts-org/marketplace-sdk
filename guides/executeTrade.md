---
title: "Executing a trade"
group: Guides
---

> [!WARNING]
>
> These code snippets are just examples and the data should never be used as is

# How to create a Taker order and execute a trade

Trades are executed on-chain by matching a `Maker` order with a `Taker` order. The maker order can be retrieved from the [graphQL API](https://api.hypercerts.org/v1/graphql). The order used here has the same structure as a [maker order](../src/types.ts#L116), but with an added field `signature: string`. While the taker order can be obtained by calling the `createTaker` method as shown here:

```ts
import { HypercertExchangeClient, ChainId } from "@hypercerts-org/marketplace-sdk";

const hypercertExchangeClient = new HypercertExchangeClient(ChainId.OPTIMISM, provider, signer);

// The recipient address is optional, if not provided it will use the signer address
const takerOrder = hypercertExchangeClient.createTaker(makerOrder, recipientAddress);

// Set ERC20 approval if needed
const totalPrice = BigInt(order.price);
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

From the API response, you will also get the `signature`, which is necessary to execute the trade on-chain. To execute the trade, you can call the `executeOrder` method passing the `Maker`, `Taker` and the `signature`. The method will return a contract call. Here is an example:

```ts
const tx = await hypercertExchangeClient.executeOrder(makerOrder, takerOrder, makerOrder.signature).call();
const receipt = await tx.wait();
```

