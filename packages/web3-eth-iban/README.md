<p align="center">
  <img src="../../assets/logo/web3js.jpg" width="200" alt="web3.js" />
</p>

# web3.js - Iban

## Installation

```bash
yarn add web3-eth-iban
```

## Package.json Scripts

- `build`: Runs `yarn clean` and `yarn compile`
- `clean`: Uses `rimraf` to remove `lib/`
- `compile`: Uses `tsc` to build package and depedenent packages
- `lint`: Uses `eslint` to lint package
- `test`: Uses `jest` to run tests

## Usage

```js
import Web3EthIban from 'web3-eth-iban';

const iban = new Web3EthIban('XE75JRZCTTLBSYEQBGAS7GID8DKR7QY0QA3');
iban.toAddress() > '0xa94f5374Fce5edBC8E2a8697C15331677e6EbF0B';
```
