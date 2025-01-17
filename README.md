<p align="center">
  <img src="assets/logo/web3js.jpg" width="300" alt="web3.js" />
</p>

# Web3.js

### Web3.js libraries are being sunset on March 4th, 2025. For migration guides and more details please refer to [Chainsafe blog](https://blog.chainsafe.io/web3-js-sunset/)

[![Dependency Status][downloads-image]][npm-url] ![Unit Test Coverage](https://img.shields.io/codecov/c/github/web3/web3.js/4.x?label=unit%20test%20coverage)
![Commit Activity](https://img.shields.io/github/commit-activity/m/web3/web3.js/4.x?label=commit%20activity%20on%204.x)
![Contributors](https://img.shields.io/github/contributors/web3/web3.js?label=contributors%20on%20all%20branches)

![ES Version](https://img.shields.io/badge/ES-2020-yellow)
![Node Version](https://img.shields.io/badge/node-14.x-green)

Web3.js is a TypeScript implementation of the [Ethereum JSON RPC API](https://eth.wiki/json-rpc/API) and related tooling maintained by [ChainSafe Systems](https://chainsafe.io).

## Installation

You can install the package either using [NPM](https://www.npmjs.com/package/web3) or using [Yarn](https://yarnpkg.com/package/web3)

> If you wanna checkout latest bugfix or feature, use `npm install web3@dev`

### Using NPM

```bash
npm install web3
```

### Using Yarn

```bash
yarn add web3
```

## Getting Started

-   :writing_hand: If you have questions [submit an issue](https://github.com/ChainSafe/web3.js/issues/new/choose) or join us on [Discord](https://discord.gg/yjyvFRP)
    ![Discord](https://img.shields.io/discord/593655374469660673.svg?label=Discord&logo=discord)

## Prerequisites

-   :gear: [NodeJS](https://nodejs.org/) (LTS/Fermium)
-   :toolbox: [Yarn](https://yarnpkg.com/)/[Lerna](https://lerna.js.org/)

## Migration Guide

-   [Migration Guide from Web3.js 1.x to 4.x](https://docs.web3js.org/guides/web3_upgrade_guide/index)
    Breaking changes are listed in migration guide and its first step for migrating from Web3.js 1.x to 4.x. If there is any question or discussion feel free to ask in [Discord](https://discord.gg/yjyvFRP), and in case of any bug or new feature request [open issue](https://github.com/web3/web3.js/issues/new) or create a pull request for [contributions](https://github.com/web3/web3.js/blob/4.x/.github/CONTRIBUTING.md).

## Useful links

-   [Web3 tree shaking support guide](https://docs.web3js.org/guides/advanced/tree_shaking/)
-   [React App Example](https://github.com/ChainSafe/web3js-example-react-app)

## Architecture Overview

| Package                                                                                           | Version                                                                                                                                                                           | License                                                                                                               | Docs                                                                                                           | Description                                                                                                   |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [web3](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3)                               | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3%2Fpackage.json)](https://www.npmjs.com/package/web3)                               | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3)                | :rotating_light: Entire Web3.js offering (includes all packages)                                              |
| [web3-core](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-core)                     | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-core%2Fpackage.json)](https://www.npmjs.com/package/web3-core)                     | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3-core)           | Core functions for web3.js packages                                                                           |
| [web3-errors](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-errors)                 | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-errors%2Fpackage.json)](https://www.npmjs.com/package/web3-core)                   | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3-errors)         | Errors Objects                                                                                                |
| [web3-eth](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth)                       | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-eth%2Fpackage.json)](https://www.npmjs.com/package/web3-eth)                       | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3-eth)            | Modules to interact with the Ethereum blockchain and smart contracts                                          |
| [web3-eth-abi](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth-abi)               | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-eth-abi%2Fpackage.json)](https://www.npmjs.com/package/web3-eth-abi)               | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3-eth-abi)        | Functions for encoding and decoding EVM in/output                                                             |
| [web3-eth-accounts](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth-accounts)     | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-eth-accounts%2Fpackage.json)](https://www.npmjs.com/package/web3-eth-accounts)     | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3-eth-accounts)   | Functions for managing Ethereum accounts and signing                                                          |
| [web3-eth-contract](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth-contract)     | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-eth-contract%2Fpackage.json)](https://www.npmjs.com/package/web3-eth-contract)     | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3-eth-contract)   | The contract package contained in [web3-eth](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth) |
| [web3-eth-ens](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth-ens)               | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-eth-ens%2Fpackage.json)](https://www.npmjs.com/package/web3-eth-ens)               | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3-eth-ens)        | Functions for interacting with the Ethereum Name Service                                                      |
| [web3-eth-iban](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth-iban)             | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-eth-iban%2Fpackage.json)](https://www.npmjs.com/package/web3-eth-iban)             | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3-eth-iban)       | Functionality for converting Ethereum addressed to IBAN addressed and vice versa                              |
| [web3-eth-personal](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth-personal)     | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-eth-personal%2Fpackage.json)](https://www.npmjs.com/package/web3-eth-personal)     | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3-eth-personal)   | Module to interact with the Ethereum blockchain accounts stored in the node                                   |
| [web3-net](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-net)                       | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-net%2Fpackage.json)](https://www.npmjs.com/package/web3-net)                       | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3-net)            | Functions to interact with an Ethereum node's network properties                                              |
| [web3-providers-http](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-providers-http) | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-providers-http%2Fpackage.json)](https://www.npmjs.com/package/web3-providers-http) | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3-providers-http) | Web3.js provider for the HTTP protocol                                                                        |
| [web3-providers-ipc](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-providers-ipc)   | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-providers-ipc%2Fpackage.json)](https://www.npmjs.com/package/web3-providers-ipc)   | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3-providers-ipc)  | Web3.js provider for IPC                                                                                      |
| [web3-providers-ws](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-providers-ws)     | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-providers-ws%2Fpackage.json)](https://www.npmjs.com/package/web3-providers-ws)     | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3-providers-ws)   | Web3.js provider for the Websocket protocol                                                                   |
| [web3-rpc-methods](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-rpc-methods)       | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-rpc-methods%2Fpackage.json)](https://www.npmjs.com/package/web3-types)             | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/)                    | RPC Methods                                                                                                   |
| [web3-types](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-types)                   | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-types%2Fpackage.json)](https://www.npmjs.com/package/web3-types)                   | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3-types)          | Shared useable types                                                                                          |
| [web3-utils](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-utils)                   | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-utils%2Fpackage.json)](https://www.npmjs.com/package/web3-utils)                   | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3-utils)          | Useful utility functions for Dapp developers                                                                  |
| [web3-validator](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-validator)           | [![npm](https://img.shields.io/github/package-json/v/web3/web3.js/4.x?filename=packages%2Fweb3-validator%2Fpackage.json)](https://www.npmjs.com/package/web3-validator)           | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://docs.web3js.org/api/web3-validator)      | Utilities for validating objects                                                                              |

## Package.json Scripts

| Script                         | Description                                                        |
| ------------------------------ | ------------------------------------------------------------------ |
| clean                          | Uses `rimraf` to remove `dist/`                                    |
| build                          | Uses `tsc` to build all packages                                   |
| lint                           | Uses `eslint` to lint all packages                                 |
| lint:fix                       | Uses `eslint` to check and fix any warnings                        |
| format                         | Uses `prettier` to format the code                                 |
| test                           | Uses `jest` to run unit tests in each package                      |
| test:integration               | Uses `jest` to run tests under `/test/integration` in each package |
| test:unit                      | Uses `jest` to run tests under `/test/unit` in each package        |
| test:manual:long-connection-ws | Runs manual tests for keeping a long WebSocket connection          |
| test:manual                    | Runs manual tests under `test/manual` in the web3 package          |

[npm-url]: https://npmjs.org/package/web3
[downloads-image]: https://img.shields.io/npm/dm/web3?label=npm%20downloads
