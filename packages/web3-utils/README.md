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

Then include `dist/web3-utils.js` in your html file.
This will expose the `Web3Utils` object on the window object.


## Usage

```js
// in node.js
var Web3Utils = require('web3-utils');
console.log(Web3Utils);
{
    sha3: function(){},
    soliditySha3: function(){},
    isAddress: function(){},
    ...
}
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


