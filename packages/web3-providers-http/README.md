# web3-providers-http

*This is a sub package of [web3.js][repo]*

This is a HTTP provider for [web3.js][repo].   
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-providers-http
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-providers-http.js` in your html file.
This will expose the `Web3HttpProvider` object on the window object.


## Usage

```js
// in node.js
var Web3HttpProvider = require('web3-providers-http');

var options = {
    timeout: 20000, // milliseconds,
    headers: [{name: 'Access-Control-Allow-Origin', value: '*'},{...}]
};
var http = new Web3HttpProvider('http://localhost:8545', options);
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


