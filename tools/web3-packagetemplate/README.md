<p align="center">
  <img src="assets/logo/web3js.jpg" width="500" alt="web3.js" />
</p>

# web3.js - Package Template

![ES Version](https://img.shields.io/badge/ES-2020-yellow)
![Node Version](https://img.shields.io/badge/node-14.x-green)

`web3-packagetemplate` contains the ideal setup for a Web3.js package.

###### Get it from the NPM Registry:

```bash
yarn add web3-packagetemplate
```

## Getting Started

-   :writing_hand: If you have questions [submit an issue](https://github.com/ChainSafe/web3.js/issues/new) or join us on [Discord](https://discord.gg/yjyvFRP)
    ![Discord](https://img.shields.io/discord/593655374469660673.svg?label=Discord&logo=discord)

## Prerequisites

-   :gear: [NodeJS](https://nodejs.org/) (LTS/Fermium)
-   :toolbox: [Yarn](https://yarnpkg.com/)/[Lerna](https://lerna.js.org/)

## Package.json Scripts

-   `build`: Runs `yarn clean` and `yarn compile`
-   `clean`: Uses `rimraf` to remove `lib/` and `buildcache/`
-   `compile`: Uses `tsc` to build package and depedenent packages
-   `lint`: Uses `prettier` and `eslint` to lint package
-   `lint:check`: Uses prettier and `eslint` to check if package has been linted
-   `test`: Uses `jest` to run all tests
-   `test:integration`: Uses `jest` to run tests under `/test/integration`
-   `test:unit`: Uses `jest` to run tests under `/test/unit`
