# conflux-web-utils

This is a sub package of [ConfluxWeb.js][repo]

This contains useful utility functions for Dapp developers.   

## Installation

```bash
npm install conflux-web-utils
```

## Usage

Import all of the utils functions

```js
import * as Utils from 'conflux-web-utils';

console.log(Utils);
> {
    sha3: Function,
    soliditySha3: Function,
    isAddress: Function,
    ...
}
```

Import what you need

```js
import { asciiToHex } from 'conflux-web-utils';

console.log(asciiToHex('I have 100!'));
> "0x49206861766520313030e282ac"
```

## Types 

All the typescript typings are placed in the types folder.

[repo]: https://github.com/Conflux-Chain/ConfluxWeb
