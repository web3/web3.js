# web3-eth-contract

[![NPM Package][npm-image]][npm-url] 

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

