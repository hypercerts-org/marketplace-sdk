# Selling parts of a fraction

This strategy enables users to buy a self-specified number of units of the fraction being put up for
sale. [See the implementation here](https://github.com/hypercerts-org/hypercerts/blob/main/contracts/src/marketplace/executionStrategies/StrategyHypercertFractionOffer.sol)

### Creating the sale

```typescript
const { maker, isCollectionApproved, isTransferManagerApproved } =
  await hypercertExchangeClient.createFractionalSaleMakerAsk({
    startTime: Math.floor(Date.now() / 1000), // Use it to create an order that will be valid in the future (Optional, Default to now)
    endTime: Math.floor(Date.now() / 1000) + 86400, // If you use a timestamp in ms, the function will revert
    price: parseEther("1"), // Be careful to use a price in wei, this example is for 1 ETH
    itemIds: [tokenId.toString()], // Token id of the NFT(s) you want to sell, add several ids to create a bundle
    minUnitAmount: 10, // Minimum amount of units to sell per sale
    maxUnitAmount: 100, // Maximum amount of units to sell per sale
    minUnitsToKeep: 50, // Minimum amount of units to keep after the sale
    sellLeftoverFraction: true, // If you want to sell the leftover fraction
  });
```

The `minUnitAmount` and `maxUnitAmount` parameters are used to define the range of units that can be sold in a single
transaction. The `minUnitsToKeep` parameter is used to define the minimum amount of units that the seller wants to keep
after all sales. The `sellLeftoverFraction` parameter is used to define if the remainder
fraction should be up for sale, meaning that a user can buy less units then the `minUnitAmount`, but only if those are
the last remaining units that are up for sale.

### Completing the sale

```typescript
// Create taker bid
const takerOrder = hypercertExchangeClient.createFractionalSaleTakerBid(
  order,
  address,
  unitAmount,
  pricePerUnit
);

try {
  // Set approval for exchange to spend funds
  // Note that we set the approval for the total price to be paid for all units
  const totalPrice = BigInt(order.price) * BigInt(unitAmount);
  const approveTx = await hypercertExchangeClient.approveErc20(
    order.currency,
    totalPrice
  );
  await waitForTransactionReceipt(walletClientData, {
    hash: approveTx.hash as `0x${string}`
  });
} catch (e) {
  // Handle error
  console.error(e);
}

try {
  // Perform the trade
  const { call } = hypercertExchangeClient.executeOrder(
    order,
    takerOrder,
    order.signature
  );
  const tx = await call();
  await waitForTransactionReceipt(walletClientData, {
    hash: tx.hash as `0x${string}`
  });
} catch (e) {
  // Handle error
  console.error(e);
}
```

Note that the number of units to be bought has to be specified, and the price per unit has to be provided as well. It's
possible for the buyer to pay a higher price per unit if desired, for example in the case of a donation.

Also note that the erc20 has to be approved for the total price of the units to be bought,
e.g. `totalPrice = BigInt(order.price) * BigInt(unitAmount)`.