# Module: src/types

## Enumerations

- [ChainId](../enums/src_types.ChainId.md)
- [CollectionType](../enums/src_types.CollectionType.md)
- [MerkleTreeNodePosition](../enums/src_types.MerkleTreeNodePosition.md)
- [OrderValidatorCode](../enums/src_types.OrderValidatorCode.md)
- [QuoteType](../enums/src_types.QuoteType.md)
- [StrategyType](../enums/src_types.StrategyType.md)

## Interfaces

- [Addresses](../interfaces/src_types.Addresses.md)
- [BatchTransferItem](../interfaces/src_types.BatchTransferItem.md)
- [ChainInfo](../interfaces/src_types.ChainInfo.md)
- [ContractMethods](../interfaces/src_types.ContractMethods.md)
- [CreateMakerAskOutput](../interfaces/src_types.CreateMakerAskOutput.md)
- [CreateMakerBidOutput](../interfaces/src_types.CreateMakerBidOutput.md)
- [CreateMakerInput](../interfaces/src_types.CreateMakerInput.md)
- [Currencies](../interfaces/src_types.Currencies.md)
- [Currency](../interfaces/src_types.Currency.md)
- [Maker](../interfaces/src_types.Maker.md)
- [MerkleTree](../interfaces/src_types.MerkleTree.md)
- [MerkleTreeProof](../interfaces/src_types.MerkleTreeProof.md)
- [Referrer](../interfaces/src_types.Referrer.md)
- [SignMerkleTreeOrdersOutput](../interfaces/src_types.SignMerkleTreeOrdersOutput.md)
- [StrategyInfo](../interfaces/src_types.StrategyInfo.md)
- [Taker](../interfaces/src_types.Taker.md)

## Type Aliases

### CreateMakerCollectionOfferInput

Ƭ **CreateMakerCollectionOfferInput**: `Omit`\<[`CreateMakerInput`](../interfaces/src_types.CreateMakerInput.md), ``"strategyId"`` \| ``"itemIds"``\>

___

### CreateMakerCollectionOfferWithProofInput

Ƭ **CreateMakerCollectionOfferWithProofInput**: `Omit`\<[`CreateMakerInput`](../interfaces/src_types.CreateMakerInput.md), ``"strategyId"``\>

___

### EIP712TypedData

Ƭ **EIP712TypedData**: `Record`\<`string`, `TypedDataField`[]\>

EIP712 type data

___

### SolidityType

Ƭ **SolidityType**: ``"bool"`` \| ``"address"`` \| ``"uint8"`` \| ``"uint16"`` \| ``"uint112"`` \| ``"uint256"`` \| ``"uint256[]"`` \| ``"bytes"`` \| ``"bytes32"`` \| ``"bytes32[]"`` \| ``"string"``

Solidity types (used for EIP-712 types)
