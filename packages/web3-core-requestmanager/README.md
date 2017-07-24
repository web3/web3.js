# web3-core-requestmanager

This is a sub package of [web3.js][repo]

The requestmanager package is used by most [web3.js][repo] packages.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-core-requestmanager
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-core-requestmanager.js` in your html file.
This will expose the `Web3RequestManager` object on the window object.


## Usage

```js
// in node.js
var Web3WsProvider = require('web3-providers-ws');
var Web3RequestManager = require('web3-core-requestmanager');

var requestManager = new Web3RequestManager(new Web3WsProvider('ws://localhost:8546'));
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


