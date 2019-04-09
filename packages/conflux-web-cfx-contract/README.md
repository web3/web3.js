# conflux-web-eth-contract

This is a sub package of [ConfluxWeb.js][repo]

This is the contract package to be used in the `conflux-web-cfx` package.

## Installation

```bash
npm install conflux-web-cfx-contract
```

## Usage

```js
import {Contract} from 'conflux-web-cfx-contract';

new Contract(
    'http://127.0.0.1:4546',
    abi,
    address,
    options
);
```

## Types 

All the typescript typings are placed in the types folder. 

[repo]: https://github.com/Conflux-Chain/ConfluxWeb
