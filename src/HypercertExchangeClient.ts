import {
  BigNumberish,
  ContractTransactionResponse,
  MaxUint256,
  Overrides,
  Provider,
  Signer,
  TypedDataDomain,
  ZeroAddress,
} from "ethers";
import { contractName, version } from "./constants/eip712";
import { currenciesByNetwork, defaultMerkleTree, MAX_ORDERS_PER_TREE, addressesByNetwork } from "./constants";
import { signMakerOrder, signMerkleTreeOrders } from "./utils/signMakerOrders";
import {
  cancelOrderNonces,
  incrementBidAskNonces,
  viewUserBidAskNonces,
} from "./utils/calls/nonces";
import { executeMultipleTakerBids, executeTakerAsk, executeTakerBid } from "./utils/calls/exchange";
import {
  grantApprovals,
  hasUserApprovedOperator,
  revokeApprovals,
} from "./utils/calls/transferManager";
import { verifyMakerOrders } from "./utils/calls/orderValidator";
import { encodeParams, getMakerParamsTypes, getTakerParamsTypes } from "./utils/encodeOrderParams";
import { allowance, approve, balanceOf, isApprovedForAll, setApprovalForAll } from "./utils/calls/tokens";
import { strategyInfo } from "./utils/calls/strategies";
import {
  ACCEPTED_ERROR_CODES,
  ErrorCurrency,
  ErrorMerkleTreeDepth,
  ErrorQuoteType,
  ErrorSigner,
  ErrorTimestamp,
} from "./errors";
import {
  Addresses,
  ChainId,
  CollectionType,
  ContractMethods,
  CreateDirectFractionsSaleMakerAskInput,
  CreateFractionalSaleMakerAskInput,
  CreateMakerAskOutput,
  CreateMakerBidOutput,
  CreateMakerInput,
  Currencies,
  Maker,
  MerkleTree,
  Order,
  OrderValidatorCode,
  QuoteType,
  SignMerkleTreeOrdersOutput,
  StrategyInfo,
  StrategyType,
  Taker,
} from "./types";
import { ApiClient } from "./utils/api";
import { CONSTANTS } from "@hypercerts-org/sdk";
import { asDeployedChain } from "@hypercerts-org/contracts";

/**
 * HypercertExchange
 * This class provides helpers to interact with the HypercertExchange V2 contracts
 */
export class HypercertExchangeClient {
  /** Current app chain ID */
  public readonly chainId: ChainId;

  /** Mapping of Hypercert protocol addresses for the current chain */
  public readonly addresses: Addresses;
  /** List of supported currencies for the current chain */
  public readonly currencies: Currencies;

  /** API client to interact with the HypercertExchange API */
  public readonly api: ApiClient;
  /**
   * Ethers signer
   * @see {@link https://docs.ethers.org/v6/api/providers/#Signer Ethers signer doc}
   */
  public readonly signer?: Signer;
  /**
   * Ethers provider. If you want a batch functionality, use JsonRpcProvider.
   * @see {@link https://docs.ethers.org/v6/api/providers/#Provider Ethers provider doc}
   */
  public readonly provider: Provider;

  /**
   * HypercertExchange protocol main class
   * @param chainId Chain id for contract interactions
   * @param provider Ethers provider
   * @param signer Ethers signer
   * @param overrides Override contract addresses or API endpoint used
   */
  constructor(
    chainId: ChainId,
    provider: Provider,
    signer?: Signer,
    overrides?: { addresses: Addresses; currencies: Currencies; apiEndpoint?: string }
  ) {
    const deployment = CONSTANTS.DEPLOYMENTS[asDeployedChain(chainId)];
    if (!deployment) {
      throw new Error("Chain not supported");
    }
    const indexerEnvironment = deployment.isTestnet ? "test" : "production";
    this.chainId = chainId;
    this.addresses = overrides?.addresses ?? addressesByNetwork[this.chainId];
    this.currencies = overrides?.currencies ?? currenciesByNetwork[this.chainId];
    this.signer = signer;
    this.provider = provider;
    this.api = new ApiClient(indexerEnvironment, overrides?.apiEndpoint);
  }

