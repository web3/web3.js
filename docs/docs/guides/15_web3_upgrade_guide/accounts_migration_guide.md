---
sidebar_position: 5
sidebar_label: web3.eth.accounts
---

# web3.eth.accounts Migration Guide

## Breaking Changes

### web3.eth.accounts.create and wallet.create

In 1.x the create method has an optional parameter `entropy`.

In 4.x the create method does not have `entropy` as a parameter. Instead 4.x uses an audited package [ethereum-cryptography/secp256k1](https://github.com/ethereum/js-ethereum-cryptography#secp256k1-curve) to generate private keys.

Accounts:

```typescript
// In 1.x
const account = web3.eth.accounts.create('optionalEntropy'); // entropy is an optional parameter

// In 4.x
const account = web3.eth.accounts.create('optionalEntropy'); // will result in an error
const account = web3.eth.accounts.create(); // correct way
```

Wallets:

```typescript
// In 1.x
const wallet = web3.eth.accounts.wallet.create(1, 'optionalEntropy'); // entropy is an optional parameter

// In 4.x
const account = web3.eth.accounts.wallet.create(1, 'optionalEntropy'); // will result in an error
const account = web3.eth.accounts.wallet.create(); // correct way
```

## stripHexPrefix method

In 1.x `stripHexPrefix` method is located in the `web3-utils` package, in 4.x this has been moved to `web3-eth-accounts`

```typescript
import { stripHexPrefix } from 'web3-eth-accounts';

console.log(stripHexPrefix('0x123')); // "123"
```
