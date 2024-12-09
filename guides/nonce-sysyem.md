---
title: Nonce System
group: Guides
---

# Nonce System

The Hypercerts Exchange implements a nonce system which enables for advanced cancellation features. Nonces are used to check orders validity, to keep track of executed orders and are specific to each user; but they also enable features, like specific or global orders cancellation.

The nonces are:

## Global nonce (`globalNonce`)

Each user address is mapped to one ask nonce and one bid nonce. The nonce on the maker order struct must match the signer's value on the chain. This can be used for canceling all pending maker bids or/and pending maker asks.

- There are 2 global nonces per user: bid nonce (when `quoteType = 0`) and ask nonce (when `quoteType = 1`).
- They are used to cancel all the bids and/or all the asks for a user.
- For an order, if its order nonce value equals the signer's global nonce value, then the order is valid. Else, it is not executable.
- Users can increment their bid and/or ask global nonces to cancel all/part of their orders.

### Example

User `0x54BE3a794282C030b15E43aE2bB182E14c409C5e` has a `globalNonce (Ask) = 2`.

The user has a signed `MakerAsk` with a `orderNonce = 1` → **This order is invalid**

The user has a signed `MakerAsk` with a `orderNonce = 2` → **This order is valid**

The user has a signed `MakerAsk` with a `orderNonce = 3` → **This order is invalid**

## Order nonce (`orderNonce`)

The order nonce is used to know whether an order can be filled, is being filled, or has been filled/cancelled. If an order has started "partial filling", it is impossible to execute other orders sharing this order nonce. The order nonce also allows the implementation of OCO orders.

A user can invalidate a order nonce (or a list of order nonces) manually in order to cancel the orders associated with these nonces.

In the context of strategies that enable partial fills, if the transaction does not fill fully the maker order, the user’s order nonce gets mapped to the order hash.

- The order nonce is mapped with a `bytes32` value.
- Each order nonce is mapped to `bytes32(0)` by default.
- When a maker order with the nonce is fully executed, the order nonce gets mapped to `keccak256("ORDER_NONCE_EXECUTED")`.
- Each order object signed by the user has to contain an order nonce.

### Example

User `0x54BE3a794282C030b15E43aE2bB182E14c409C5e` creates two maker orders with the same `orderNonce = 2`. The first order can be partially filled.

The `orderNonce 2` is by default mapped to `bytes32(0)` → **Both orders are valid**

The first order gets partially filled, the `orderNonce 2` is mapped to the first order’s hash → **The second order that shares the same `orderNonce` cannot be executed.**

_This documentation is based on and adapted from the original [LooksRare documentation](https://docs.looksrare.org/developers/protocol/triple-nonce-system-v2)._

<!--
## Subset nonce (`subsetNonce`)

Subsets nonces are part of the order object signed by the user. They come in addition to the order nonce, and serve a different purpose. They are used to group a set of arbitrary orders under the same subset nonce.

Each order is assigned a subset nonce. A subset nonce can only be cancelled manually. When a subset nonce is invalidated, all the orders sharing this subset nonce become invalid. Subset nonces can be shared across MakerAsk and MakerBid.

The protocol is agnostic of how orders are grouped together with subset nonces. It can be enforced at the application level, for example, to group all the user's orders from a single collection under the same subset nonce. Or it can be customized by the user to create custom subsets.

### Example

User `0x54BE3a794282C030b15E43aE2bB182E14c409C5e` creates 10 orders, all with the same `subsetNonce = 2`.

If 1 order is executed → All the other 9 orders remain valid.

User invalidates the `subsetNonce 2` → All the 10 orders become invalid.
-->
