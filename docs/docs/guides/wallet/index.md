---
sidebar_position: 6
sidebar_label: 'Web3 Wallet'
---

# web3.js Wallet Guide

## Introduction

### Local wallets

Local wallets are an in-memory [wallet](/api/web3-eth-accounts/class/Wallet/) that can hold multiple accounts.
Wallets are a convenient way to sign and send transactions in web3.js.

:::warning

If used within the browser, wallets are not saved anywhere and disappear when the page is refreshed.
If used within your application, wallets will disappear after the program is completed.

:::

### Methods

Following is a list of Wallet [methods]( /api/web3-eth-accounts/class/Wallet#Methods) in the web3-eth-accounts package with description and example usage: 

- [add]( /api/web3-eth-accounts/class/Wallet/#add)
- [clear]( /api/web3-eth-accounts/class/Wallet/#clear)
- [create]( /api/web3-eth-accounts/class/Wallet/#create)
- [decrypt]( /api/web3-eth-accounts/class/Wallet/#decrypt)
- [encrypt]( /api/web3-eth-accounts/class/Wallet/#encrypt)
- [get]( /api/web3-eth-accounts/class/Wallet/#get)
- [load]( /api/web3-eth-accounts/class/Wallet/#load)
- [remove]( /api/web3-eth-accounts/class/Wallet/#remove)
- [save]( /api/web3-eth-accounts/class/Wallet/#save)
- [getStorage]( /api/web3-eth-accounts/class/Wallet/#getStorage) 


## Creating a local wallet

```ts

// creating a new wallet
web3.eth.accounts.create() 
> Wallet(0) [
  _accountProvider: {
    create: [Function: createWithContext],
    privateKeyToAccount: [Function: privateKeyToAccountWithContext],
    decrypt: [Function: decryptWithContext]
  },
  _addressMap: Map(0) {},
  _defaultKeyName: 'web3js_wallet'
]

// add a wallet using a private key
web3.eth.accounts.wallet.add("PrivateKey");
```

## Signing a message using a wallet

``` ts

import Web3 from 'web3';

web3.eth.accounts.wallet.create(1);

const message = web3.utils.utf8ToHex('Hello world'); // sign only takes hexstrings, so turn message to hexstring
web3.eth.sign(message, 0).then(console.log); // 0 refers to using the first index of the wallet to sign the message
> {
  message: '0x48656c6c6f20776f726c64',
  messageHash: '0x8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede',
  v: '0x1c',
  r: '0x3a420906f331896cb5db1366cdaeef1f0b14f9f71d72c178e87b76f8b31f3f36',
  s: '0x32ffccc78638c1d7e46dbf16041ddaef90ab50a85eeeaa46f8c496a39237831a',
  signature: '0x3a420906f331896cb5db1366cdaeef1f0b14f9f71d72c178e87b76f8b31f3f3632ffccc78638c1d7e46dbf16041ddaef90ab50a85eeeaa46f8c496a39237831a1c'
}
```

## Sending a transaction using a local wallet

We have written a guide for sending transactions using [local wallets](/guides/basics/sign_and_send_tx/local_wallet) and [node wallets](/guides/basics/sign_and_send_tx/wallet_of_eth_node).