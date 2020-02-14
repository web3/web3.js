# web3-crux

This is a sub package of [web3.js][repo]

This is the CRUX package to be used [web3.js][repo].
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-crux
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-crux.js` in your html file.
This will expose the `CRUX` object on the window object.

## Usage

```js
// in node.js
var CRUX = require('web3-crux');

var crux = new CRUX();
```

## Types

All the typescript typings are placed in the types folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
