import { Maker, QuoteType, StrategyType } from "../types";
import { createClient } from "@supabase/supabase-js";
import { Database as HypercertsDatabase } from "./hypercerts-database-types";
import { HypercertClient } from "@hypercerts-org/sdk";

const HYPERCERTS_MARKETPLACE_API_URL = process.env.HYPERCERTS_MARKETPLACE_API_URL;
const SUPABASE_HYPERCERTS_URL = process.env.SUPABASE_HYPERCERTS_URL;
const SUPABASE_HYPERCERTS_ANON_KEY = process.env.SUPABASE_HYPERCERTS_ANON_KEY;

export const supabaseHypercerts = createClient<HypercertsDatabase>(
  SUPABASE_HYPERCERTS_URL!,
  SUPABASE_HYPERCERTS_ANON_KEY!
);

/**
 * Fetches order nonce from api
 * @param address Address
 * @param chainId Chain ID
 */
export const fetchOrderNonce = async ({ address, chainId }: { address: string; chainId: number }) => {
  return fetch(`${HYPERCERTS_MARKETPLACE_API_URL}/marketplace/order-nonce/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address,
      chainId,
    }),
  })
    .then(
      (res) =>
        res.json() as Promise<{
          data: { nonce_counter: number; address: string; chain_id: number };
        }>
    )
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
export const registerOrder = async ({
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

  return fetch(`${HYPERCERTS_MARKETPLACE_API_URL}/marketplace/order/`, {
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
  }).then((res) => res.json() as Promise<{ success: boolean }>);
};

/**
 * Fetches orders from api by hypercert ID
 * @param hypercertId Hypercert ID
 * @param chainId Chain ID
 */
export const fetchOrdersByHypercertId = async ({ hypercertId, chainId }: { hypercertId: string; chainId: number }) => {
  const hypercertsClient = new HypercertClient({
    chain: { id: chainId },
  });

  const fractions = await hypercertsClient.indexer.fractionsByClaim(hypercertId);
  const tokenIds = fractions.claimTokens.map((fraction: any) => fraction.tokenID);

  return supabaseHypercerts.from("marketplace-orders").select("*").containedBy("itemIds", tokenIds).throwOnError();
};

interface FetchOrderArgs {
  signer: `0x${string}`;
  claimTokenIds: string[];
  chainId: number;
  strategy: StrategyType;
}

/**
 * Fetch existing open orders from the marketplace API
 * @param signer address of the user that created the order
 * @param claimTokenIds a list of claimTokenIds - will return any order that is for one or more of these claimTokenIds
 * @param chainId chain id for the order
 * @param strategy strategy for the order
 */
export const fetchOrders = async ({ signer, claimTokenIds, chainId, strategy }: Partial<FetchOrderArgs>) => {
  let baseQuery = supabaseHypercerts.from("marketplace-orders").select("*");

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