  /**
   * Return the signer if it's set, throw an exception otherwise
   * @returns Signer
   */
  private getSigner(): Signer {
    if (!this.signer) {
      throw new ErrorSigner();
    }
    return this.signer;
  }

  /**
   * Validate a timestamp format (seconds)
   * @param timestamp
   * @returns boolean
   */
  private isTimestampValid(timestamp: BigNumberish): boolean {
    return BigInt(timestamp).toString().length <= 10;
  }

  /**
   * Retrieve EIP-712 domain
   * @returns TypedDataDomain
   */
  public getTypedDataDomain(): TypedDataDomain {
    return {
      name: contractName,
      version: version.toString(),
      chainId: this.chainId,
      verifyingContract: this.addresses.EXCHANGE_V2,
    };
  }

  /**
   * Create a maker ask object ready to be signed
   * @param CreateMakerInput
   * @returns the maker object, isTransferManagerApproved, and isTransferManagerApproved
   */
  public async createMakerAsk({
    collection,
    strategyId,
    collectionType,
    subsetNonce,
    orderNonce,
    endTime,
    price,
    itemIds,
    currency = ZeroAddress,
    startTime = Math.floor(Date.now() / 1000),
    additionalParameters = [],
  }: CreateMakerInput): Promise<CreateMakerAskOutput> {
    const signer = this.getSigner();

    if (!this.isTimestampValid(startTime) || !this.isTimestampValid(endTime)) {
      throw new ErrorTimestamp();
    }

    const signerAddress = await signer.getAddress();
    const spenderAddress = this.addresses.TRANSFER_MANAGER_V2;

    // Use this.provider (MulticallProvider) in order to batch the calls
    const [isCollectionApproved, userBidAskNonce, isTransferManagerApproved] = await Promise.all([
      isApprovedForAll(this.provider, collection, signerAddress, spenderAddress),
      viewUserBidAskNonces(this.provider, this.addresses.EXCHANGE_V2, signerAddress),
      hasUserApprovedOperator(
        this.provider,
        this.addresses.TRANSFER_MANAGER_V2,
        signerAddress,
        this.addresses.EXCHANGE_V2
      ),
    ]);

    const order: Maker = {
      quoteType: QuoteType.Ask,
      globalNonce: userBidAskNonce.askNonce,
      subsetNonce: subsetNonce,
      strategyId: strategyId,
      collectionType: collectionType,
      orderNonce: orderNonce,
      collection: collection,
      currency: currency,
      signer: signerAddress,
      startTime: startTime,
      endTime: endTime,
      price: price,
      itemIds: itemIds,
      amounts: itemIds.map(_ => 1n),
      additionalParameters: encodeParams(additionalParameters, getMakerParamsTypes(strategyId)),
    };

    return {
      maker: order,
      isTransferManagerApproved,
      isCollectionApproved,
    };
  }

