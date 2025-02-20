import { Contract, BigNumberish, ZeroAddress, Overrides } from "ethers";
import Safe from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";

import abiIERC721 from "../abis/IERC721.json";
import abiTransferManager from "../abis/TransferManager.json";
import abiIERC20 from "../abis/IERC20.json";
import { HypercertExchangeAbi } from "@hypercerts-org/contracts";

import { Addresses, ChainId, Maker, MerkleTree, QuoteType, Taker } from "../types";
import { defaultMerkleTree } from "../constants";
import { WalletClient } from "viem";

export class SafeTransactionBuilder {
  private readonly apiKit: SafeApiKit;

  constructor(
    private readonly walletClient: WalletClient,
    private readonly chainId: ChainId,
    private readonly addresses: Addresses
  ) {
    this.apiKit = new SafeApiKit({
      chainId: BigInt(this.chainId),
    });
  }

  /**
   * Approve the Hypercert Exchange to transfer the ERC721 tokens
   * @internal
   */
  public async bundleApprovals(safeAddress: string, collectionAddress: string): Promise<string> {
    const transferManagerContract = new Contract(this.addresses.TRANSFER_MANAGER_V2, abiTransferManager);
    const erc721Contract = new Contract(collectionAddress, abiIERC721);

    const transactions = [
      {
        to: this.addresses.TRANSFER_MANAGER_V2,
        data: transferManagerContract.interface.encodeFunctionData("grantApprovals", [[this.addresses.EXCHANGE_V2]]),
        value: "0",
      },
      {
        to: collectionAddress,
        data: erc721Contract.interface.encodeFunctionData("setApprovalForAll", [
          this.addresses.TRANSFER_MANAGER_V2,
          true,
        ]),
        value: "0",
      },
    ];

    return this.performSafeTransactions(safeAddress, transactions);
  }

  /**
   * Approve an ERC20 to be used as a currency on the Hypercert Exchange using Safe
   * @internal
   */
  public async approveErc20(safeAddress: string, tokenAddress: string, amount: BigNumberish) {
    const erc20Contract = new Contract(tokenAddress, abiIERC20);
    const transactions = [
      {
        to: tokenAddress,
        data: erc20Contract.interface.encodeFunctionData("approve", [this.addresses.EXCHANGE_V2, amount]),
        value: "0",
      },
    ];

    return this.performSafeTransactions(safeAddress, transactions);
  }

  /**
   * Execute an order on the Hypercert Exchange using Safe
   * @internal
   */
  public executeOrder = (
    safeAddress: string,
    maker: Maker,
    taker: Taker,
    signature: string,
    merkleTree: MerkleTree = defaultMerkleTree,
    overrides?: Overrides
  ) => {
    const exchangeContract = new Contract(this.addresses.EXCHANGE_V2, HypercertExchangeAbi);
    const functionName = maker.quoteType === QuoteType.Ask ? "executeTakerBid" : "executeTakerAsk";
    const value = maker.currency === ZeroAddress ? overrides?.value || maker.price : "0";
    const transactions = [
      {
        to: this.addresses.EXCHANGE_V2,
        data: exchangeContract.interface.encodeFunctionData(functionName, [taker, maker, signature, merkleTree]),
        value: value.toString(),
      },
    ];

    return this.performSafeTransactions(safeAddress, transactions);
  };

  /**
   * Grant a list of operators the rights to transfer user's assets using the transfer manager using Safe
   * @internal
   */
  public grantTransferManagerApproval(safeAddress: string, operators: string[]) {
    const transferManagerContract = new Contract(this.addresses.TRANSFER_MANAGER_V2, abiTransferManager);
    const transactions = operators.map((operator) => ({
      to: this.addresses.TRANSFER_MANAGER_V2,
      data: transferManagerContract.interface.encodeFunctionData("grantApprovals", [[operator]]),
      value: "0",
    }));

    return this.performSafeTransactions(safeAddress, transactions);
  }

  /**
   * Perform a series of Safe transactions in a single transaction
   * @internal
   */
  private performSafeTransactions = async (
    safeAddress: string,
    transactions: {
      to: string;
      data: string;
      value: string;
    }[]
  ) => {
    const senderAddress = this.walletClient.account?.address;
    if (!senderAddress) {
      throw new Error("No sender address");
    }

    const protocolKit = await Safe.init({
      provider: this.walletClient as any,
      safeAddress: safeAddress,
    });
    const connected = await protocolKit.connect(this.walletClient as any);

    const nonce = await this.apiKit.getNextNonce(safeAddress);
    const safeTx = await connected.createTransaction({
      transactions,
      options: {
        nonce,
      },
    });
    const safeTxHash = await connected.getTransactionHash(safeTx);
    const senderSignature = await connected.signHash(safeTxHash);

    await this.apiKit.proposeTransaction({
      safeAddress,
      safeTransactionData: safeTx.data,
      safeTxHash,
      senderAddress,
      senderSignature: senderSignature.data,
    });

    return safeTxHash;
  };
}
