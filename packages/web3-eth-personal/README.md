# web3-eth-personal

This is a sub package of [web3.js][repo]

This is the personal package to be used in the `web3-eth` package.
Please read the [documentation][docs] for more.

## Installation

```bash
npm install web3-eth-personal
```

## Usage

```js
import {Personal} from 'web3-eth-personal';

const personal = new Personal(
    'http://127.0.0.1:4546',
    null,
    options
);
```

## Types 

All the typescript typings are placed in the types folder. 

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
