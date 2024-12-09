# FAQ

### ❓ How to retrieve order nonce ?

Call the public api endpoint [/marketplace/order-nonce](https://api.hypercerts.org/spec/#/Marketplace/UpdateOrderNonce), and use this nonce directly.

### ❓ What to do when the order is created and signed ?

Use the public api endpoint [/marketplace/orders](https://api.hypercerts.org/spec/#/Marketplace/StoreOrder) to push the order to the database. After that, the order will be visible by everyone using the API. There is also a `hypercertExchangeClient.registerOrder()` utility method available.

### ❓ When should I use merkle tree orders ?

Merkle tree orders are used to create several orders with a single signature. You shouldn't use them when using a bot. Their main purpose is to facilitate orders creation using a user interface.

### ❓ Why do I need to call grantTransferManagerApproval ?

When you approve a collection to be traded on the hypercerts exchange, you approve the TransferManager instead of the exchange. Calling `grantTransferManagerApproval` gives the exchange contract the right to call the transfer function on the TransferManager. You need to call this function only once, the first time you use the V2.

### ❓ What are subset nonces and how to use them ?

tl;dr subset nonces allow you to cancel all the orders sharing the same subset nonce.
Subset nonces allow you to group some orders together according to arbitrary rules (for example all your orders for a specific collection, all your orders above a certain threshold, etc). You can then cancel them all with a single call to `cancelSubsetOrders`.
:information_source: Unlike order nonces, executing an order with a specific subset nonce doesn't invalidate other orders sharing the same subset nonce.

## Resources

🔗 [Public API documentation](https://api.hypercerts.org/spec)

🔗 [Developer discord](https://discord.gg/PZtJ6W9S)