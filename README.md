# @hypercerts-org/marketplace-sdk

![GitHub package.json version](https://img.shields.io/github/package-json/v/hypercerts-org/marketplace-sdk) ![GitHub](https://img.shields.io/github/license/hypercerts-org/marketplace-sdk) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/hypercerts-org/marketplace-sdk/build.yml) ![npm](https://img.shields.io/npm/dt/@hypercerts-org/marketplace-sdk)

A collection of TypeScript tools to interact with HypercertsExchange smart contracts, enabling users to sell and buy Hypercerts on the marketplace.

## SDK usage

<!-- TODO: Check if links still work on deployment -->

Read the [guides](./guides) if you need help with the implementation.

You can also read the detailed [API documentation](./doc).

## SDK development

### Environment variables

No environment variables are required to run, build or run tests on the SDK.

### Local development

The `HypercertExchangeClient()` allows you to override the API endpoint. This can be useful for developing against a local instance of the API.

To use a locally built version of the SDK in another project, you can use `pnpm link`:

```bash
cd marketplace-sdk
pnpm install && pnpm run build
cd ../your-project
pnpm link <path to marketplace sdk on you local filesystem>
```

### Scripts

- `dev` - Run the SDK in development mode
- `build` - Build the SDK
- `test` - Run the tests
- `docs` - Generate the documentation into the `doc` folder
- `supabase:types:hypercerts` - Generate types for the `data-staging` database

## Architecture

### Lifecycle of an order

1. User A creates maker order and signs it
1. User A registers maker order with API
1. Signature on maker order gets verified by API
1. If verified correctly, order gets stored in data postgres DB
1. Order will live in DB until deleted
1. Order will be visible to other users as long as it's valid.
1. An order being executed might render it being invalid. A user can invalidate their own orders on request. There are more possible reasons, see the `OrderValidatorCode` enum located in [src/types.ts](./src/types.ts#L266) and the guide on [order validation](./guides/orderValidation.md).
   1. User B fetches order from API
   1. User B creates taker order for maker order
   1. User B signs taker order against maker order using the `HypercertExchangeClient`, found in the marketplace SDK
   1. User B calls the `executeOrder` method on the `HypercertExchangeClient` with the taker order, which calls the `HypercertExchange` contract in turn.
   1. The `HypercertExchange` contract verifies the signature and executes the order
   1. The `HypercertExchange` contract will emit an event that the order has been executed, which is picked up by the indexer which revalidates the order. If the transaction rendered the order invalid for any further sales, the error codes and validity get updated in the DB.
1. Once a maker order is invalidated it's only visible to User A.
1. Maker order can be deleted or permanently rendered invalid by declaring the nonce invalid by User A at any time.

> [!WARNING]
>
> The indexer is not listing to the OrderExecuted event yet, so the order will not be updated in the DB, unless reverified manually.

```mermaid
graph TD
    subgraph User A
        A1[Creates maker order and signs it]
        A2[Registers maker order with API]
    end

    subgraph API
        B1[Receives maker order]
        B2[Verifies signature on maker order]
        B3[Stores order in Postgres DB]
    end

    subgraph Postgres DB
        C1[Stores order]
        C2[Order visible to other users as long as it's valid]
        C3[Order validity can be updated]
        C4[Order can become invalid due to various reasons]
        C5[Marks order as invalid and stores error codes]
    end

    subgraph User B
        D1[Fetches order from API]
        D2[Creates taker order for maker order]
        D3[Signs taker order against maker order using HypercertExchangeClient]
        D4[Calls executeOrder method on HypercertExchangeClient]
    end

    subgraph HypercertExchange Contract
        E1[Verifies signature]
        E2[Executes order]
        E3[Emits OrderExecuted event]
    end

    subgraph Indexer
        F1[Picks up OrderExecuted event]
        F2[Revalidates order]
        F3[Updates error codes and validity in DB]
    end

    subgraph User A
        G1[Invalid order is only visible to User A]
        G2[Can delete or render order permanently invalid]
    end

    A1 --> A2
    A2 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> C1
    C1 --> C2
    C2 --> C3
    C3 --> D1
    C3 --> C4
    C4 --> C5
    C5 --> C6
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D4 --> E1
    E1 --> E2
    E2 --> E3
    E3 --> F1
    F1 --> F2
    F2 --> F3
    C6 --> G1
    G1 --> G2
```
