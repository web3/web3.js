<p align="center">
  <img src="assets/logo/web3js.jpg" width="300" alt="web3.js" />
</p>

# Web3.js

![ES Version](https://img.shields.io/badge/ES-2020-yellow)
![Node Version](https://img.shields.io/badge/node-14.x-green)

Web3.js is a TypeScript implementation of the [Ethereum JSON RPC API](https://eth.wiki/json-rpc/API) and related tooling maintained by [ChainSafe Systems](https://chainsafe.io).

###### Get it from the NPM Registry:

```bash
yarn add web3
```

## Getting Started

-   :writing_hand: If you have questions [submit an issue](https://github.com/ChainSafe/web3.js/issues/new/choose) or join us on [Discord](https://discord.gg/yjyvFRP)
    ![Discord](https://img.shields.io/discord/593655374469660673.svg?label=Discord&logo=discord)

## Prerequisites

-   :gear: [NodeJS](https://nodejs.org/) (LTS/Fermium)
-   :toolbox: [Yarn](https://yarnpkg.com/)/[Lerna](https://lerna.js.org/)

## Architecture Overview

| Package                                                                                           | Version                                                                                        | License                                                                                                               | Docs                                                                                         | Description                                                                                                   |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [web3](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3)                               | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3)                | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | :rotating_light: Entire Web3.js offering (includes all packages)                                              |
| [web3-core](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-core)                     | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3-core)           | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | Core functions for web3.js packages                                                                           |
| [web3-eth](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth)                       | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3-eth)            | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | Modules to interact with the Ethereum blockchain and smart contracts                                          |
| [web3-eth-abi](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth-abi)               | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3-eth-abi)        | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | Functions for encoding and decoding EVM in/output                                                             |
| [web3-eth-accounts](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth-accounts)     | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3-eth-accounts)   | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | Functions for managing Ethereum accounts and signing                                                          |
| [web3-eth-contract](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth-contract)     | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3-eth-contract)   | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | The contract package contained in [web3-eth](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth) |
| [web3-eth-ens](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth-ens)               | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3-eth-ens)        | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | Functions for interacting with the Ethereum Name Service                                                      |
| [web3-eth-iban](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth-iban)             | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3-eth-iban)       | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | Functionality for converting Ethereum addressed to IBAN addressed and vice versa                              |
| [web3-eth-personal](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth-personal)     | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3-eth-personal)   | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | Module to interact with the Ethereum blockchain accounts stored in the node                                   |
| [web3-eth-tx](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-eth-tx)                 | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3-eth-tx)         | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | [@ethereumjs/tx](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx) wrapper class     |
| [web3-net](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-net)                       | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3-net)            | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | Functions to interact with an Ethereum node's network properties                                              |
| [web3-providers-http](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-providers-http) | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3-providers-http) | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | Web3.js provider for the HTTP protocol                                                                        |
| [web3-providers-ipc](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-providers-ipc)   | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3-providers-ipc)  | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | Web3.js provider for IPC                                                                                      |
| [web3-providers-ws](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-providers-ws)     | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3-providers-ws)   | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | Web3.js provider for the Websocket protocol                                                                   |
| [web3-utils](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-utils)                   | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3-utils)          | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | Useful utility functions for Dapp developers                                                                  |
| [web3-validator](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-validator)           | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3-validator)      | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | Utilities for validating objects                                                                              |
| [web3-types](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3-types)                   | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/web3-types)          | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io) | Shared useable types                                                                                          |

## Package.json Scripts

| Script           | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
| clean            | Uses `rimraf` to remove `dist/`                                    |
| build            | Uses `tsc` to build all packages                                   |
| lint             | Uses `eslint` to lint all packages                                 |
| lint:fix         | Uses `eslint` to check and fix any warnings                        |
| format           | Uses `prettier` to format the code                                 |
| test             | Uses `jest` to run unit tests in each package                      |
| test:integration | Uses `jest` to run tests under `/test/integration` in each package |
| test:unit        | Uses `jest` to run tests under `/test/unit` in each package        |
