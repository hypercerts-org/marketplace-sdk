---
title: "Order validity"
group: Guides
---

> [!WARNING]
>
> These code snippets are just examples and the data should never be used as is

# Verify order validity

The Hypercerts marketplace SDK also provides a method to validate your order. It can be used as follows:

```ts
import { HypercertExchangeAbi, ChainId } from "@hypercerts-org/marketplace-sdk";

const hypercertExchangeAbi = new HypercertExchangeAbi(ChainId.OPTIMISM, provider, signer);

const validatorCodes = await hypercertExchangeAbi.verifyMakerOrders([makerOrder], [signature]);
```

To see all the possible validation codes, see the `OrderValidatorCode` enum located in [src/types.ts](../src/types.ts#L217).

To update order validity in our backend, the `POST /marketplace/orders/validate` [endpoint in our API](https://api.hypercerts.org/spec/#/Marketplace/ValidateOrder) can be used. This is also exposed through a convenient wrapper in the marketplace SDK:

```ts
import { HypercertExchangeAbi, ChainId } from "@hypercerts-org/marketplace-sdk";

const hypercertExchangeAbi = new HypercertExchangeAbi(ChainId.OPTIMISM, provider, signer);

await hypercertExchangeClient.api.updateOrderValidity(
    [tokenId1, tokenId2],
    chainId,
);
```

Order validity can be manually updated using the `POST /marketplace/orders/validate` endpoint. There is a `updateOrderValidity()` convenience wrapper available. Orders can become invalid due to:
- order time end period has passed
- user does not own items for sale anymore
- order got cancelled
- all units have been sold

There are more possible reasons, see the `OrderValidatorCode` enum located in [src/types.ts](../src/types.ts#L266) for all possible invalidation codes. When an order is invalidated it is marked as invalid & and the list of error codes that make it invalid are stored for reference, but not deleted. This has to be done manually by the creator of the order. When an order is invalid it's only visible in the Hypercerts UI for the owner of that order.
