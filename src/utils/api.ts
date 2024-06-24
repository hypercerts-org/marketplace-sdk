import { Maker, QuoteType, StrategyType } from "../types";
import { createClient } from "@supabase/supabase-js";
import { Database as HypercertsDatabase } from "./hypercerts-database-types";
import { CONSTANTS, parseClaimOrFractionId } from "@hypercerts-org/sdk";
import { getFractionsById } from "./graphl";
import { cacheExchange, Client, fetchExchange } from "@urql/core";

const HYPERCERTS_MARKETPLACE_API_URL = process.env.HYPERCERTS_MARKETPLACE_API_URL;
const SUPABASE_HYPERCERTS_URL = process.env.SUPABASE_HYPERCERTS_URL;
const SUPABASE_HYPERCERTS_ANON_KEY = process.env.SUPABASE_HYPERCERTS_ANON_KEY;

export const supabaseHypercerts = createClient<HypercertsDatabase>(
  SUPABASE_HYPERCERTS_URL!,
  SUPABASE_HYPERCERTS_ANON_KEY!
);

export class ApiClient {
  private _baseUrl: string;
  private _urqlClient: Client;

  constructor(indexerEnvironment: "test" | "production", private readonly baseUrl?: string) {
    const url = baseUrl || HYPERCERTS_MARKETPLACE_API_URL;
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
   * Fetches order nonce from api
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
   * Registers order in api
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
   * Fetch existing open orders from the marketplace API
   * @param signer address of the user that created the order
   * @param claimTokenIds a list of claimTokenIds - will return any order that is for one or more of these claimTokenIds
   * @param chainId chain id for the order
   * @param strategy strategy for the order
   */
  fetchOrders = async ({ signer, claimTokenIds, chainId, strategy }: Partial<FetchOrderArgs>) => {
    let baseQuery = supabaseHypercerts.from("marketplace_orders").select("*");

    if (signer) {
      baseQuery.eq("signer", signer);
    }

    if (claimTokenIds) {
      baseQuery = baseQuery.overlaps("itemIds", claimTokenIds);
    }

    if (chainId) {
      baseQuery.eq("chainId", chainId);
    }

    if (strategy) {
      baseQuery.eq("strategyId", strategy);
    }

    return baseQuery.throwOnError();
  };

  /**
   * Fetches orders from api by hypercert ID
   * @param hypercertId Hypercert ID
   * @param chainId Chain ID
   */
  fetchOrdersByHypercertId = async ({ hypercertId }: { hypercertId: string }) => {
    const fractions = await getFractionsById(hypercertId, this._urqlClient);
    const tokenIds =
      fractions?.flatMap(() => fractions.map((fraction) => parseClaimOrFractionId(fraction.fraction_id!).id)) || [];

    const result = await supabaseHypercerts.from("marketplace_orders").select("*").overlaps("itemIds", tokenIds);
    return result;
  };

  handleResponse = async <T>(res: Response) => {
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }
    return (await res.json()) as T;
  };
}

interface FetchOrderArgs {
  signer: `0x${string}`;
  claimTokenIds: string[];
  chainId: number;
  strategy: StrategyType;
}