  /**
   * Create a maker bid object ready to be signed
   * @param CreateMakerInput
   * @returns the maker object, isCurrencyApproved, and isBalanceSufficient
   */
  public async createMakerBid({
    collection,
    strategyId,
    collectionType,
    subsetNonce,
    orderNonce,
    endTime,
    price,
    itemIds,
    currency,
    startTime = Math.floor(Date.now() / 1000),
    additionalParameters = [],
  }: CreateMakerInput): Promise<CreateMakerBidOutput> {
    const signer = this.getSigner();

    if (!this.isTimestampValid(startTime) || !this.isTimestampValid(endTime)) {
      throw new ErrorTimestamp();
    }

    if (!currency) {
      throw new ErrorCurrency();
    }

    const signerAddress = await signer.getAddress();
    const spenderAddress = this.addresses.EXCHANGE_V2;

    // Use this.provider (MulticallProvider) in order to batch the calls
    const [balance, currentAllowance, userBidAskNonce] = await Promise.all([
      balanceOf(this.provider, currency, signerAddress),
      allowance(this.provider, currency, signerAddress, spenderAddress),
      viewUserBidAskNonces(this.provider, this.addresses.EXCHANGE_V2, signerAddress),
    ]);

    const order: Maker = {
      quoteType: QuoteType.Bid,
      globalNonce: userBidAskNonce.bidNonce,
      subsetNonce: subsetNonce,
      strategyId: strategyId,
      collectionType: collectionType,
      orderNonce: orderNonce,
      collection: collection,
      currency: currency,
      signer: signerAddress,
      startTime: startTime,
      endTime: endTime,
      price: price,
      itemIds: itemIds,
      amounts: itemIds.map(_ => 1n),
      additionalParameters: encodeParams(additionalParameters, getMakerParamsTypes(strategyId)),
    };

    return {
      maker: order,
      isCurrencyApproved: BigInt(currentAllowance) >= BigInt(price),
      isBalanceSufficient: BigInt(balance) >= BigInt(price),
    };
  }

  /**
   * Create a taker ask ready to be executed against a maker bid
   * @param maker Maker order that will be used as counterparty for the taker
   * @param recipient Recipient address of the taker (if none, it will use the sender)
   * @param additionalParameters Additional parameters used to support complex orders
   * @returns Taker object
   */
  public createTaker(maker: Maker, recipient: string = ZeroAddress, additionalParameters: any[] = []): Taker {
    return {
      recipient: recipient,
      additionalParameters: encodeParams(additionalParameters, getTakerParamsTypes(maker.strategyId)),
    };
  }

  /**
   * Sign a maker order using the signer provided in the constructor
   * @param maker Order to be signed by the user
   * @returns Signature
   */
  public async signMakerOrder(maker: Maker): Promise<string> {
    const signer = this.getSigner();
    console.log("signing against", this.getTypedDataDomain(), maker);
    return await signMakerOrder(signer, this.getTypedDataDomain(), maker);
  }

  /**
   * Sign multiple maker orders with a single signature
   * /!\ Use this function for UI implementation only
   * @param makerOrders Array of maker orders
   * @returns Signature, proofs, and Merkletree object
   */
  public async signMultipleMakerOrders(makerOrders: Maker[]): Promise<SignMerkleTreeOrdersOutput> {
    if (makerOrders.length > MAX_ORDERS_PER_TREE) {
      throw new ErrorMerkleTreeDepth();
    }
    const signer = this.getSigner();
    return signMerkleTreeOrders(signer, this.getTypedDataDomain(), makerOrders);
  }

  /**
   * Execute a trade
   * @param maker Maker order
   * @param taker Taker order
   * @param signature Signature of the maker order
   * @param merkleTree Optional merkle tree
   * @returns ContractMethods
   */
  public executeOrder(
    maker: Maker,
    taker: Taker,
    signature: string,
    merkleTree: MerkleTree = defaultMerkleTree,
    overrides?: Overrides
  ): ContractMethods {
    const signer = this.getSigner();
    const execute = maker.quoteType === QuoteType.Ask ? executeTakerBid : executeTakerAsk;
    return execute(signer, this.addresses.EXCHANGE_V2, taker, maker, signature, merkleTree, overrides);
  }

