import { Contract, Overrides, Provider, Signer } from "ethers";
import { TransferManager, TransferManagerAbi as abi } from "@hypercerts-org/contracts";
import { ContractMethods } from "../../types";

export const hasUserApprovedOperator = async (
  signerOrProvider: Provider | Signer,
  address: string,
  user: string,
  operator: string,
  overrides?: Overrides
): Promise<boolean> => {
  const contract = new Contract(address, abi).connect(signerOrProvider) as TransferManager;
  const hasApproved = await contract.hasUserApprovedOperator(user, operator, { ...overrides });
  return hasApproved;
};

export const grantApprovals = (
  signer: Signer,
  address: string,
  operators: string[],
  overrides?: Overrides
): ContractMethods => {
  const contract = new Contract(address, abi).connect(signer) as TransferManager;
  return {
    call: (additionalOverrides?: Overrides) =>
      contract.grantApprovals.send(operators, { ...overrides, ...additionalOverrides }),
    estimateGas: (additionalOverrides?: Overrides) =>
      contract.grantApprovals.estimateGas(operators, { ...overrides, ...additionalOverrides }),
    callStatic: (additionalOverrides?: Overrides) =>
      contract.grantApprovals.staticCall(operators, { ...overrides, ...additionalOverrides }),
  };
};

export const revokeApprovals = (
  signer: Signer,
  address: string,
  operators: string[],
  overrides?: Overrides
): ContractMethods => {
  const contract = new Contract(address, abi).connect(signer) as TransferManager;
  return {
    call: (additionalOverrides?: Overrides) =>
      contract.revokeApprovals.send(operators, { ...overrides, ...additionalOverrides }),
    estimateGas: (additionalOverrides?: Overrides) =>
      contract.revokeApprovals.estimateGas(operators, { ...overrides, ...additionalOverrides }),
    callStatic: (additionalOverrides?: Overrides) =>
      contract.revokeApprovals.staticCall(operators, { ...overrides, ...additionalOverrides }),
  };
};
