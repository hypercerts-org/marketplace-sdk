:warning: These code snippets are just examples and the data should never be used as is :warning:

# How to create a direct sale for an entire fraction

The code snippet below is an example of how to create a maker ask using the `@hypercerts-org/marketplace-sdk` library.

The main steps are:

1. Initialize a HypercertExchangeClient class instance by providing the chain id, [RPC provider](https://docs.ethers.io/v5/api/providers/) and a [signer](https://docs.ethers.io/v5/api/signer/).
2. Use the `createDirectFractionsSaleMakerAsk` method to create a maker ask with the parameters of your order.
3. Check and grant necessary approvals for transferring assets.
4. Sign the maker ask order with `signMakerOrder` method.

Here is an example:

```ts
import { parseEther } from "ethers";
import { HypercertExchangeClient, ChainId, CollectionType, StrategyType } from "@hypercerts-org/marketplace-sdk";

const hypercertExchangeClient = new HypercertExchangeClient(ChainId.MAINNET, provider, signer);

// The ID of the fraction that will be put on sale
const tokenId = 13601086205829910384631083059047775411896320n;

// Create the fractional sale order for a hypercert
// This will also take care of fetching and setting the order nonce correctly
const order = await hypercertExchangeClient.createDirectFractionsSaleMakerAsk({
  startTime: Date.now() / 1000, // Use it to create an order that will be valid in the future (Optional, Default to now)
  endTime: Date.now() / 1000 + 60 * 60, // If you use a timestamp in ms, the function will revert (this order will be valid for one hour)
  itemIds: [tokenId], // Token id of the NFT(s) you want to sell, add several ids to create a bundle
  price: parseUnits("1", 18), // Price for the entire fraction, in this example we're selling the entire fraction for 1 USDC.
  currency: hypercertExchangeClient.currencies.USDC, // Currency address (ZeroAddress for eth, defaults to WETH)
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

// Register the order with our API
const result = await hypercertExchangeClient.registerOrder({
  order,
  signature,
});
```

# How to execute a direct sale for an entire fraction

```ts
import { HypercertExchangeClient, ChainId } from "@hypercerts-org/marketplace-sdk";

const hypercertExchangeClient = new HypercertExchangeClient(ChainId.MAINNET, provider, signer);

// Generate the taker order
const takerOrder = hypercertExchangeClient.createTaker(
  order, // The order you want to buy, retrieved from our api and transformed using the helper method
  address: '0x0', // Address that should receive the fraction. Optional, defaults to the used wallet's address.
);

// Set ERC20 approval if needed
const totalPrice = BigInt(order.price);
const currentAllowance = await getCurrentERC20Allowance(
  order.currency as `0x${string}`,
);

if (currentAllowance < totalPrice) {
  const approveTx = await hypercertExchangeClient.approveErc20(
    order.currency,
    totalPrice,
  );
  await approveTx.wait();
}

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
const { call } = hypercertExchangeClient.executeOrder(
  order,
  takerOrder,
  order.signature,
  undefined,
  overrides,
);
const tx = await call();
await tx.wait();
```