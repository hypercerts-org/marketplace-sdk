:warning: These code snippets are just examples and the data should never be used as is :warning:

# Sign multiple maker orders with a single signature

> **This functionality is for UI implementations only. If you are using a bot, don't use the `signMultipleMakerOrders` function, just loop over the `createMakerBid` and `createMakerAsk` functions.**

The code snippet below is an example of how to sign multiple orders with one signature using Merkle trees via the `@hypercerts-org/marketplace-sdk` library.

**NOTE**: In this example we only used maker asks, for maker bids the approvals logic needs to be adjusted. See the documentation on [creating maker bids](./createMakerBid.md) for more details.

```ts
import { ethers } from "ethers";
import { HypercertExchangeClient, ChainId, CollectionType, StrategyType } from "@hypercerts-org/marketplace-sdk";

const hypercertExchangeClient = new HypercertExchangeClient(ChainId.MAINNET, provider, signer);

const orders = [];

orders.push(await hypercertExchangeClient.createMakerAsk(...));
orders.push(await hypercertExchangeClient.createMakerAsk(...));

// Grant the TransferManager the right the transfer assets on behalf od the Hypercert Exchange Protocol. Only needs to be done once per signer.
if (!orders[0].isTransferManagerApproved) {
    const tx = await hypercertExchangeClient.grantTransferManagerApproval().call();
    await tx.wait();
}

for (const order of orders) {
    // Approve the collection items to be transferred by the TransferManager
    if (!order.isCollectionApproved) {
        const tx = await hypercertExchangeClient.approveAllCollectionItems(order.maker.collection);
        await tx.wait();
    }
}

const { signature, merkleTreeProofs } = await hypercertExchangeClient.signMultipleMakerOrders(orders);
```

For more information on how to create your orders, see the [createMakerAsk](./createMakerAsk.md) and [createMakerBid](./createMakerBid.md) documentation.

