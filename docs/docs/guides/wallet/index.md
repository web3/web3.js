---
sidebar_position: 6
sidebar_label: 'Web3 Wallet'
---

# web3.js Wallet Guide

## Introduction

The web3-eth-accounts package contains functions to generate Ethereum accounts and sign transactions and data.


## web3-eth-accounts

### Methods

The following is a list of web3-eth-account [methods]( /api/web3-eth-accounts/class/Wallet#Methods) with descriptions and examples of usage: 

- [create](https://docs.web3js.org/libdocs/Accounts#create)
- [privateKeytoAccount](https://docs.web3js.org/libdocs/Accounts#privatekeytoaccount)
- [privateKeytoAddress](https://docs.web3js.org/libdocs/Accounts#privatekeytoaddress)
- [privateKeytoPublicKey](https://docs.web3js.org/libdocs/Accounts#privatekeytopublickey)
- [parseAndValidatePrivateKey](https://docs.web3js.org/libdocs/Accounts#parseandvalidateprivatekey)
- [sign](https://docs.web3js.org/libdocs/Accounts#sign)
- [signTransaction](https://docs.web3js.org/libdocs/Accounts#signtransaction)
- [recoverTransaction](https://docs.web3js.org/libdocs/Accounts#recovertransaction)
- [hashMessage](https://docs.web3js.org/libdocs/Accounts#hashmessage)
- [recover](https://docs.web3js.org/libdocs/Accounts#recover)
- [encrypt](https://docs.web3js.org/libdocs/Accounts#encrypt)
- [decrypt](https://docs.web3js.org/libdocs/Accounts#decrypt)


### Creating a Web3Account with web3 package and signing a message

``` ts
import web3 from 'web3';

const account = web3.eth.accounts.create();
{
address: '0xbD504f977021b5E5DdccD8741A368b147B3B38bB',
privateKey: 'privateKey',
signTransaction: [Function: signTransaction],
sign: [Function: sign],
encrypt: [AsyncFunction: encrypt]
}

account.sign("hello world");
{
  message: 'hello world',
  messageHash: '0xd9eba16ed0ecae432b71fe008c98cc872bb4cc214d3220a36f365326cf807d68',
  v: '0x1b',
  r: '0xe4fce466ef18f6cd8b4f4175a9a04cd2872a1a6a8cfc2ff67fb0cfd6d78ec758',
  s: '0x37ca3a789976f1854d16e50a04caf2e06ee14b0ac4a5878b43929767f2008288',
  signature: '0xe4fce466ef18f6cd8b4f4175a9a04cd2872a1a6a8cfc2ff67fb0cfd6d78ec75837ca3a789976f1854d16e50a04caf2e06ee14b0ac4a5878b43929767f20082881b'
}

```
### Creating a Web3Account with web3-eth-accounts package and signing a transaction 

``` ts

```
### Local wallets

Local wallets are an in-memory [wallet](/api/web3-eth-accounts/class/Wallet/) that can hold multiple accounts.
Wallets are a convenient way to sign and send transactions in web3.js.

:::warning

If used within the browser, wallets are not saved anywhere and disappear when the page is refreshed.
If used within your application, wallets will disappear after the program is completed.

:::

### Methods

The following is a list of Wallet [methods]( /api/web3-eth-accounts/class/Wallet#Methods) in the web3-eth-accounts package with description and example usage: 

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