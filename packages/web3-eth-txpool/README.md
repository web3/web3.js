# web3-eth-txpool

This is a sub package of [web3.js][repo]

This is the personal package to be used in the `web3-eth` package.
Please read the [documentation][docs] for more.

## Installation

```bash
npm install web3-eth-txpool
```

## Usage

```js
import {TxPool} from 'web3-eth-txpool';

const txpool = new TxPool(
    'http://127.0.0.1:8546',
    null,
    options
);
```

## Types 

All the typescript typings are placed in the types folder. 

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
