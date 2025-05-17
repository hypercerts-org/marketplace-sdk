import { TypedDataEncoder, TypedDataDomain } from "ethers";
import Safe, { buildSignatureBytes, Eip1193Provider } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import type { EIP712TypedData } from "@safe-global/types-kit";

import { addressesByNetwork } from "../constants";
import { ChainId } from "../types";
import { DOMAIN_NAME, DOMAIN_VERSION } from "../constants/eip712";

export class SafeMessages {
  private apiKit: SafeApiKit;

  /**
   * @param address - The address of the Safe
   * @param chainId - The chainId where the Safe is deployed
   * @param provider - An EIP1193 compatible provider
   * @param safeApiKit - A pre-initialized Safe API Kit e.g. when on a network with a 3rd party transaction service deployment
   */
  constructor(
    private address: `0x${string}`,
    private chainId: ChainId,
    private provider: Eip1193Provider,
    safeApiKit?: SafeApiKit
  ) {
    this.apiKit = safeApiKit || new SafeApiKit({ chainId: BigInt(chainId) });
  }

  async signAndSubmit(
    values: Record<string, unknown>,
    types: Record<string, Array<{ name: string; type: string }>>,
    primaryType: string
  ): Promise<string> {
    try {
      const { messageHash } = await this.initiateSigning({
        types: {
          ...types,
        },
        primaryType,
        message: values,
      });
      return messageHash;
    } catch (error) {
      console.error("[signAndSubmit] error", error instanceof Error ? error.message : error);
      throw error instanceof Error ? error : new Error("Error signing and submitting message");
    }
  }

  private async initiateSigning(
    config: Omit<EIP712TypedData, "domain">
  ): Promise<{
    messageHash: `0x${string}`;
  }> {
    if (!this.chainId) throw new Error("No chainId found");

    const safe = await Safe.init({
      provider: this.provider,
      safeAddress: this.address,
    });

    const domain = {
      name: DOMAIN_NAME,
      version: DOMAIN_VERSION.toString(),
      chainId: parseInt(this.chainId.toString()),
      verifyingContract: this.address,
    };

    const typedData: EIP712TypedData = {
      domain,
      types: {
        ...DOMAIN_TYPE,
        ...config.types,
      },
      primaryType: config.primaryType,
      message: config.message,
    };

    const safeMessage = await safe.createMessage(typedData);
    const signature = await safe.signTypedData(safeMessage);

    try {
      await this.apiKit.addMessage(this.address, {
        message: typedData as any,
        signature: buildSignatureBytes([signature]),
      });
    } catch (error) {
      console.error("Error adding message to Safe API:", error);
      throw error;
    }

    const rawMessageHash = this.calculateMessageHash(domain, config);
    const safeHash = await safe.getSafeMessageHash(rawMessageHash);

    return {
      messageHash: safeHash as `0x${string}`,
    };
  }

  private calculateMessageHash(
    domain: TypedDataDomain,
    config: Omit<EIP712TypedData, "domain">
  ): `0x${string}` {
    return TypedDataEncoder.hash(
      domain,
      config.types,
      config.message
    ) as `0x${string}`;
  }
}

const DOMAIN_TYPE = {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
};