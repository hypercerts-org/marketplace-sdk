:warning: These code snippets are just examples and the data should never be used as is :warning:

# How to create a maker bid order

The code snippet below is an example of how to create a maker bid using the `@hypercerts-org/marketplace-sdk` library.

The main steps are:

1. Initialize a HypercertExchangeClient class instance by providing the chain id, [JSON-RPC provider](https://docs.ethers.org/v6/api/providers/jsonrpc/) and a [signer](https://docs.ethers.org/v6/api/providers/#Signer).
2. Use the `createMakerBid` method to create a maker bid with the parameters of your order.
3. Check and grant necessary approvals for transferring assets.
4. Sign the maker bid order with `signMakerOrder` method.

> The `orderNonce` has to be retrieved via our Public API, see [get order nonce](https://api.hypercerts.org/spec/#/Marketplace/UpdateOrderNonce).

Here is an example:

```ts
import { ethers } from "ethers";
import { HypercertExchangeClient, ChainId, CollectionType, StrategyType } from "@hypercerts-org/marketplace-sdk";

const hypercertExchangeClient = new HypercertExchangeClient(ChainId.MAINNET, provider, signer);

// The ID of the fraction that will be put on sale
const tokenId = 13601086205829910384631083059047775411896320n;

const { maker, isCurrencyApproved, isBalanceSufficient } = await hypercertExchangeClient.createMakerBid({
  collection: "0x0000000000000000000000000000000000000000", // Collection address
  collectionType: CollectionType.ERC721,
  strategyId: StrategyType.standard,
  subsetNonce: 0, // keep 0 if you don't know what it is used for
  orderNonce: 0, // You need to retrieve this value from the API
  endTime: Math.floor(Date.now() / 1000) + 86400, // If you use a timestamp in ms, the function will revert
  price: parseEther("1"), // Be careful to use a price in wei, this example is for 1 ETH
  itemIds: [tokenId], // Token id of the NFT you want to buy
  amounts: [1], // Use it for listing several ERC-1155 (Optional, Default to [1])
  startTime: Math.floor(Date.now() / 1000), // Use it to create an order that will be valid in the future (Optional, Default to now)
});

// Approve spending of the currency used for bidding
if (!isCurrencyApproved) {
  const tx = await hypercertExchangeClient.approveErc20(hypercertExchangeClient.addresses.WETH);
  await tx.wait();
}

// Checks if the WETH balance is enough to cover the bid
if (!isBalanceSufficient) {
  throw new Error(`WETH balance too low.`);
}

// Sign your maker order
const signature = await hypercertExchangeClient.signMakerOrder(maker);
```

> Once the maker ask for your collection offer has been created, the approvals sorted and the order signed, you will have to send it along with the signature to the `POST /marketplace/orders` endpoint. For more details and examples, see [create order](https://api.hypercerts.org/spec/#/Marketplace/StoreOrder). There is also a `hypercertExchangeClient.registerOrder()` utility method available.