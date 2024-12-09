[**@hypercerts-org/marketplace-sdk**](../../../README.md)

***

[@hypercerts-org/marketplace-sdk](../../../README.md) / [src/types](../README.md) / CreateMakerInput

# Interface: CreateMakerInput

Input of the createMakerAsk function

## Properties

### additionalParameters?

> `optional` **additionalParameters**: `any`[]

Additional parameters for complex orders

#### Default Value

```ts
[]
```

***

### amounts?

> `optional` **amounts**: `BigNumberish`[]

Amount for each item ids (needs to have the same length as itemIds array)

***

### collection

> **collection**: `string`

Collection address

***

### collectionType

> **collectionType**: [`CollectionType`](../enumerations/CollectionType.md)

Asset type, 0: ERC-721, 1:ERC-1155, etc

***

### currency?

> `optional` **currency**: `string`

Currency address

#### Default Value

```ts
ETH
```

***

### endTime

> **endTime**: `BigNumberish`

Timestamp in seconds when the order becomes invalid

***

### itemIds

> **itemIds**: `BigNumberish`[]

List of items ids to be sold

#### Default Value

```ts
[1]
```

***

### orderNonce

> **orderNonce**: `BigNumberish`

Order nonce, get it from the HypercertExchange api

***

### price

> **price**: `BigNumberish`

Asset price in wei

***

### startTime?

> `optional` **startTime**: `BigNumberish`

Order validity start time

#### Default Value

```ts
now
```

***

### strategyId

> **strategyId**: [`StrategyType`](../enumerations/StrategyType.md)

Strategy ID, 0: Standard, 1: Collection, etc

***

### subsetNonce

> **subsetNonce**: `BigNumberish`

Subset nonce used to group an arbitrary number of orders under the same nonce
