# web3-eth-debug

This is a sub package of [web3.js][repo]

This is the debug package to be used in the `web3-eth` package.
Please read the [documentation][docs] for more.

## Installation

```bash
npm install web3-eth-debug
```

## Usage

```js
import {Debug} from 'web3-eth-debug';

const debug = new Debug(
    'http://127.0.0.1:8546',
    null,
    options
);
```

## Types

All the typescript typings are placed in the types folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
