[**@hypercerts-org/marketplace-sdk**](../../../README.md)

***

[@hypercerts-org/marketplace-sdk](../../../README.md) / [src/types](../README.md) / Maker

# Interface: Maker

Maker object to be used in execute functions

## Properties

### additionalParameters

> **additionalParameters**: `BytesLike`

Additional parameters for complex orders

***

### amounts

> **amounts**: `BigNumberish`[]

List of amount for each item ID (1 for ERC721)

***

### collection

> **collection**: `string`

Collection address

***

### collectionType

> **collectionType**: [`CollectionType`](../enumerations/CollectionType.md)

Asset type, 0: ERC-721, 1:ERC-1155, etc

***

### currency

> **currency**: `string`

Currency address (zero address for ETH)

***

### endTime

> **endTime**: `BigNumberish`

Timestamp in second of the time when the order becomes invalid

***

### globalNonce

> **globalNonce**: `BigNumberish`

User's current bid / ask nonce

***

### itemIds

> **itemIds**: `BigNumberish`[]

List of item IDS

***

### orderNonce

> **orderNonce**: `BigNumberish`

Nonce for this specific order

***

### price

> **price**: `BigNumberish`

Minimum price to be received after the trade

***

### quoteType

> **quoteType**: [`QuoteType`](../enumerations/QuoteType.md)

Bid (0) or Ask (1)

***

### signer

> **signer**: `string`

Signer address

***

### startTime

> **startTime**: `BigNumberish`

Timestamp in second of the time when the order starts to be valid

***

### strategyId

> **strategyId**: [`StrategyType`](../enumerations/StrategyType.md)

Strategy ID, 0: Standard, 1: Collection, etc

***

### subsetNonce

> **subsetNonce**: `BigNumberish`

Subset nonce used to group an arbitrary number of orders under the same nonce
