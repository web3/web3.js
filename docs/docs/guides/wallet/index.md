---
sidebar_position: 1
sidebar_label: 'Introduction'
---

# web3.js Wallet Guide

## Introduction

The web3-eth-accounts package contains functions to generate Ethereum accounts and sign transactions and data.

:::tip
In Ethereum, a private key is a crucial component of the cryptographic key pair used for securing and controlling ownership of Ethereum addresses. Ethereum uses a public-key cryptography system, where each Ethereum address has a corresponding pair of public and private keys. This key pair will allow you to have ownership associated with the ethereum address, store and access funds and send transactions.

Be sure to have your private key stored and encrypted in a safe place, as losing or sharing it may result in permament loss of access to the asscoiated Ethereum address and funds.

To generate a private key: `const privateKey = web3.eth.accounts.create().privateKey;`

Learn more about wallets [here](https://ethereum.org/en/wallets/)
:::


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
