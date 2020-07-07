# web3-eth-contract

[![NPM Package][npm-image]][npm-url] [![Dependency Status][deps-image]][deps-url] [![Dev Dependency Status][deps-dev-image]][deps-dev-url]

This is a sub-package of [web3.js][repo].

This is the contract package used in the `web3-eth` package.

Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-eth-contract
```

## Usage

```js
const Web3EthContract = require('web3-eth-contract');

// Set provider for all later instances to use
Web3EthContract.setProvider('ws://localhost:8546');

const contract = new Web3EthContract(jsonInterface, address);
contract.methods.somFunc().send({from: ....})
.on('receipt', function(){
    ...
});
```

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-eth-contract.svg
[npm-url]: https://npmjs.org/package/web3-eth-contract
[deps-image]: https://david-dm.org/ethereum/web3.js/1.x/status.svg?path=packages/web3-eth-contract
[deps-url]: https://david-dm.org/ethereum/web3.js/1.x?path=packages/web3-eth-contract
[deps-dev-image]: https://david-dm.org/ethereum/web3.js/1.x/dev-status.svg?path=packages/web3-eth-contract
[deps-dev-url]: https://david-dm.org/ethereum/web3.js/1.x?type=dev&path=packages/web3-eth-contract
