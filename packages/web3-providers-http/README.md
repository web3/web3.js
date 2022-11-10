# web3-providers-http

[![NPM Package][npm-image]][npm-url]

This is a HTTP provider sub-package for [web3.js][repo].

Please read the [documentation][docs] for more.

## Installation

You can install the package either using [NPM](https://www.npmjs.com/package/web3-providers-http) or using [Yarn](https://yarnpkg.com/package/web3-providers-http)

### Using NPM

```bash
npm install web3-providers-http
```

### Using Yarn

```bash
yarn add web3-providers-http
```

## Usage

```js
const http = require('http');
const Web3HttpProvider = require('web3-providers-http');

const options = {
    keepAlive: true,
    timeout: 20000, // milliseconds,
    headers: [{name: 'Access-Control-Allow-Origin', value: '*'},{...}],
    withCredentials: false,
    agent: {http: http.Agent(...), baseUrl: ''}
};

const provider = new Web3HttpProvider('http://localhost:8545', options);
```

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/dm/web3-providers-http.svg
[npm-url]: https://npmjs.org/package/web3-providers-http
