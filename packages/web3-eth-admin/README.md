# web3-eth-admin

This is a sub package of [web3.js][repo]

This is the admin package. This is an independent package. If you want to use this package, you need to import this in your project.
Please read the [documentation][docs] for more.

## Installation

```bash
npm install web3-eth-admin
```

## Usage

```js
import {Admin} from 'web3-eth-admin';

const admin = new Admin(
    'http://127.0.0.1:8546',
    null,
    options
);
```

## Types

All the typescript typings are placed in the types folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
