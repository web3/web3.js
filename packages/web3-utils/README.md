# web3-utils

This is a sub package of [web3.js][repo]

This contains useful utility functions for Dapp developers.
Please read the [documentation][docs] for more.

## Installation

```bash
npm install web3-utils
```

## Usage

Import all of the utils functions

```js
import * as Utils from 'web3-utils';

console.log(Utils);
> {
    keccak256: Function,
    soliditySha3: Function,
    isAddress: Function,
    ...
}
```

Import what you need

```js
import { asciiToHex } from 'web3-utils';

console.log(asciiToHex('I have 100!'));
> "0x49206861766520313030e282ac"
```

## Types

All the typescript typings are placed in the types folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
