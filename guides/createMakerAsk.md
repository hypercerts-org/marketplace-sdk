:warning: These code snippets are just examples and the data should never be used as is :warning:

# How to create a maker ask order

The code snippet below is an example of how to create a maker ask using the `@hypercerts-org/marketplace-sdk` library.

The main steps are:

1. Initialize a HypercertExchangeClient class instance by providing the chain id, [RPC provider](https://docs.ethers.io/v5/api/providers/) and a [signer](https://docs.ethers.io/v5/api/signer/).
2. Use the `createMakerAsk` method to create a maker ask with the parameters of your order.
3. Check and grant necessary approvals for transferring assets.
4. Sign the maker ask order with `signMakerOrder` method.

> The `orderNonce` has to be retrieved via our Public API, see [get order nonce](https://api.hypercerts.org/spec/#/Marketplace/UpdateOrderNonce).

Here is an example:

```ts
import { parseEther } from "ethers";
import { HypercertExchangeClient, ChainId, CollectionType, StrategyType } from "@hypercerts-org/marketplace-sdk";

const hypercertExchangeClient = new HypercertExchangeClient(ChainId.MAINNET, provider, signer);
const orderNonce = await hypercertExchangeClient.api.fetchOrderNonce({
  address: '0x123', // Your address
  chainId: 10, // Chain ID
});

const tokenId = 13601086205829910384631083059047775411896320n;

const { maker, isCollectionApproved, isTransferManagerApproved } = await hypercertExchangeClient.createMakerAsk({
  collection: "0x123", // Collection address
  collectionType: CollectionType.ERC721,
  strategyId: StrategyType.standard,
  subsetNonce: 0, // keep 0 if you don't know what it is used for
  orderNonce: orderNonce, // You need to retrieve this value from the API
  endTime: Math.floor(Date.now() / 1000) + 86400, // If you use a timestamp in ms, the function will revert
  price: parseEther("1"), // Be careful to use a price in wei, this example is for 1 ETH
  itemIds: [tokenId], // Token id of the NFT(s) you want to sell, add several ids to create a bundle
  amounts: [1], // Use it for listing multiple ERC-1155 (Optional, Default to [1])
  startTime: Math.floor(Date.now() / 1000), // Use it to create an order that will be valid in the future (Optional, Default to now)
});

// Grant the TransferManager the right the transfer assets on behalf od the Hypercert Exchange Protocol
if (!isTransferManagerApproved) {
  const tx = await hypercertExchangeClient.grantTransferManagerApproval().call();
  await tx.wait();
}

// Approve the collection items to be transferred by the TransferManager
if (!isCollectionApproved) {
  const tx = await hypercertExchangeClient.approveAllCollectionItems(maker.collection);
  await tx.wait();
}

// Sign your maker order
const signature = await hypercertExchangeClient.signMakerOrder(maker);
```

> Once, the maker ask for your collection offer has been created, the approvals sorted and the order signed, you will have to send it along with the signature to the `POST /marketplace/orders` endpoint. For more details and examples, see [create order](https://api.hypercerts.org/spec/#/Marketplace/StoreOrder). There is also a `hypercertExchangeClient.registerOrder()` utility method available.