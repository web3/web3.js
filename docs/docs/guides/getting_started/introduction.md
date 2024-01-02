---
sidebar_position: 1
sidebar_label: Introduction
---

# Introduction

Welcome to Web3.js Documentation!👋

Web3.js is a robust and flexible collection of libraries for **TypeScript and JavaScript** developers. It allows you to interact with a local or remote Ethereum node (or **any EVM-compatible blockchain**) using **HTTP, IPC or WebSocket.** It serves as an essential tool for connecting and crafting applications within the Ethereum ecosystem.

The following documentation will guide you through different use cases of Web3.js, upgrading from older versions, as well as providing an API reference documentation with examples.

## Features of Web3.js v4

-    Web3.js [Plugins Feature](/guides/web3_plugin_guide/) for extending functionality ( [List of Existing Plugins](https://web3js.org/plugins) )
-    ECMAScript (ESM) and CommonJS (CJS) builds 
-    [Tree shakable with ESM](/guides/advanced/tree_shaking)
-    [Contracts dynamic types](/guides/smart_contracts/infer_contract_types/) & full API in TypeScript
-    Using native BigInt instead of large BigNumber libraries
-    More efficient ABI Encoder & Decoder
-    Custom Output formatters
-    In compliance with Eth EL API

## Packages

Web3.js is modular, consisting of several packages, each serving specific functionalities. If you have specific tasks in mind, you don't need to install the entire Web3 library. Instead, selectively install the package that suits your requirements for a more efficient development experience. Here is an overview of the available packages:

- [**ABI:**](/libdocs/ABI) The `web3-eth-abi` package simplifies decoding logs and parameters, encoding function calls and signatures, and inferring types for efficient Ethereum **contract interactions.**

- [**Accounts:**](/libdocs/Accounts) The `web3-eth-accounts` package has tools for creating Ethereum accounts/wallets and making sure transactions and data are **securely signed.**

- [**Contract:**](/libdocs/Contract) With the `web3-eth-Contract`, you can interact with Smart contracts. This functionality allows **communication with contracts through JavaScript or TypeScript objects**, simplifying your development and interaction processes.

- [**ENS:**](/libdocs/ENS) The `web3-eth-ens` package helps you communicate with the **Ethereum Name Service (ENS)** on the blockchain.

- [**Iban:**](/libdocs/Iban) The `web3-eth-iban` package allows you to switch between **Ethereum addresses and special banking-like addresses** (IBAN or BBAN). It makes the conversion back and forth easier.

- [**Net:**](/libdocs/Net) The `web3-net` class allows you to talk about and deal with an **Ethereum node's network details.**

- [**Personal:**](/libdocs/Personal) Use `web3-eth-personal` for **direct communication with the Ethereum node about your accounts**, streamlining account management in your development workflow. 
    **NOTE:** *For enhanced security when interacting with public nodes, consider using `web3-eth-accounts` for local signing operations, keeping your private keys and sensitive information secure on your local machine*

- [**Utils:**](/libdocs/Utils) With the `web3-utils` package you can perform a range of essential tasks in Ethereum development, including **converting data formats, checking addresses, encoding and decoding, hashing, handling numbers, and much more**, providing versatile utility functions for your applications.

- [**Web3Eth:**](/libdocs/Web3Eth) The `web3-eth` is your main tool for interacting with the Ethereum blockchain. It's like the control center for managing your interactions with Ethereum.

### Additional supporting packages

- **Web3 Types:** This package has common typescript types. 

- **Web3 Validator:** This package offers functionality for validation using provided Schema. 

- **Web3 Core:** Web3 Core has configuration, Subscriptions and Requests management functionality used by other Web3 packages. 

- **Web3 Errors:** Web3 Errors has error codes and common error classes that are used by other Web3 packages. 

- **Web3 RPC Methods:** This is for advanced uses for building more lightweight applications. It has functions for making RPC requests to Ethereum using a given provider.