  /**
   * Execute several orders
   * @param orders List of orders data
   * @param isAtomic Should the transaction revert or not if a trade fails
   * @param overrides Call overrides
   * @returns ContractMethods
   */
  public executeMultipleOrders(
    orders: {
      maker: Maker;
      taker: Taker;
      signature: string;
      merkleTree?: MerkleTree;
    }[],
    isAtomic: boolean,
    overrides?: Overrides
  ) {
    const signer = this.getSigner();

    const makers: Maker[] = [];
    const takers: Taker[] = [];
    const signatures: string[] = [];
    const merkleTrees: MerkleTree[] = [];

    orders.forEach((order) => {
      if (order.maker.quoteType === QuoteType.Bid) {
        throw new ErrorQuoteType();
      }
      makers.push(order.maker);
      takers.push(order.taker);
      signatures.push(order.signature);
      merkleTrees.push(order.merkleTree ?? defaultMerkleTree);
    });

    return executeMultipleTakerBids(
      signer,
      this.addresses.EXCHANGE_V2,
      takers,
      makers,
      signatures,
      isAtomic,
      merkleTrees,
      overrides
    );
  }

  /**
   * Cancell all maker bid and/or ask orders for the current user
   * @param bid Cancel all bids
   * @param ask Cancel all asks
   * @returns ContractMethods
   */
  public cancelAllOrders(bid: boolean, ask: boolean, overrides?: Overrides): ContractMethods {
    const signer = this.getSigner();
    return incrementBidAskNonces(signer, this.addresses.EXCHANGE_V2, bid, ask, overrides);
  }

  /**
   * Cancel a list of orders by nonce
   * @param nonces List of nonces to be cancelled
   * @returns ContractMethods
   */
  public cancelOrders(nonces: BigNumberish[], overrides?: Overrides): ContractMethods {
    const signer = this.getSigner();
    return cancelOrderNonces(signer, this.addresses.EXCHANGE_V2, nonces, overrides);
  }

  /**
   * Approve all the items of a collection, to eventually be traded on the Hypercert Exchange
   * The spender is the TransferManager.
   * @param collectionAddress Address of the collection to be approved.
   * @param approved true to approve, false to revoke the approval (default to true)
   * @returns ContractTransaction
   */
  public approveAllCollectionItems(
    collectionAddress: string,
    approved = true,
    overrides?: Overrides
  ): Promise<ContractTransactionResponse> {
    const signer = this.getSigner();
    const spenderAddress = this.addresses.TRANSFER_MANAGER_V2;
    return setApprovalForAll(signer, collectionAddress, spenderAddress, approved, overrides);
  }

  /**
   * Approve an ERC20 to be used as a currency on the Hypercert Exchange.
   * The spender is the HypercertExchangeProtocol contract.
   * @param tokenAddress Address of the ERC20 to approve
   * @param amount Amount to be approved (default to MaxUint256)
   * @returns ContractTransaction
   */
  public approveErc20(
    tokenAddress: string,
    amount: bigint = MaxUint256,
    overrides?: Overrides
  ): Promise<ContractTransactionResponse> {
    const signer = this.getSigner();
    const spenderAddress = this.addresses.EXCHANGE_V2;
    return approve(signer, tokenAddress, spenderAddress, amount, overrides);
  }

  /**
   * Check whether or not an operator has been approved by the user
   * @param operator Operator address (default to the exchange address)
   * @returns true if the operator is approved, false otherwise
   */
  public async isTransferManagerApproved(
    operator: string = this.addresses.EXCHANGE_V2,
    overrides?: Overrides
  ): Promise<boolean> {
    const signer = this.getSigner();
    const signerAddress = await signer.getAddress();
    return hasUserApprovedOperator(signer, this.addresses.TRANSFER_MANAGER_V2, signerAddress, operator, overrides);
  }

  /**
   * Grant a list of operators the rights to transfer user's assets using the transfer manager
   * @param operators List of operators (default to the exchange address)
   * @defaultValue Exchange address
   * @returns ContractMethods
   */
  public grantTransferManagerApproval(
    operators: string[] = [this.addresses.EXCHANGE_V2],
    overrides?: Overrides
  ): ContractMethods {
    const signer = this.getSigner();
    return grantApprovals(signer, this.addresses.TRANSFER_MANAGER_V2, operators, overrides);
  }

