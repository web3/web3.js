<p align="center">
  <img src="../../assets/logo/web3js.jpg" width="200" alt="web3.js" />
</p>

# web3.js - Web3 Core Ethereum Method

## Installation

```bash
yarn add web3-core-eth-method
```

## Package.json Scripts

-   `build`: Runs `yarn clean` and `yarn compile`
-   `clean`: Uses `rimraf` to remove `lib/` and `buildcache/`
-   `compile`: Uses `tsc` to build package and depedenent packages
-   `lint`: Uses `prettier` and `eslint` to lint package
-   `lint:check`: Uses prettier and `eslint` to check if package has been linted
-   `test`: Uses `jest` to run all tests
-   `test:integration`: Uses `jest` to run tests under `/test/integration`
-   `test:unit`: Uses `jest` to run tests under `/test/unit`
