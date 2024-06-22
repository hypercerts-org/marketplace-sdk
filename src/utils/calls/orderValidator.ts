import { Contract, Provider, Overrides, Signer } from "ethers";

import { Maker, MerkleTree, OrderValidatorCode } from "../../types";
import { OrderValidatorV2A, OrderValidatorV2AAbi } from "@hypercerts-org/contracts";

export const verifyMakerOrders = async (
  signerOrProvider: Provider | Signer,
  address: string,
  makerOrders: Maker[],
  signatures: string[],
  merkleTrees: MerkleTree[],
  overrides?: Overrides
): Promise<OrderValidatorCode[][]> => {
  const contract = new Contract(address, OrderValidatorV2AAbi).connect(signerOrProvider) as OrderValidatorV2A;
  const orders = await contract.checkMultipleMakerOrderValidities(makerOrders, signatures, merkleTrees, {
    ...overrides,
  });
  // TODO: Fix types
  // @ts-ignore
  return orders.map((order) => order.map((code) => Number(code) as OrderValidatorCode));
};
