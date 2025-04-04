import { Maker, OrderValidatorCode, QuoteType, StrategyType } from "../types";
import { CONSTANTS } from "@hypercerts-org/sdk";
import { getOrders } from "./graphl";
import { cacheExchange, Client, fetchExchange } from "@urql/core";

export class ApiClient {
  private _baseUrl: string;
  private readonly _urqlClient: Client;

  constructor(indexerEnvironment: "test" | "production", private readonly baseUrl?: string) {
    const url = baseUrl || `${CONSTANTS.ENDPOINTS[indexerEnvironment]}/v1`;
    if (!url) {
      throw new Error("No API URL provided");
    }
    this._baseUrl = url;

    this._urqlClient = new Client({
      url: `${CONSTANTS.ENDPOINTS[indexerEnvironment]}/v1/graphql`,
      exchanges: [cacheExchange, fetchExchange],
    });
  }

  /**
   * Fetches order nonce from API
   * @param address Address
   * @param chainId Chain ID
   */
  fetchOrderNonce = async ({ address, chainId }: { address: string; chainId: number }) => {
    return fetch(`${this._baseUrl}/marketplace/order-nonce/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        chainId,
      }),
    })
      .then((res) => this.handleResponse<{ data: { nonce_counter: number; address: string; chain_id: number } }>(res))
      .then((res) => res.data);
  };

  /**
   * Registers order in the marketplace API
   * @param order Order
   * @param signer Signer
   * @param signature Signature
   * @param quoteType Quote type
   * @param chainId Chain ID
   */
  registerOrder = async ({
    order,
    signer,
    signature,
    quoteType,
    chainId,
  }: {
    order: Maker;
    signer: string;
    signature: string;
    quoteType: QuoteType;
    chainId: number;
  }) => {
    const { globalNonce, ...orderWithoutGlobalNonce } = order;

    return fetch(`${this._baseUrl}/marketplace/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...orderWithoutGlobalNonce,
        type: "eoa",
        globalNonce: globalNonce.toString(10),
        price: order.price.toString(10),
        quoteType,
        signer,
        signature,
        chainId,
      }),
    }).then((res) => this.handleResponse<{ success: boolean }>(res));
  };

  /**
   * Registers order in the marketplace API for Safe transactions
   * @param messageHash The message hash from the Safe transaction
   * @param chainId Chain ID
   */
  registerOrderSafe = async ({
    messageHash,
    chainId,
  }: {
    messageHash: string;
    chainId: number;
  }) => {
    return fetch(`${this._baseUrl}/marketplace/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "multisig",
        messageHash,
        chainId,
      }),
    }).then((res) => this.handleResponse<{ success: boolean }>(res));
  };

  /**
   * @deprecated use GraphQL API instead
   * Fetch existing open orders from the marketplace API
   * @param signer address of the user that created the order
   * @param claimTokenIds a list of claimTokenIds - will return any order that is for one or more of these claimTokenIds
   * @param chainId chain id for the order
   * @param strategy strategy for the order
   */
  fetchOrders = async ({ signer, chainId }: Partial<FetchOrderArgs>) => {
    return await getOrders({ signer, chainId: chainId ? BigInt(chainId) : undefined }, this._urqlClient);
  };

  /**
   * @deprecated use the GraphQL API instead
   * Fetches orders from API by hypercert ID
   * @param hypercertId Hypercert ID
   * @param chainId Chain ID
   */
  fetchOrdersByHypercertId = async ({ hypercertId }: { hypercertId: string }) => {
    return getOrders({ hypercertId }, this._urqlClient);
  };

  handleResponse = async <T>(res: Response) => {
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }
    return (await res.json()) as T;
  };

  updateOrderValidity = async (tokenIds: bigint[], chainId: number) => {
    return fetch(`${this._baseUrl}/marketplace/orders/validate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokenIds: tokenIds.map((id) => id.toString()),
        chainId,
      }),
    })
      .then((res) =>
        this.handleResponse<{ data: { id: string; invalidated: boolean; validator_codes: OrderValidatorCode[] }[] }>(
          res
        )
      )
      .then((res) => res.data);
  };

  deleteOrder = async (orderId: string, signature: string) => {
    return fetch(`${this._baseUrl}/marketplace/orders`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        signature,
      }),
    })
      .then((res) => this.handleResponse<{ success: boolean }>(res))
      .then((res) => res.success);
  };
}

interface FetchOrderArgs {
  signer: `0x${string}`;
  claimTokenIds: string[];
  chainId: number;
  strategy: StrategyType;
}
