---
sidebar_position: 3
sidebar_label: '🔑 Accounts & Wallets'
---

# Introduction to Accounts & Wallets

The concept of an [account](https://ethereum.org/en/developers/docs/accounts/) is central to Ethereum and it can be used to refer to two types of entities that are native to Ethereum: externally-owned accounts and contract accounts. This document relates _exclusively_ to **externally-owned accounts**. An externally-owned account is associated with a "[key pair](https://ethereum.org/en/developers/docs/accounts/#externally-owned-accounts-and-key-pairs)", which is a general concept that is related to [public-key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography). The key pair consists of a private key, which must always be kept secret, and a public key, which is used to derive a public identifier (address) for an account. Ethereum accounts have an [ETH](https://ethereum.org/en/developers/docs/intro-to-ethereum/#eth) balance, which can be [transferred](/guides/transactions/transactions) to other accounts or used to pay for interactions with [smart contracts](/guides/smart_contracts/smart_contracts_guide). Anyone with access to an account's private key has the ability to control that account's ETH balance, so it's important that an account's private key is always kept secret. In addition to the general guidelines for [protecting private keys](https://ethereum.org/en/security/#protect-private-keys/), private keys should never be included in client-side code that can be seen by end users and should never be committed to code repositories.

In the context of this document, the term "wallet" refers to a collection of accounts and should not be confused with [wallet "applications"](https://ethereum.org/en/wallets/).

## Accounts

The [`web3-eth-accounts`](/api/web3-eth-accounts) package contains functions to generate Ethereum accounts, sign transactions and data, and more. In Web3.js, the [`Web3Account`](/api/web3-eth-accounts/interface/Web3Account) interface is used to represent an externally-owned account. The following snippet demonstrates using Web3.js to generate a new random account and then using that account to sign a message:

```js
// generate a new random account
const account = web3.eth.accounts.create();

console.log(account);
/* ↳
{
  address: '0x9E82491d1978217d631a3b467BF912933F54788f',
  privateKey: '<redacted>',
  signTransaction: [Function: signTransaction],
  sign: [Function: sign],
  encrypt: [Function: encrypt]
}
*/

// use the account to sign a message
const signature = account.sign('Hello, Web3.js!');
/*  ↳ 
{
  message: 'Hello, Web3.js!',
  messageHash: '0xc0f5f7ee704f1473acbb7959f5f925d787a9aa76dccc1b4914cbe77c09fd68d5',
  v: '0x1b',
  r: '0x129822b685d4404924a595af66c9cdd6367a57c66ac66e2e10fd9915d4772fbd',
  s: '0x62db48d6f5e47fe87c64a0991d6d94d23b6024d5d8335348f6686b8c46edb1e9',
  signature: '0x129822b685d4404924a595af66c9cdd6367a57c66ac66e2e10fd9915d4772fbd62db48d6f5e47fe87c64a0991d6d94d23b6024d5d8335348f6686b8c46edb1e91b'
}
*/
```

Note that many of these values will change each time the code is executed, since a new account is created each time.

In addition to generating new random accounts, the Account package can also be used to load an existing account from its private key, as in the following snippet:

```js
// load an existing account from its private key
const account = web3.eth.accounts.privateKeyToAccount('<redacted>');

console.log(account);
/* ↳
{
  address: '0x9E82491d1978217d631a3b467BF912933F54788f',
  privateKey: '<redacted>',
  signTransaction: [Function: signTransaction],
  sign: [Function: sign],
  encrypt: [Function: encrypt]
}
*/

// use the account to sign a message
const signature = account.sign('Hello, Web3.js!');
/*  ↳ 
{
  message: 'Hello, Web3.js!',
  messageHash: '0xc0f5f7ee704f1473acbb7959f5f925d787a9aa76dccc1b4914cbe77c09fd68d5',
  v: '0x1b',
  r: '0x129822b685d4404924a595af66c9cdd6367a57c66ac66e2e10fd9915d4772fbd',
  s: '0x62db48d6f5e47fe87c64a0991d6d94d23b6024d5d8335348f6686b8c46edb1e9',
  signature: '0x129822b685d4404924a595af66c9cdd6367a57c66ac66e2e10fd9915d4772fbd62db48d6f5e47fe87c64a0991d6d94d23b6024d5d8335348f6686b8c46edb1e91b'
}
*/
```

### Account Methods

The following is a list of [`Accounts`](/libdocs/Accounts) methods in the `web3.eth.accounts` package with descriptions and example usage:

-   [create](/libdocs/Accounts#create)
-   [decrypt](/libdocs/Accounts#decrypt)
-   [encrypt](/libdocs/Accounts#encrypt)
-   [hashMessage](/libdocs/Accounts#hashMessage)
-   [parseAndValidatePrivateKey](/libdocs/Accounts#libdocs/Accounts#parseandvalidateprivatekey)
-   [privateKeyToAccount](/libdocs/Accounts#privatekeytoaccount)
-   [privateKeyToAddress](/libdocs/Accounts#privatekeytoaddress)
-   [privateKeyToPublicKey](/libdocs/Accounts#privatekeytopublickey)
-   [recover](/libdocs/Accounts#recover)
-   [recoverTransaction](/libdocs/Accounts#recovertransaction)
-   [sign](/libdocs/Accounts#sign)
-   [signRaw](/libdocs/Accounts#signraw)
-   [signTransaction](/libdocs/Accounts#signtransaction)

## Wallets

A Web3.js wallet is a collection of accounts and is represented with the [`Wallet`](/api/web3-eth-accounts/class/Wallet) class. When a wallet is used to track an account, that account is added to an internal context (i.e. [`Web3Context`](/api/web3-core/class/Web3Context/)), which makes it easier to use that account in the future - this is described in more detail in the [transactions tutorial](/guides/transactions/transactions). The following snippet demonstrates creating a wallet with 2 new random accounts and using the second account to sign a message:

```js
// create a wallet with 2 new random accounts
const wallet = web3.eth.accounts.wallet.create(2);

console.log(wallet);
/* ↳
Wallet(2) [
  {
    address: '0xaaD0d33dc9800258c1265bdDA47b9266472144F7',
    privateKey: '<redacted>',
    signTransaction: [Function: signTransaction],
    sign: [Function: sign],
    encrypt: [Function: encrypt]
  },
  {
    address: '0x359caa845324802C64B97544460F31fba4f9B9ba',
    privateKey: '<redacted>',
    signTransaction: [Function: signTransaction],
    sign: [Function: sign],
    encrypt: [Function: encrypt]
  },
  _accountProvider: {
    create: [Function: createWithContext],
    privateKeyToAccount: [Function: privateKeyToAccountWithContext],
    decrypt: [Function: decryptWithContext]
  },
  _addressMap: Map(2) {
    '0xaad0d33dc9800258c1265bdda47b9266472144f7' => 0,
    '0x359caa845324802c64b97544460f31fba4f9b9ba' => 1
  },
  _defaultKeyName: 'web3js_wallet'
]
*/

// use the second account in the wallet to sign a message
const signature = wallet[1].sign('Hello, Web3.js!');
// wallet accounts can also be accessed with the "at" and "get" methods
// wallet.at(1).sign("Hello, Web3.js!")
// wallet.get(1).sign("Hello, Web3.js!")
console.log(signature);
/* ↳
{
  message: 'Hello, Web3.js!',
  messageHash: '0xc0f5f7ee704f1473acbb7959f5f925d787a9aa76dccc1b4914cbe77c09fd68d5',
  v: '0x1c',
  r: '0xd90fc42ff83fdf0ec6778c1c27f3051439de7844eacf06195c761fece19ed77d',
  s: '0x729693156c48d07df9f4970772049dbe24ebce979765f788974a13c318b2834a',
  signature: '0xd90fc42ff83fdf0ec6778c1c27f3051439de7844eacf06195c761fece19ed77d729693156c48d07df9f4970772049dbe24ebce979765f788974a13c318b2834a1c'
}
*/
```

Note that many of these values will change each time the code is executed, since new accounts are created each time.

In addition to generating new random accounts, a wallet can also be used to load an existing account from its private key, as in the following snippet:

```js
// create a wallet with a single existing account
const wallet = web3.eth.accounts.wallet.add('<redacted>');

console.log(wallet);
/* ↳
Wallet(1) [
  {
    address: '0xC978F87516152f542dc4D6f64C810B0c206b11A8',
    privateKey: '<redacted>',
    signTransaction: [Function: signTransaction],
    sign: [Function: sign],
    encrypt: [Function: encrypt]
  },
  _accountProvider: {
    create: [Function: createWithContext],
    privateKeyToAccount: [Function: privateKeyToAccountWithContext],
    decrypt: [Function: decryptWithContext]
  },
  _addressMap: Map(1) { '0xc978f87516152f542dc4d6f64c810b0c206b11a8' => 0 },
  _defaultKeyName: 'web3js_wallet'
]
*/
```

New accounts can be added to an existing wallet, as is demonstrated by the following code snippet:

```js
// create a wallet with a single random accounts
const wallet = web3.eth.accounts.wallet.create(1);

console.log(wallet);
/* ↳
Wallet(1) [
  {
    address: '0x6680D50C2165e8F1841D9CdaA42C2F1b949a39f2',
    privateKey: '<redacted>',
    signTransaction: [Function: signTransaction],
    sign: [Function: sign],
    encrypt: [Function: encrypt]
  },
  _accountProvider: {
    create: [Function: createWithContext],
    privateKeyToAccount: [Function: privateKeyToAccountWithContext],
    decrypt: [Function: decryptWithContext]
  },
  _addressMap: Map(1) { '0x6680d50c2165e8f1841d9cdaa42c2f1b949a39f2' => 0 },
  _defaultKeyName: 'web3js_wallet'
]
*/

// add a new account to the wallet with the wallet's "create" method
wallet.create(1);

console.log(wallet);
/* ↳
Wallet(2) [
  {
    address: '0x6680D50C2165e8F1841D9CdaA42C2F1b949a39f2',
    privateKey: '<redacted>',
    signTransaction: [Function: signTransaction],
    sign: [Function: sign],
    encrypt: [Function: encrypt]
  },
  {
    address: '0x5eD8a3ED6Bb1f32e4B479380cFAcf43C49a5440A',
    privateKey: '<redacted>',
    signTransaction: [Function: signTransaction],
    sign: [Function: sign],
    encrypt: [Function: encrypt]
  },
  _accountProvider: {
    create: [Function: createWithContext],
    privateKeyToAccount: [Function: privateKeyToAccountWithContext],
    decrypt: [Function: decryptWithContext]
  },
  _addressMap: Map(2) {
    '0x6680d50c2165e8f1841d9cdaa42c2f1b949a39f2' => 0,
    '0x5ed8a3ed6bb1f32e4b479380cfacf43c49a5440a' => 1
  },
  _defaultKeyName: 'web3js_wallet'
]
*/

// create a new account and add it to the wallet
const newAccount = web3.eth.accounts.create();
wallet.add(newAccount);

console.log(wallet);
/* ↳
Wallet(3) [
  {
    address: '0x6680D50C2165e8F1841D9CdaA42C2F1b949a39f2',
    privateKey: '<redacted>',
    signTransaction: [Function: signTransaction],
    sign: [Function: sign],
    encrypt: [Function: encrypt]
  },
  {
    address: '0x5eD8a3ED6Bb1f32e4B479380cFAcf43C49a5440A',
    privateKey: '<redacted>',
    signTransaction: [Function: signTransaction],
    sign: [Function: sign],
    encrypt: [Function: encrypt]
  },
  {
    address: '0x3065Cf410Bd6A10c5FF3Df8f60b82fF5Ee5db18a',
    privateKey: '<redacted>',
    signTransaction: [Function: signTransaction],
    sign: [Function: sign],
    encrypt: [Function: encrypt]
  },
  _accountProvider: {
    create: [Function: createWithContext],
    privateKeyToAccount: [Function: privateKeyToAccountWithContext],
    decrypt: [Function: decryptWithContext]
  },
  _addressMap: Map(3) {
    '0x6680d50c2165e8f1841d9cdaa42c2f1b949a39f2' => 0,
    '0x5ed8a3ed6bb1f32e4b479380cfacf43c49a5440a' => 1,
    '0x3065cf410bd6a10c5ff3df8f60b82ff5ee5db18a' => 2
  },
  _defaultKeyName: 'web3js_wallet'
]
*/
```

### Wallet Methods

The following is a list of [`Wallet`](/libdocs/Wallet) methods in the `web3.eth.accounts.wallet` package with description and example usage:

-   [add](/libdocs/Wallet#add)
-   [clear](/libdocs/Wallet#clear)
-   [create](/libdocs/Wallet#create)
-   [decrypt](/libdocs/Wallet#decrypt)
-   [encrypt](/libdocs/Wallet#encrypt)
-   [get](/libdocs/Wallet#get)
-   [load](/libdocs/Wallet#load)
-   [remove](/libdocs/Wallet#remove)
-   [save](/libdocs/Wallet#save)
-   [getStorage](/libdocs/Wallet#getStorage)

## Next Steps

This document is just an introduction to Web3.js accounts and wallets. Here are some suggestions for what to review next:

-   Learn how to [transfer ETH](/guides/transactions/transactions) from one account to another.
-   Build a front-end application that uses [injected accounts](/guides/dapps/metamask-vanilla) from the MetaMask wallet.
-   Use an account to [deploy and interact with a smart contract](/guides/smart_contracts/smart_contracts_guide).
