import { AbiCoder, BytesLike } from "ethers";
import { SolidityType, StrategyType } from "../types";

/**
 * Get additional params types for a maker order based on the strategy used
 * @param strategy Maker strategy
 * @returns Array of solidity types for encoding
 */
export const getMakerParamsTypes = (strategy: StrategyType): SolidityType[] => {
  if (strategy === StrategyType.standard || strategy === StrategyType.collection) {
    return [];
  }
  if (strategy === StrategyType.collectionWithMerkleTree) {
    return ["bytes32"]; // Merkle tree root
  }
  if (strategy === StrategyType.hypercertFractionOffer) {
    return ["uint256", "uint256", "uint256", "bool"]; //  minUnitAmount, maxUnitAmount, minUnitsToKeep, sellLeftoverFraction
  }
  if (strategy === StrategyType.hypercertFractionOfferWithAllowlist) {
    return ["uint256", "uint256", "uint256", "bool", "bytes32"]; //  minUnitAmount, maxUnitAmount, minUnitsToKeep, sellLeftoverFraction, root
  }
  return [];
};

/**
 * Get additional params types for a maker order based on the strategy used
 * @param strategy Maker strategy
 * @returns Array of solidity types for encoding
 */
export const getTakerParamsTypes = (strategy: StrategyType): SolidityType[] => {
  if (strategy === StrategyType.standard) {
    return [];
  }
  if (strategy === StrategyType.collection) {
    return ["uint256"]; // Item id
  }
  if (strategy === StrategyType.collectionWithMerkleTree) {
    return ["uint256", "bytes32[]"]; // Item id, merkle proof
  }
  if (strategy === StrategyType.hypercertFractionOffer) {
    return ["uint256", "uint256"]; // unitAmount, pricePerUnit
  }
  if (strategy === StrategyType.hypercertFractionOfferWithAllowlist) {
    return ["uint256", "uint256", "bytes32[]"]; // unitAmount, pricePerUnit, proof
  }
  return [];
};

/**
 * Given an array of params, returns the encoded params.
 * To be used for orders signature and orders execution
 * @param params Array of params
 * @param types Array of solidity types
 * @returns encoded params
 */
export const encodeParams = (params: any[], types: SolidityType[]): BytesLike => {
  return AbiCoder.defaultAbiCoder().encode(types, params);
};