  /**
   * Revoke a list of operators the rights to transfer user's assets using the transfer manager
   * @param operators List of operators
   * @defaultValue Exchange address
   * @returns ContractMethods
   */
  public revokeTransferManagerApproval(
    operators: string[] = [this.addresses.EXCHANGE_V2],
    overrides?: Overrides
  ): ContractMethods {
    const signer = this.getSigner();
    return revokeApprovals(signer, this.addresses.TRANSFER_MANAGER_V2, operators, overrides);
  }

  /**
   * Verify if a set of orders can be executed (i.e are valid)
   * @param makerOrders List of maker orders
   * @param signatures List of signatures
   * @param merkleTrees List of merkle trees (optional)
   * @returns A list of OrderValidatorCode for each order (code 0 being valid)
   */
  public async verifyMakerOrders(
    makerOrders: Maker[],
    signatures: string[],
    merkleTrees?: MerkleTree[],
    overrides?: Overrides
  ): Promise<OrderValidatorCode[][]> {
    const _merkleTrees = merkleTrees ?? makerOrders.map(() => defaultMerkleTree);
    return verifyMakerOrders(
      this.provider,
      this.addresses.ORDER_VALIDATOR_V2,
      makerOrders,
      signatures,
      _merkleTrees,
      overrides
    );
  }

  /**
   * Utility function to check if a list of orders are valid, according to logic specific for hypercerts using order validation codes.
   * @param orders List of orders to be checked
   * @param overrides Call overrides (optional)
   */
  public async checkOrdersValidity(
    orders: Order[],
    overrides?: Overrides
  ): Promise<
    {
      id: string;
      valid: boolean;
      validatorCodes: OrderValidatorCode[];
      order: Omit<
        Order,
        "id" | "createdAt" | "invalidated" | "validator_codes"
      >;
    }[]
  > {
    // Prepare matching orders for validation
    const signatures: string[] = [];
    const makers: Maker[] = [];

    for (const order of orders) {
      const { signature, chainId } = order;
      if (chainId !== this.chainId) {
        throw new Error("Chain ID mismatch when checking order validity");
      }
      signatures.push(signature);
      const maker: Maker = {
        quoteType: order.quoteType,
        globalNonce: order.globalNonce,
        subsetNonce: order.subsetNonce,
        strategyId: order.strategyId,
        collectionType: order.collectionType,
        orderNonce: order.orderNonce,
        collection: order.collection,
        currency: order.currency,
        signer: order.signer,
        startTime: order.startTime,
        endTime: order.endTime,
        price: order.price,
        itemIds: order.itemIds,
        amounts: order.amounts,
        additionalParameters: order.additionalParameters,
      };
      makers.push(maker);
    }

    const result = await this.verifyMakerOrders(makers, signatures, undefined, overrides);
    return result.map((res, index) => {
      const order = orders[index];
      const valid = res.every((code) => ACCEPTED_ERROR_CODES.includes(code));
      return { id: order.id, valid, validatorCodes: res, order };
    });
  }

  /**
   * Retrieve strategy info
   * @param strategyId use the enum StrategyType
   * @returns StrategyInfo
   */
  public async strategyInfo(strategyId: StrategyType, overrides?: Overrides): Promise<StrategyInfo> {
    return strategyInfo(this.provider, this.addresses.EXCHANGE_V2, strategyId, overrides);
  }

