# Getting started with Marketplacer JavaScript SDK

## Installation

Install the SDK using the following command:

```
npm install @hypercerts-org/marketplacer-sdk
# or using yarn
yarn add @hypercerts-org/marketplacer-sdk
```

## Initialization

To initialize the SDK, you need to provide the following parameters:

```typescript
const hypercertExchangeClient = new HypercertExchangeClient(chainId, provider, signer);
```

[Backward compatibility adapters for wagmi/viem, to obtain ethers.js compatible provider and signers, can be found here](https://wagmi.sh/react/guides/ethers)

## Creating an order

The most straightforward type of sale is selling a fraction as a whole. 
We will do this using a direct fraction sale.

```typescript
// Create the sale object
const { maker, isCollectionApproved, isTransferManagerApproved } =
  await hypercertExchangeClient.createDirectFractionsSaleMakerAsk({
    startTime: Math.floor(Date.now() / 1000), // Use it to create an order that will be valid in the future (Optional, Default to now)
    endTime: Math.floor(Date.now() / 1000) + 86400, // If you use a timestamp in ms, the function will revert
    price: parseEther(listing.price), // Be careful to use a price in wei, this example is for 1 ETH
    itemIds: [tokenId.toString()], // Token id of the NFT(s) you want to sell, add several ids to create a bundle
    currency: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", // Defaults to WETH
  });

// Grant the TransferManager the right the transfer assets on behalf od the LooksRareProtocol
if (!isTransferManagerApproved) {
  const tx = await hypercertExchangeClient.grantTransferManagerApproval().call();
  await waitForTransactionReceipt(walletClientData, {
    hash: tx.hash as `0x${string}`,
  });
}

// Approve the collection items to be transferred by the TransferManager
if (!isCollectionApproved) {
  const tx = await hypercertExchangeClient.approveAllCollectionItems(maker.collection);
  await waitForTransactionReceipt(walletClientData, {
    hash: tx.hash as `0x${string}`,
  });
}

// Sign your sale object
const signature = await hypercertExchangeClient.signMakerOrder(maker);

// Register the created order with out API
await hypercertExchangeClient.registerOrder({
  order,
  signature,
});
```

Note that not all currencies are available by default. If you would like to use a currency that is not whitelisted yet, contact the hypercerts team.

## Listing existing orders

```typescript
const { data: orders } = await hypercertExchangeClient.api.fetchOrdersByHypercertId({
  hypercertId,
  chainId,
});
```

where orders with be an array of objects with the following structure, each of which can be passed as the argument for completing a sale directly.

```json lines
[
  {
    "id": "9027a798-cb05-49ab-8ec9-0f45a1a9d6f1",
    "createdAt": "2024-02-11T19:17:02.305689+00:00",
    "quoteType": 1,
    "globalNonce": "0",
    "orderNonce": "45",
    // Means it's a fractional sale
    "strategyId": 10,
    "collectionType": 2,
    "collection": "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941",
    "currency": "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    "signer": "0x59266D85D94666D037C1e32dAa8FaC9E95CdaFEf",
    "startTime": 1707679014,
    "endTime": 1707765414,
    // Minimum price per unit
    "price": "10000",
    "signature": "0x4c96b0f09909e4d5059baea4d18b6a9d53cace96d700be1672e440db1ffac38c072fc1f18e8d59be91df76e0d55cb0e91e6bfc02bb9143cc16cdf62918299a981b",
    "additionalParameters": "0x0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000",
    "chainId": 11155111,
    "subsetNonce": 0,
    "itemIds": [
      // This is the ID of the fraction being sold.
      "34708801425935723273264209958040357568513"
    ],
    "amounts": [1]
  }
]
```

## Buying a fraction

```typescript
// For simplicity we will just use the first order in the list of available orders
const order = orders[0];

// Create taker bid
const takerOrder = lr.createTaker(order, address);

try {
  // Set approval for exchange to spend funds
  const approveTx = await hypercertExchangeClient.approveErc20(
    order.currency, // Be sure to set the allowance for the correct currency
    order.price,
  );
  await waitForTransactionReceipt(walletClientData, {
    hash: approveTx.hash as `0x${string}`,
  });
} catch (e) {
  console.error(e);
}

try {
  // Perform the trade
  const { call } = hypercertExchangeClient.executeOrder(order, takerOrder, order.signature);
  const tx = await call();
  await waitForTransactionReceipt(walletClientData, {
    hash: tx.hash as `0x${string}`,
  });
} catch (e) {
  console.error(e);
}
```
