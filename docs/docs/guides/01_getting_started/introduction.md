---
slug: /
sidebar_position: 1
sidebar_label: Introduction
---

# Introduction

:::warning

Web3.js libraries are being sunset on March 4th, 2025. For migration guides and more details please refer to [Chainsafe blog](https://blog.chainsafe.io/web3-js-sunset/)

:::

Web3.js is a robust and flexible collection of **TypeScript and JavaScript** libraries that allows developers to interact with local or remote [Ethereum](https://ethereum.org/en/) nodes (or **any EVM-compatible blockchain**) over **HTTP, IPC or WebSocket** connections. It is a powerful and efficient toolkit for crafting applications within the Ethereum ecosystem and beyond.

This documentation is the entrypoint to Web3.js for developers. It covers [basic](/guides/getting_started/quickstart) and [advanced](/guides/dapps/lightweight-dapp) usage with examples, and includes comprehensive [API documentation](/api) as well as guides for common tasks, like [upgrading](/guides/web3_upgrade_guide) from older versions.

## Features of Web3.js v4

-   Flexible
    -   ECMAScript (ESM) and CommonJS (CJS) builds
    -   [Plugins](/guides/web3_plugin_guide/) for extending functionality
-   Efficient
    -   Modular, [package](/#packages)-based design reduces unneeded dependencies
    -   [Tree shakable with ESM](/guides/advanced/tree_shaking)
    -   Use of native [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) (instead of large [BigNumber](https://mikemcl.github.io/bignumber.js/) libraries)
    -   Efficient ABI [encoding](/api/web3-eth-abi/function/encodeFunctionCall) & [decoding](/api/web3-eth-abi/function/decodeParameter)
-   Developer-Friendly
    -   [Dynamic contract types](/guides/smart_contracts/infer_contract_types/) & full API in TypeScript
    -   Custom output [formatters](https://docs.web3js.org/api/web3-utils/function/format)
    -   In compliance with the [Ethereum JSON-RPC Specification](https://ethereum.github.io/execution-apis/api-documentation/)

## Using These Docs

There is a lot to learn about Web3.js! Here are some tips for developers of different skill levels. Remember, you can always [reach out directly](/guides/feedback/#urgent-questions-or-concerns) with Discord or Twitter if you're feeling stuck.

### For Beginner Web3.js Developers

New Web3.js developers should proceed to the [Quickstart](/guides/getting_started/quickstart) section to learn how to get started with Web3.js. Once you understand the basics, you may want to consider learning more about [providers](/guides/web3_providers_guide/), [wallets and accounts](/guides/wallet), [smart contracts](/guides/smart_contracts/smart_contracts_guide), and how to [use Web3.js with the Hardhat development environment](/guides/hardhat_tutorial).

### For Intermediate & Advanced Web3.js Developers

If you're already familiar with Ethereum and Web3.js development, you may want to review the Web3.js [package structure](#packages--plugins) and proceed directly to the [package-level documentation](/libdocs/ABI) and [API documentation](/api). Application developers may wish to review the [Web3.js configuration guide](/guides/web3_config) or learn how to use Web3.js with tools like [EIP-6963 wallets](/guides/dapps/intermediate-dapp) or the [WalletConnect](/guides/dapps/web3_modal_guide) wallet selection modal. Don't forget to review the [list of available plugins](https://web3js.org/plugins) or even [learn how to build your own Web3.js plugin](/guides/web3_plugin_guide/plugin_authors)!

## Packages & Plugins

Web3.js is a modular collection of packages, each of which serves a specific needs. This means developers don't need to install the entire Web3 library for most use cases. Instead, necessary packages are selectively installed for a more efficient development experience. Here is an overview of a selection of available packages:

-   [**Web3Eth:**](/libdocs/Web3Eth) The `web3-eth` package is the entrypoint to Web3.js - it's the control center for managing interactions with Ethereum and other EVM-compatible networks.

-   [**Net:**](/libdocs/Net) The `web3-net` package provides discovery and interactions for an **Ethereum node's network properties.**

-   [**Accounts:**](/libdocs/Accounts) The `web3-eth-accounts` package has tools for creating Ethereum accounts and the **secure signing** of transactions and data.

-   [**Personal:**](/libdocs/Personal) Use `web3-eth-personal` for **direct communication about your accounts with the Ethereum node**, which streamlines account management during development.

    **NOTE:** _For enhanced security in production and when interacting with public nodes, consider using `web3-eth-accounts` for local signing operations, which keeps your private keys and sensitive information secure on your local machine_

-   [**Utils:**](/libdocs/Utils) The `web3-utils` package provides helpers to perform a range of essential Ethereum development tasks, including **converting data formats, checking addresses, encoding and decoding data, hashing, handling numbers, and much more.**.

-   [**Contract:**](/libdocs/Contract) The `web3-eth-contract` package makes it easy to **interact with smart contracts through JavaScript or TypeScript,** which streamlines the development process and makes it less error-prone.

-   [**ABI:**](/libdocs/ABI) The `web3-eth-abi` package simplifies decoding logs and parameters, encoding function calls and signatures, and inferring types for efficient Ethereum **smart contract interactions.**

-   [**ENS:**](/libdocs/ENS) The `web3-eth-ens` package makes it easy for developers to communicate with the **Ethereum Name Service (ENS).**

-   [**Iban:**](/libdocs/Iban) The `web3-eth-iban` package allows you to switch between **Ethereum addresses and special banking-like addresses** (IBAN or BBAN) and simplifies conversion between the types.

### Additional Supporting Packages

-   [**Web3 Core:**](/api/web3-core) subscriptions, request management, and configuration used by other Web3 packages

-   [**Web3 Types:**](/api/web3-types) data structures, objects, interfaces and types used by Web3

-   [**Web3 Validator:**](/api/web3-validator) runtime type validation against predefined types or custom schemas

-   [**Web3 Errors:**](/api/web3-errors) error codes and common error classes that are used by other Web3 packages

-   [**Web3 RPC Methods:**](/api/web3/namespace/rpcMethods) functions for making RPC requests to Ethereum using a given provider

### Plugins

Web3.js supports [plugins](/guides/web3_plugin_guide/), which are another way to encapsulate capabilities that support a specific need. There are plugins that exist to support native features, like those described by [EIPs](https://eips.ethereum.org/) as well as plugins that are designed to support specific smart contracts, middleware, or even other Ethereum-compatible networks. Visit the [Web3.js plugins homepage](https://web3js.org/plugins) to view a list of the most important Web3.js plugins, which includes:

-   [EIP-4337 (Account Abstraction) Plugin](https://www.npmjs.com/package/@chainsafe/web3-plugin-eip4337)

-   [EIP-4844 (Blob Transactions) Plugin](https://www.npmjs.com/package/web3-plugin-blob-tx)

-   [zkSync Plugin](https://www.npmjs.com/package/web3-plugin-zksync)

## Advantages Over Other Libraries

-   **Extensive Documentation and Community**: Web3.js is one of the most established Ethereum libraries, which means it benefits from extensive documentation and a large, active community. Web3.js is widely adopted and has been thoroughly tested in various production environments, and is compatible with a broad range of other tools and services in the Ethereum ecosystem.

-   **Modular Design**: Web3.js is designed to be modular, which allows developers to use specific packages according to their needs. This leads to smaller bundle sizes and faster load times for web applications.

-   **Active Development and Support**: Web3.js sees regular updates and active development. This support is crucial for developers needing assurance that the library they're using will keep pace with the evolving Ethereum landscape.
