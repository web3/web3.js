# web3-eth-ens

[![NPM Package][npm-image]][npm-url] [![Dependency Status][deps-image]][deps-url] [![Dev Dependency Status][deps-dev-image]][deps-dev-url]

This is a sub-package of [web3.js][repo].

This is the contract package to be used in the `web3-eth` package.

Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-eth-ens
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
[deps-image]: https://david-dm.org/ethereum/web3.js/1.x/status.svg?path=packages/web3-eth-ens
[deps-url]: https://david-dm.org/ethereum/web3.js/1.x?path=packages/web3-eth-ens
[deps-dev-image]: https://david-dm.org/ethereum/web3.js/1.x/dev-status.svg?path=packages/web3-eth-ens
[deps-dev-url]: https://david-dm.org/ethereum/web3.js/1.x?type=dev&path=packages/web3-eth-ens