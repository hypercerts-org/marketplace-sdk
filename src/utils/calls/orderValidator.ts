import { Contract, Provider, Overrides, Signer } from "ethers";
import { OrderValidatorV2A } from "@hypercerts-org/contracts";

import { Maker, MerkleTree, OrderValidatorCode } from "../../types";

export const verifyMakerOrders = async (
  signerOrProvider: Provider | Signer,
  address: string,
  makerOrders: Maker[],
  signatures: string[],
  merkleTrees: MerkleTree[],
  overrides?: Overrides
): Promise<OrderValidatorCode[][]> => {
  const contract = new Contract(address, OrderValidatorV2A).connect(signerOrProvider) as OrderValidatorV2A;
  const orders = await contract.checkMultipleMakerOrderValidities(makerOrders, signatures, merkleTrees, {
    ...overrides,
  });
  // TODO: Fix types
  // @ts-ignore
  return orders.map((order) => order.map((code) => Number(code) as OrderValidatorCode));
};
