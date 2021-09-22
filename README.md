<p align="center">
  <img src="assets/logo/web3js.jpg" width="500" alt="web3.js" />
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

- :writing_hand: If you have questions [submit an issue](https://github.com/ChainSafe/web3.js/issues/new) or join us on [Discord](https://discord.gg/yjyvFRP)
![Discord](https://img.shields.io/discord/593655374469660673.svg?label=Discord&logo=discord)

## Prerequisites

- :gear: [NodeJS](https://nodejs.org/) (LTS/Fermium)
- :toolbox: [Yarn](https://yarnpkg.com/)/[Lerna](https://lerna.js.org/)

## Architecture Overview

- :package: This mono-repository contains a suite of Ethereum 2.0 packages.
- :triangular_ruler: The [architecure docs](https://chainsafe.github.io/lodestar/design/architecture/) for Lodestar should give an overview over the node modules.
- :balance_scale: The mono-repositoy is released under [LGPLv3 license](./LICENSE). Note, that the packages contain their own licenses.

| Package                                                                                                                           | Version                                                                                                                                                       | License                                                                                                               | Docs                                                                                                                                             | Description                                 |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| [web3](https://github.com/ChainSafe/web3.js/tree/4.x/packages/web3)                                        | [![npm](https://img.shields.io/npm/v/web3)](https://www.npmjs.com/package/@chainsafe/lodestar)                                                 | [![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) | [![documentation](https://img.shields.io/badge/typedoc-blue)](https://web3js.readthedocs.io/en/v1.5.2/)                                     | :rotating_light: Entire Web3.js offering (includes all packages) |
