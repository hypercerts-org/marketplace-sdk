# @hypercerts-org/marketplace-sdk

![GitHub package.json version](https://img.shields.io/github/package-json/v/hypercerts-org/marketplace-sdk) ![GitHub](https://img.shields.io/github/license/hypercerts-org/marketplace-sdk) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/hypercerts-org/marketplace-sdk/build.yml) ![npm](https://img.shields.io/npm/dt/@hypercerts-org/marketplace-sdk)

A collection of typescript tools to interact with HypercertsExchange smart contracts, enable users to sell and buy Hypercerts on the marketplace.


## SDK usage

Read the [guides](./docs/guides) if you need help with the implementation.

You can also read the detailed [api documentation](./doc).

## SDK development

### Environment variables

No environment variables are required to run build the SDK or run the tests.

### Local development

The `HypercertExchangeClient()` allows you to override the api endpoint. This can be useful for developing against a local instance of the API.

To use a locally built version of the SDK in another project, you can use `pnpm link`:

```bash
cd marketplace-sdk
pnpm link
cd ../your-project
pnpm link @hypercerts-org/marketplace-sdk
```

## Scripts

- `dev` - Run the SDK in development mode
- `build` - Build the SDK
- `test` - Run the tests
- `docs` - Generate the documentation into the `doc` folder
- `supabase:types:hypercerts` - Generate types for the `data-staging` database

## Lifecycle of an order

1. User A creates maker order and signs it
1. User A registers maker order with API
1. Signature on maker order gets verified
1. Order gets stored in data postgres DB
1. Order will live in DB until deleted
1. Order will be visible to other users as long as it's valid.
1. An order being executed or canceled (or many other reasons) might render it being invalid.
    1. User B fetches order from API
    1. User B creates taker order for maker order
    1. User B signs taker order against maker order using the `HypercertExchangeClient`
    1. User B calls the `executeOrder` method on the `HypercertExchangeClient` with the taker order, which calls the `HypercertExchange` contract in turn.
    1. The `HypercertExchange` contract verifies the signature and executes the order
    1. The `HypercertExchange` contract will emit an event that the order has been executed, which is picked up by the indexer which revalidates the order and updates the errors codes and validity in the DB.
    [!WARNING] Not implemented yet
    The indexer is not listing to the `OrderExecuted` event yet, so the order will not be updated in the DB, unless reverified manually.
1. Once an maker order is invalidated it's only visible to User A.
1. Maker order can be deleted or permanently rendered invalid by declaring the nonce invalid by User A at any time.

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
        C2[Order lives in DB until deleted]
        C3[Order visible to other users as long as it's valid]
        C4[Order validity can be updated]
        C5[Order can become invalid due to various reasons]
        C6[Marks order as invalid and stores error codes]
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

## Data

Order information and nonces live in the `data-staging` and `data-production` database. Nonces are invalidated on-chain, but keeping track of the current nonce for a user happens off-chain in the DB. Orders do not live on-chain, but as they are signed they can be verified.

## Architecture

