---
slug: /
sidebar_position: 1
sidebar_label: Introduction
---

# Introduction

Web3.js is a robust and flexible collection of **TypeScript and JavaScript** libraries that allows developers to interact with local or remote [Ethereum](https://ethereum.org/en/) nodes (or **any EVM-compatible blockchain**) over **HTTP, IPC or WebSocket** connections. It is a powerful and efficient toolkit for crafting applications within the Ethereum ecosystem and beyond.

This documentation is the entrypoint to Web3.js for developers. It covers [basic](/guides/getting_started/quickstart) and [advanced](/guides/smart_contracts/mastering_smart_contracts) usage with examples, and includes comprehensive [API documentation](/api) as well as guides for common tasks, like [upgrading](/guides/web3_upgrade_guide/x/) from older versions.

## Features of Web3.js v4

- Flexible
  - ECMAScript (ESM) and CommonJS (CJS) builds
  - [Plugins](/guides/web3_plugin_guide/) for extending functionality
- Efficient
  - Modular, [package](/#packages)-based design reduces unneeded dependencies
  - [Tree shakable with ESM](/guides/advanced/tree_shaking)
  - Use of native [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) (instead of large [BigNumber](https://mikemcl.github.io/bignumber.js/) libraries)
  - Efficient ABI [encoding](/api/web3-eth-abi/function/encodeFunctionCall) & [decoding](/api/web3-eth-abi/function/decodeParameter)
- Developer-Friendly
  - [Dynamic contract types](/guides/smart_contracts/infer_contract_types/) & full API in TypeScript
  - Custom output [formatters](https://docs.web3js.org/api/web3-utils/function/format)
  - In compliance with the [Ethereum JSON-RPC Specification](https://ethereum.github.io/execution-apis/api-documentation/)

## Packages

Web3.js is a modular collection of packages, each of which serves a specific needs. This means developers don't need to install the entire Web3 library for most use cases. Instead, necessary packages are selectively installed for a more efficient development experience. Here is an overview of a selection of available packages:

- [**Web3Eth:**](/libdocs/Web3Eth) The `web3-eth` package is the entrypoint to Web3.js - it's the control center for managing interactions with Ethereum and other EVM-compatible networks.

- [**Net:**](/libdocs/Net) The `web3-net` package provides discovery and interactions for an **Ethereum node's network properties.**

- [**Accounts:**](/libdocs/Accounts) The `web3-eth-accounts` package has tools for creating Ethereum accounts and the **secure signing** of transactions and data.

- [**Personal:**](/libdocs/Personal) Use `web3-eth-personal` for **direct communication about your accounts with the Ethereum node**, which streamlines account management during development.

  **NOTE:** *For enhanced security in production and when interacting with public nodes, consider using `web3-eth-accounts` for local signing operations, which keeps your private keys and sensitive information secure on your local machine*

- [**Utils:**](/libdocs/Utils) The `web3-utils` package provides helpers to perform a range of essential Ethereum development tasks, including **converting data formats, checking addresses, encoding and decoding data, hashing, handling numbers, and much more.**.

- [**Contract:**](/libdocs/Contract) The `web3-eth-contract` package makes it easy to **interact with smart contracts through JavaScript or TypeScript,** which streamlines the development process and makes it less error-prone.

- [**ABI:**](/libdocs/ABI) The `web3-eth-abi` package simplifies decoding logs and parameters, encoding function calls and signatures, and inferring types for efficient Ethereum **smart contract interactions.**

- [**ENS:**](/libdocs/ENS) The `web3-eth-ens` package makes it easy for developers to communicate with the **Ethereum Name Service (ENS).**

- [**Iban:**](/libdocs/Iban) The `web3-eth-iban` package allows you to switch between **Ethereum addresses and special banking-like addresses** (IBAN or BBAN) and simplifies conversion between the types.

### Additional supporting packages 

- [**Web3 Core:**](/api/web3-core) subscriptions, request management, and configuration used by other Web3 packages

- [**Web3 Types:**](/api/web3-types) data structures, objects, interfaces and types used by Web3

- [**Web3 Validator:**](/api/web3-validator) runtime type validation against predefined types or custom schemas

- [**Web3 Errors:**](/api/web3-errors) error codes and common error classes that are used by other Web3 packages

- [**Web3 RPC Methods:**](/api/web3/namespace/rpcMethods) functions for making RPC requests to Ethereum using a given provider

## Advantages over other libraries

- **Extensive Documentation and Community**: Web3.js is one of the most established Ethereum libraries, which means it benefits from extensive documentation and a large, active community. Web3.js is widely adopted and has been thoroughly tested in various production environments, and is compatible with a broad range of other tools and services in the Ethereum ecosystem.

- **Modular Design**: Web3.js is designed to be modular, which allows developers to use specific packages according to their needs. This leads to smaller bundle sizes and faster load times for web applications.

- **Active Development and Support**: Web3.js sees regular updates and active development. This support is crucial for developers needing assurance that the library they're using will keep pace with the evolving Ethereum landscape.
