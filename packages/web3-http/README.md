# web3-http

[![NPM Package][npm-image]][npm-url] [![Dependency Status][deps-image]][deps-url] [![Dev Dependency Status][deps-dev-image]][deps-dev-url]

This is a sub-package of [web3.js][repo].

This method package is used within some [web3.js][repo] packages.

Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-http
```

## Usage

```js
var http = require('web3-http');
var httpObject = new http.Http();
var response = await httpObject.get(`http://example.com`);
```

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-http.svg
[npm-url]: https://npmjs.org/package/web3-http
[deps-image]: https://david-dm.org/ethereum/web3.js/1.x/status.svg?path=packages/web3-http
[deps-url]: https://david-dm.org/ethereum/web3.js/1.x?path=packages/web3-http
[deps-dev-image]: https://david-dm.org/ethereum/web3.js/1.x/dev-status.svg?path=packages/web3-http
[deps-dev-url]: https://david-dm.org/ethereum/web3.js/1.x?type=dev&path=packages/web3-http
