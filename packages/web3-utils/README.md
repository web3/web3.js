# web3-utils

This is a sub package of [web3.js][repo]

This contains useful utility functions for Dapp developers.  
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-utils
```



### Browser

There are three ways to use this package in the browser:

- Install it with ``npm`` and bundle it with the preferred bundler.
- Use the ``unpkg`` or ``jsdelivr`` CDN.
- Install it with ``npm`` and load the minified file from the ``node_modules`` folder.

This injects a object with all utility functions attached.

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

## Types

All the typescript typings are placed in the types folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
