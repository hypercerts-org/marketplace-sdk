import { Contract, ZeroAddress, Signer } from "ethers";
import { HypercertExchange, HypercertExchangeAbi } from "@hypercerts-org/contracts";

import { Maker, MerkleTree, Taker, ContractMethods } from "../../types";
import { PayableOverrides } from "../../typechain/common";

export const executeTakerBid = (
  signer: Signer,
  address: string,
  taker: Taker,
  maker: Maker,
  makerSignature: string,
  merkleTree: MerkleTree,
  overrides?: PayableOverrides
): ContractMethods => {
  const overridesWithValue: PayableOverrides = {
    ...overrides,
    ...(maker.currency === ZeroAddress && { value: maker.price }),
  };
  const contract = new Contract(address, HypercertExchangeAbi).connect(signer) as HypercertExchange;
  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerBid.send(taker, maker, makerSignature, merkleTree, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerBid.estimateGas(taker, maker, makerSignature, merkleTree, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerBid.staticCall(taker, maker, makerSignature, merkleTree, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
  };
};

export const executeTakerAsk = (
  signer: Signer,
  address: string,
  taker: Taker,
  maker: Maker,
  makerSignature: string,
  merkleTree: MerkleTree,
  overrides?: PayableOverrides
): ContractMethods => {
  const contract = new Contract(address, HypercertExchangeAbi).connect(signer) as HypercertExchange;
  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerAsk.send(taker, maker, makerSignature, merkleTree, {
        ...overrides,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerAsk.estimateGas(taker, maker, makerSignature, merkleTree, {
        ...overrides,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: PayableOverrides) =>
      contract.executeTakerAsk.staticCall(taker, maker, makerSignature, merkleTree, {
        ...overrides,
        ...additionalOverrides,
      }),
  };
};

export const executeMultipleTakerBids = (
  signer: Signer,
  address: string,
  taker: Taker[],
  maker: Maker[],
  makerSignature: string[],
  isAtomic: boolean,
  merkleTree: MerkleTree[],
  overrides?: PayableOverrides
) => {
  const value = maker.reduce((acc, order) => (order.currency === ZeroAddress ? acc + BigInt(order.price) : acc), 0n);
  const overridesWithValue: PayableOverrides = {
    ...overrides,
    ...(value > 0 && { value }),
  };
  const contract = new Contract(address, HypercertExchangeAbi).connect(signer) as HypercertExchange;
  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.executeMultipleTakerBids.send(taker, maker, makerSignature, merkleTree, isAtomic, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.executeMultipleTakerBids.estimateGas(taker, maker, makerSignature, merkleTree, isAtomic, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: PayableOverrides) =>
      contract.executeMultipleTakerBids.staticCall(taker, maker, makerSignature, merkleTree, isAtomic, {
        ...overridesWithValue,
        ...additionalOverrides,
      }),
  };
};
