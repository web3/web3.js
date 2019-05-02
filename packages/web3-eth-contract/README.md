# web3-eth-contract

This is a sub module of [web3.js][repo]

This is the contract module to be used in the `web3-eth` module.
Please read the [documentation][docs] for more.

## Installation

```bash
npm install web3-eth-contract
```

## Usage

```js
import {Contract} from 'web3-eth-contract';

new Contract(
    'http://127.0.0.1:4546',
    abi,
    address,
    options
);
```

## Types 

All the typescript typings are placed in the types folder. 

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
