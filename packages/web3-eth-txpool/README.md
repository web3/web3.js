# web3-eth-txpool

This is a sub package of [web3.js][repo]

This is the TxPool module. This is an independent module. If you want to use this module, you need to import it in your project.
Please read the [documentation][docs] for more.

## Installation

```bash
npm install web3-eth-txpool
```

## Usage

```js
import {TxPool} from 'web3-eth-txpool';

const txPool = new TxPool(
    'http://127.0.0.1:8546',
    null,
    options
);
```

## Types

All the typescript typings are placed in the types folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
