import { Client, cacheExchange, fetchExchange } from "@urql/core";
import { CONSTANTS } from "@hypercerts-org/sdk";
import { graphql } from "gql.tada";

export const urqlClient = new Client({
  url: `${CONSTANTS.ENDPOINTS["test"]}/v1/graphql`,
  exchanges: [cacheExchange, fetchExchange],
});

const fractionsByIdQuery = graphql(`
  query fractionsById($fraction_id: String!) {
    fractions(where: { hypercert_id: { eq: $fraction_id } }) {
      data {
        creation_block_timestamp
        fraction_id
        last_update_block_timestamp
        owner_address
        units
      }
    }
  }
`);

export const getFractionsById = async (fractionId: string) => {
  const { data, error } = await urqlClient
    .query(fractionsByIdQuery, {
      fraction_id: fractionId,
    })
    .toPromise();

  if (error) {
    throw new Error(error.message);
  }

  return data?.fractions.data;
};
