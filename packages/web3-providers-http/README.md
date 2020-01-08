# web3-providers-http

_This is a sub package of [web3.js][repo]_

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
var http = require('http');
var Web3HttpProvider = require('web3-providers-http');

var options = {
    keepAlive: true,
    timeout: 20000, // milliseconds,
    headers: [{name: 'Access-Control-Allow-Origin', value: '*'},{...}],
    withCredentials: false,
    agent: {http: http.Agent(...), baseUrl: ''}
};

var provider = new Web3HttpProvider('http://localhost:8545', options);
```

## Types

All the typescript typings are placed in the types folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
