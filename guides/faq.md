---
title: FAQ
group: Guides
---

# FAQ

### ❓ How to retrieve order nonce ?

Call the public API endpoint [/v1/marketplace/order-nonce](https://api.hypercerts.org/spec/#/Marketplace/UpdateOrderNonce), and use this nonce directly.

### ❓ What to do when the order is created and signed ?

Use the public API endpoint [/v1/marketplace/orders](https://api.hypercerts.org/spec/#/Marketplace/StoreOrder) to push the order to the database. After that, the order will be visible by everyone using the API. There is also a `hypercertExchangeClient.registerOrder()` utility method available.

### ❓ Why do I need to call grantTransferManagerApproval ?

When you approve a collection to be traded on the hypercerts exchange, you approve the TransferManager instead of the exchange. Calling `grantTransferManagerApproval` gives the exchange contract the right to call the transfer function on the TransferManager. You need to call this function only once, the first time you use the Hypercerts Exchange Protocol.

## Resources

🔗 [Public API documentation](https://api.hypercerts.org/spec)

🔗 [Developer discord](https://discord.gg/wxNBt2Arnc)
