[**@hypercerts-org/marketplace-sdk**](../../../README.md)

***

[@hypercerts-org/marketplace-sdk](../../../README.md) / [src/HypercertExchangeClient](../README.md) / HypercertExchangeClient

# Class: HypercertExchangeClient

HypercertExchange
This class provides helpers to interact with the HypercertExchange V2 contracts

## Constructors

### new HypercertExchangeClient()

> **new HypercertExchangeClient**(`chainId`, `provider`, `signer`?, `overrides`?): [`HypercertExchangeClient`](HypercertExchangeClient.md)

HypercertExchange protocol main class

#### Parameters

##### chainId

[`ChainId`](../../types/enumerations/ChainId.md)

Current app chain id

##### provider

`Provider`

Ethers provider

##### signer?

`Signer`

Ethers signer

##### overrides?

Override contract addresses or api endpoint used

###### addresses

[`Addresses`](../../types/interfaces/Addresses.md)

###### apiEndpoint

`string`

###### currencies

[`Currencies`](../../types/interfaces/Currencies.md)

#### Returns

[`HypercertExchangeClient`](HypercertExchangeClient.md)

## Properties

### addresses

> `readonly` **addresses**: [`Addresses`](../../types/interfaces/Addresses.md)

Mapping of Hypercert protocol addresses for the current chain

***

### api

> `readonly` **api**: `ApiClient`

API client to interact with the HypercertExchange API

***

### chainId

> `readonly` **chainId**: [`ChainId`](../../types/enumerations/ChainId.md)

Current app chain ID

***

### currencies

> `readonly` **currencies**: [`Currencies`](../../types/interfaces/Currencies.md)

List of supported currencies for the current chain

***

### provider

> `readonly` **provider**: `Provider`

Ethers provider. If you want a batch functionality, use JsonRpcProvider.

#### See

