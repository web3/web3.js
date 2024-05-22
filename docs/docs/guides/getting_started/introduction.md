---
slug: /
sidebar_position: 1
sidebar_label: Introduction
---

# Introduction

Web3.js is a robust and flexible collection of **TypeScript and JavaScript** libraries that allows developers to interact with local or remote [Ethereum](https://ethereum.org/en/) nodes (or **any EVM-compatible blockchain**) using **HTTP, IPC or WebSocket.** It is a powerful and efficient toolkit for crafting applications within the Ethereum ecosystem and beyond.

This documentation is the entrypoint to Web3.js for developers. It covers [basic](/guides/getting_started/) and [advanced](/guides/smart_contracts/) usage with examples, and includes comprehensive [API documentation](/api) as well as guides for common tasks, like [upgrading](/guides/web3_upgrade_guide/x/) from older versions.

## Features of Web3.js v4

- Flexible
  - ECMAScript (ESM) and CommonJS (CJS) builds
  - [Plugins](/guides/web3_plugin_guide/) for extending functionality
- Efficient
  - [Tree shakable with ESM](/guides/advanced/tree_shaking)
  - Use of native [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) instead of large [BigNumber](https://mikemcl.github.io/bignumber.js/) libraries
  - Efficient ABI [encoding](/api/web3-eth-abi/function/encodeFunctionCall) & [decoding](/api/web3-eth-abi/function/decodeLog)
- Developer-Friendly
  - [Dynamic contract types](/guides/smart_contracts/infer_contract_types/) & full API in TypeScript
  - Custom output [formatters](https://docs.web3js.org/api/web3-utils/function/format)
  - In compliance with Eth EL API

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

## Advantages over other libraries

- **Extensive Documentation and Community**: Being one of the earliest Ethereum libraries, Web3.js benefits from extensive documentation and a large, active community. Web3.js is widely adopted and has been thoroughly tested in various production environments and is compatible with a broad range of other tools and services in the Ethereum ecosystem.

- **Modular Design**: Web3.js is designed to be modular, meaning it allows developers to use specific packages according to their needs. This may lead to smaller bundle sizes and faster load times for web applications.

- **Active Development and Support**: Web3.js sees regular updates and active development. This support is crucial for developers needing assurance that the library they're using will keep pace with the evolving Ethereum landscape.
