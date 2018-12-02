# web3-utils

This is a sub package of [web3.js][repo]

This contains useful utility functions for Dapp developers.   
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-utils
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-Utils.js` in your html file.
This will expose the `Web3Utils` object on the window object.


## Usage

Import all of the utils functions

```js
import * as Utils from 'web3-utils';

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
import { asciiToHex } from 'web3-utils';

console.log(asciiToHex('I have 100!'));
> "0x49206861766520313030e282ac"
```

## Types 

If you are using TypeScript then all types are defined within the package itself so no need
to install any `@types` libraries. Just import the library and the types should be exposed.  


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