[Ethers provider doc](https://docs.ethers.org/v6/api/providers/#Provider)

***

### signer?

> `readonly` `optional` **signer**: `Signer`

Ethers signer

#### See

[Ethers signer doc](https://docs.ethers.org/v6/api/providers/#Signer)

## Methods

### approveAllCollectionItems()

> **approveAllCollectionItems**(`collectionAddress`, `approved`, `overrides`?): `Promise`\<`ContractTransactionResponse`\>

Approve all the items of a collection, to eventually be traded on HypercertExchange
The spender is the TransferManager.

#### Parameters

##### collectionAddress

`string`

Address of the collection to be approved.

##### approved

`boolean` = `true`

true to approve, false to revoke the approval (default to true)

##### overrides?

`Overrides`

#### Returns

`Promise`\<`ContractTransactionResponse`\>

ContractTransaction

***

### approveErc20()

> **approveErc20**(`tokenAddress`, `amount`, `overrides`?): `Promise`\<`ContractTransactionResponse`\>

Approve an ERC20 to be used as a currency on HypercertExchange.
The spender is the HypercertExchangeProtocol contract.

#### Parameters

##### tokenAddress

`string`

Address of the ERC20 to approve

##### amount

`bigint` = `MaxUint256`

Amount to be approved (default to MaxUint256)

##### overrides?

`Overrides`

#### Returns

`Promise`\<`ContractTransactionResponse`\>

ContractTransaction

***

### cancelAllOrders()

> **cancelAllOrders**(`bid`, `ask`, `overrides`?): [`ContractMethods`](../../types/interfaces/ContractMethods.md)

Cancell all maker bid and/or ask orders for the current user

#### Parameters

##### bid

`boolean`

Cancel all bids

##### ask

`boolean`

Cancel all asks

##### overrides?

`Overrides`

#### Returns

[`ContractMethods`](../../types/interfaces/ContractMethods.md)

ContractMethods

***

### cancelOrders()

> **cancelOrders**(`nonces`, `overrides`?): [`ContractMethods`](../../types/interfaces/ContractMethods.md)

Cancel a list of specific orders

#### Parameters

##### nonces

`BigNumberish`[]

List of nonces to be cancelled

##### overrides?

`Overrides`

#### Returns

[`ContractMethods`](../../types/interfaces/ContractMethods.md)

ContractMethods

***

### cancelSubsetOrders()

> **cancelSubsetOrders**(`nonces`, `overrides`?): [`ContractMethods`](../../types/interfaces/ContractMethods.md)

Cancel a list of specific subset orders

#### Parameters

##### nonces

`BigNumberish`[]

List of nonces to be cancelled

##### overrides?

`Overrides`

#### Returns

[`ContractMethods`](../../types/interfaces/ContractMethods.md)

ContractMethods

***

### checkOrdersValidity()

> **checkOrdersValidity**(`orders`, `overrides`?): `Promise`\<`object`[]\>

Utility function to check if a list of orders are valid, according to logic specific for hypercerts using order validation codes.

#### Parameters

##### orders

`object`[]

List of orders to be checked

##### overrides?

`Overrides`

Call overrides (optional)

#### Returns

`Promise`\<`object`[]\>

***

### createDirectFractionsSaleMakerAsk()

> **createDirectFractionsSaleMakerAsk**(`__namedParameters`): `Promise`\<[`CreateMakerAskOutput`](../../types/interfaces/CreateMakerAskOutput.md)\>

Create a maker ask for a collection or singular offer of fractions

#### Parameters

##### \_\_namedParameters

`Omit`\<[`CreateMakerInput`](../../types/interfaces/CreateMakerInput.md), `"subsetNonce"` \| `"orderNonce"` \| `"strategyId"` \| `"collectionType"` \| `"collection"` \| `"amounts"`\>

#### Returns

`Promise`\<[`CreateMakerAskOutput`](../../types/interfaces/CreateMakerAskOutput.md)\>

***

### createFractionalSaleMakerAsk()

> **createFractionalSaleMakerAsk**(`__namedParameters`): `Promise`\<[`CreateMakerAskOutput`](../../types/interfaces/CreateMakerAskOutput.md)\>

Create a maker ask to let the buyer decide how much of the fraction they want to buy

#### Parameters

##### \_\_namedParameters

`Omit`\<[`CreateMakerInput`](../../types/interfaces/CreateMakerInput.md), `"subsetNonce"` \| `"orderNonce"` \| `"strategyId"` \| `"collectionType"` \| `"collection"` \| `"amounts"` \| `"additionalParameters"`\> & `object`

#### Returns

`Promise`\<[`CreateMakerAskOutput`](../../types/interfaces/CreateMakerAskOutput.md)\>

***

### createFractionalSaleTakerBid()

> **createFractionalSaleTakerBid**(`maker`, `recipient`, `unitAmount`, `pricePerUnit`): [`Taker`](../../types/interfaces/Taker.md)

Create a taker bid for buying a fraction of an open fractional sale

#### Parameters

##### maker

[`Maker`](../../types/interfaces/Maker.md)

Maker order

##### recipient

`string` = `ZeroAddress`

Recipient address of the taker (if none, it will use the sender)

##### unitAmount

`BigNumberish`

Amount of units to buy

##### pricePerUnit

`BigNumberish`

Price per unit in wei

#### Returns

[`Taker`](../../types/interfaces/Taker.md)

***

### createMakerAsk()

> **createMakerAsk**(`CreateMakerInput`): `Promise`\<[`CreateMakerAskOutput`](../../types/interfaces/CreateMakerAskOutput.md)\>

Create a maker ask object ready to be signed

#### Parameters

##### CreateMakerInput

[`CreateMakerInput`](../../types/interfaces/CreateMakerInput.md)

#### Returns

`Promise`\<[`CreateMakerAskOutput`](../../types/interfaces/CreateMakerAskOutput.md)\>

the maker object, isTransferManagerApproved, and isTransferManagerApproved

***

### createMakerBid()

> **createMakerBid**(`CreateMakerInput`): `Promise`\<[`CreateMakerBidOutput`](../../types/interfaces/CreateMakerBidOutput.md)\>

Create a maker bid object ready to be signed

#### Parameters

##### CreateMakerInput

[`CreateMakerInput`](../../types/interfaces/CreateMakerInput.md)

#### Returns

`Promise`\<[`CreateMakerBidOutput`](../../types/interfaces/CreateMakerBidOutput.md)\>

the maker object, isCurrencyApproved, and isBalanceSufficient

***

### createMakerCollectionOffer()

> **createMakerCollectionOffer**(`orderInputs`): `Promise`\<[`CreateMakerBidOutput`](../../types/interfaces/CreateMakerBidOutput.md)\>

Create a maker bid for collection offer.

#### Parameters

##### orderInputs

[`CreateMakerCollectionOfferInput`](../../types/type-aliases/CreateMakerCollectionOfferInput.md)

Order data

#### Returns

`Promise`\<[`CreateMakerBidOutput`](../../types/interfaces/CreateMakerBidOutput.md)\>

CreateMakerBidOutput

#### See

this.createMakerBid

***

### createMakerCollectionOfferWithProof()

> **createMakerCollectionOfferWithProof**(`orderInputs`): `Promise`\<[`CreateMakerBidOutput`](../../types/interfaces/CreateMakerBidOutput.md)\>

Create a maker bid for collection, with a list of item id that can be used for the taker order

#### Parameters

##### orderInputs

[`CreateMakerCollectionOfferWithProofInput`](../../types/type-aliases/CreateMakerCollectionOfferWithProofInput.md)

Order data

#### Returns

`Promise`\<[`CreateMakerBidOutput`](../../types/interfaces/CreateMakerBidOutput.md)\>

CreateMakerBidOutput

#### See

this.createMakerBid

***

### createTaker()

> **createTaker**(`maker`, `recipient`, `additionalParameters`): [`Taker`](../../types/interfaces/Taker.md)

Create a taker ask ready to be executed against a maker bid

#### Parameters

##### maker

[`Maker`](../../types/interfaces/Maker.md)

Maker order that will be used as counterparty for the taker

##### recipient

`string` = `ZeroAddress`

Recipient address of the taker (if none, it will use the sender)

##### additionalParameters

`any`[] = `[]`

Additional parameters used to support complex orders

#### Returns

[`Taker`](../../types/interfaces/Taker.md)

Taker object

***

### createTakerCollectionOffer()

> **createTakerCollectionOffer**(`maker`, `itemId`, `recipient`?): [`Taker`](../../types/interfaces/Taker.md)

Create a taker ask order for collection order.

#### Parameters

##### maker

[`Maker`](../../types/interfaces/Maker.md)

Maker bid that will be used as counterparty for the taker

##### itemId

`BigNumberish`

Token id to use as a counterparty for the collection order

##### recipient?

`string`

Recipient address of the taker (if none, it will use the sender)

#### Returns

[`Taker`](../../types/interfaces/Taker.md)

Taker object

#### See

 - this.createTaker
 - this.createMakerCollectionOffer

***

### createTakerCollectionOfferWithProof()

> **createTakerCollectionOfferWithProof**(`maker`, `itemId`, `itemIds`, `recipient`?): [`Taker`](../../types/interfaces/Taker.md)

Create a taker ask to fulfill a collection order (maker bid) created with a whitelist of item ids

#### Parameters

##### maker

[`Maker`](../../types/interfaces/Maker.md)

Maker bid that will be used as counterparty for the taker

##### itemId

`BigNumberish`

Token id to use as a counterparty for the collection order

##### itemIds

`BigNumberish`[]

List of token ids used during the maker creation

##### recipient?

`string`

Recipient address of the taker (if none, it will use the sender)

#### Returns

[`Taker`](../../types/interfaces/Taker.md)

Taker object

#### See

 - this.createTaker
 - this.createMakerCollectionOfferWithMerkleTree

***

### deleteOrder()

> **deleteOrder**(`orderId`): `Promise`\<`boolean`\>

Delete the order

#### Parameters

##### orderId

`string`

Order ID

#### Returns

`Promise`\<`boolean`\>

***

### executeMultipleOrders()

> **executeMultipleOrders**(`orders`, `isAtomic`, `overrides`?): `object`

Execute several orders

#### Parameters

##### orders

`object`[]

List of orders data

##### isAtomic

`boolean`

Should the transaction revert or not if a trade fails

##### overrides?

`Overrides`

Call overrides

#### Returns

`object`

ContractMethods

##### call()

> **call**: (`additionalOverrides`?) => `any`

###### Parameters

###### additionalOverrides?

`PayableOverrides`

###### Returns

`any`

##### callStatic()

> **callStatic**: (`additionalOverrides`?) => `any`

###### Parameters

###### additionalOverrides?

`PayableOverrides`

###### Returns

`any`

##### estimateGas()

> **estimateGas**: (`additionalOverrides`?) => `any`

###### Parameters

###### additionalOverrides?

`PayableOverrides`

###### Returns

`any`

***

### executeOrder()

> **executeOrder**(`maker`, `taker`, `signature`, `merkleTree`, `overrides`?): [`ContractMethods`](../../types/interfaces/ContractMethods.md)

Execute a trade

#### Parameters

##### maker

[`Maker`](../../types/interfaces/Maker.md)

Maker order

##### taker

[`Taker`](../../types/interfaces/Taker.md)

Taker order

##### signature

`string`

Signature of the maker order

##### merkleTree

[`MerkleTree`](../../types/interfaces/MerkleTree.md) = `defaultMerkleTree`

If the maker has been signed with a merkle tree

##### overrides?

`Overrides`

#### Returns

[`ContractMethods`](../../types/interfaces/ContractMethods.md)

ContractMethods

***

### getTypedDataDomain()

> **getTypedDataDomain**(): `TypedDataDomain`

Retrieve EIP-712 domain

#### Returns

`TypedDataDomain`

TypedDataDomain

***

### grantTransferManagerApproval()

> **grantTransferManagerApproval**(`operators`, `overrides`?): [`ContractMethods`](../../types/interfaces/ContractMethods.md)

Grant a list of operators the rights to transfer user's assets using the transfer manager

#### Parameters

##### operators

`string`[] = `...`

List of operators (default to the exchange address)

##### overrides?

`Overrides`

#### Returns

[`ContractMethods`](../../types/interfaces/ContractMethods.md)

ContractMethods

#### Default Value

```ts
Exchange address
```

***

### isTransferManagerApproved()

> **isTransferManagerApproved**(`operator`, `overrides`?): `Promise`\<`boolean`\>

Check whether or not an operator has been approved by the user

#### Parameters

##### operator

`string` = `...`

Operator address (default to the exchange address)

##### overrides?

`Overrides`

#### Returns

`Promise`\<`boolean`\>

true if the operator is approved, false otherwise

***

### registerOrder()

> **registerOrder**(`__namedParameters`): `Promise`\<\{ `success`: `boolean`; \}\>

Register the order with hypercerts marketplace API.

#### Parameters

##### \_\_namedParameters

###### order

[`Maker`](../../types/interfaces/Maker.md)

###### signature

`string`

#### Returns

`Promise`\<\{ `success`: `boolean`; \}\>

***

### revokeTransferManagerApproval()

> **revokeTransferManagerApproval**(`operators`, `overrides`?): [`ContractMethods`](../../types/interfaces/ContractMethods.md)

Revoke a list of operators the rights to transfer user's assets using the transfer manager

#### Parameters

##### operators

`string`[] = `...`

List of operators

##### overrides?

`Overrides`

#### Returns

[`ContractMethods`](../../types/interfaces/ContractMethods.md)

ContractMethods

#### Default Value

```ts
Exchange address
```

***

### signMakerOrder()

> **signMakerOrder**(`maker`): `Promise`\<`string`\>

Sign a maker order using the signer provided in the constructor

#### Parameters

##### maker

[`Maker`](../../types/interfaces/Maker.md)

Order to be signed by the user

#### Returns

`Promise`\<`string`\>

Signature

***

### signMultipleMakerOrders()

> **signMultipleMakerOrders**(`makerOrders`): `Promise`\<[`SignMerkleTreeOrdersOutput`](../../types/interfaces/SignMerkleTreeOrdersOutput.md)\>

Sign multiple maker orders with a single signature
/!\ Use this function for UI implementation only

#### Parameters

##### makerOrders

[`Maker`](../../types/interfaces/Maker.md)[]

Array of maker orders

#### Returns

`Promise`\<[`SignMerkleTreeOrdersOutput`](../../types/interfaces/SignMerkleTreeOrdersOutput.md)\>

Signature, proofs, and Merkletree object

***

### strategyInfo()

> **strategyInfo**(`strategyId`, `overrides`?): `Promise`\<[`StrategyInfo`](../../types/interfaces/StrategyInfo.md)\>

Retrieve strategy info

#### Parameters

##### strategyId

[`StrategyType`](../../types/enumerations/StrategyType.md)

use the enum StrategyType

##### overrides?

`Overrides`

#### Returns

`Promise`\<[`StrategyInfo`](../../types/interfaces/StrategyInfo.md)\>

StrategyInfo

***

### transferItemsAcrossCollection()

> **transferItemsAcrossCollection**(`to`, `collectionItems`, `overrides`?): `Promise`\<[`ContractMethods`](../../types/interfaces/ContractMethods.md)\>

Transfer a list of items across different collections

#### Parameters

##### to

`string`

Recipient address

##### collectionItems

[`BatchTransferItem`](../../types/interfaces/BatchTransferItem.md)[]

Each object in the array represent a list of items for a specific collection

##### overrides?

`Overrides`

#### Returns

`Promise`\<[`ContractMethods`](../../types/interfaces/ContractMethods.md)\>

ContractMethods

***

### verifyMakerOrders()

> **verifyMakerOrders**(`makerOrders`, `signatures`, `merkleTrees`?, `overrides`?): `Promise`\<[`OrderValidatorCode`](../../types/enumerations/OrderValidatorCode.md)[][]\>

Verify if a set of orders can be executed (i.e are valid)

#### Parameters

##### makerOrders

[`Maker`](../../types/interfaces/Maker.md)[]

List of maker orders

##### signatures

`string`[]

List of signatures

##### merkleTrees?

[`MerkleTree`](../../types/interfaces/MerkleTree.md)[]

List of merkle trees (optional)

##### overrides?

`Overrides`

#### Returns

`Promise`\<[`OrderValidatorCode`](../../types/enumerations/OrderValidatorCode.md)[][]\>

A list of OrderValidatorCode for each order (code 0 being valid)