  /**
   * Create a maker ask for a collection or singular offer of fractions
   * @param CreateDirectFractionsSaleMakerAskInput
   */
  public async createDirectFractionsSaleMakerAsk({
    itemIds,
    price,
    startTime,
    endTime,
    currency,
    additionalParameters = [],
  }: CreateDirectFractionsSaleMakerAskInput): Promise<CreateMakerAskOutput> {
    const address = await this.signer?.getAddress();

    if (!address) {
      throw new Error("No signer address could be determined");
    }

    if (!currency) {
      throw new ErrorCurrency();
    }

    const chainId = this.chainId;

    const { nonce_counter } = await this.api.fetchOrderNonce({
      address,
      chainId,
    });

    return this.createMakerAsk({
      // Defaults
      strategyId: StrategyType.standard,
      collectionType: 2,
      collection: this.addresses.MINTER,
      subsetNonce: 0,
      currency,
      orderNonce: nonce_counter.toString(),
      // User specified
      itemIds,
      price,
      startTime,
      endTime,
      additionalParameters,
    });
  }

  /**
   * Create a maker ask to let the buyer decide how much of a fraction they want to buy
   * @param CreateFractionalSaleMakerInput
   */
  public async createFractionalSaleMakerAsk({
    itemIds,
    price,
    startTime,
    endTime,
    currency,
    maxUnitAmount,
    minUnitAmount,
    minUnitsToKeep,
    sellLeftoverFraction,
    root,
  }: CreateFractionalSaleMakerAskInput): Promise<CreateMakerAskOutput> {
    const address = await this.signer?.getAddress();

    if (!address) {
      throw new Error("No signer address could be determined");
    }

    if (!currency) {
      throw new ErrorCurrency();
    }

    const chainId = this.chainId;

    const { nonce_counter } = await this.api.fetchOrderNonce({
      address,
      chainId,
    });

    const amounts = Array.from({ length: itemIds.length }, () => 1);

    const sharedArgs = {
      // Defaults
      collectionType: CollectionType.HYPERCERT,
      collection: this.addresses.MINTER,
      subsetNonce: 0,
      currency,
      amounts,
      orderNonce: nonce_counter.toString(),
      // User specified
      itemIds,
      price,
      startTime,
      endTime,
    };

    if (root) {
      return this.createMakerAsk({
        ...sharedArgs,
        strategyId: StrategyType.hypercertFractionOfferWithAllowlist,
        additionalParameters: [minUnitAmount, maxUnitAmount, minUnitsToKeep, sellLeftoverFraction, root],
      });
    }

    return this.createMakerAsk({
      ...sharedArgs,
      strategyId: StrategyType.hypercertFractionOffer,
      additionalParameters: [minUnitAmount, maxUnitAmount, minUnitsToKeep, sellLeftoverFraction],
    });
  }

  /**
   * Create a taker bid for buying part of a fraction
   * @param maker Maker order
   * @param recipient Recipient address of the taker (if none, it will use the sender)
   * @param unitAmount Amount of units to buy
   * @param pricePerUnit Price per unit in wei
   */
  public createFractionalSaleTakerBid(
    maker: Maker,
    recipient: string = ZeroAddress,
    unitAmount: BigNumberish,
    pricePerUnit: BigNumberish
  ): Taker {
    return {
      recipient: recipient,
      additionalParameters: encodeParams([unitAmount, pricePerUnit], getTakerParamsTypes(maker.strategyId)),
    };
  }

  /**
   * Register the order with the hypercerts marketplace API
   * @param order Maker order
   * @param signature Signature of the maker order
   */
  public async registerOrder({ order, signature }: { order: Maker; signature: string }) {
    const address = await this.signer?.getAddress();
    if (!address) {
      throw new Error("No signer address could be determined");
    }

    const chainId = this.chainId;

    return this.api.registerOrder({
      order,
      signer: address,
      signature,
      quoteType: order.quoteType,
      chainId,
    });
  }

  /**
   * Delete the order from the hypercerts marketplace API
   * @param orderId Order ID
   */
  public async deleteOrder(orderId: string) {
    const signer = this.getSigner();

    if (!signer) {
      throw new Error(`No signer address could be determined when deleting listing ${orderId}`);
    }

    const signedMessage = await signer.signMessage(`Delete listing ${orderId}`);

    return this.api.deleteOrder(orderId, signedMessage);
  }
}
