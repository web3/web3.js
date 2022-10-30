# web3-eth-ens

[![NPM Package][npm-image]][npm-url]

This is a sub-package of [web3.js][repo].

This is the contract package to be used in the `web3-eth` package.

Please read the [documentation][docs] for more.

## Installation

You can install the package either using [NPM](https://www.npmjs.com/package/web3-eth-ens) or using [Yarn](https://yarnpkg.com/package/web3-eth-ens)

### Using NPM

```bash
npm install web3-eth-ens
```

### Using Yarn

```bash
yarn add web3-eth-ens
```

## Usage

```js
const eth = new Web3Eth(web3.currentProvider);
const ens = new EthEns(eth);

ens.getAddress('ethereum.eth').then(function(result) {
    console.log(result);
});
```

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-eth-ens.svg
[npm-url]: https://npmjs.org/package/web3-eth-ens
