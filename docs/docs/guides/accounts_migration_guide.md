---
sidebar_position: 5
sidebar_label: Web3.eth.accounts
---

# Web3 eth accounts Migration Guide

## Breaking changes

### `create` and `wallet.create`

In 1.x `entropy` is an optional parameter for the create method, 4.x does not have `entropy` as a parameter, create method uses an audited package ethereum-cryptography/secp256k1 that is cryptographically secure random number with certain characteristics.
