# web3-ccip-read

[![NPM Package][npm-image]][npm-url] [![Dependency Status][deps-image]][deps-url] [![Dev Dependency Status][deps-dev-image]][deps-dev-url]

This is a sub-package of [web3.js][repo].

This method package is used within the web3-core-method [web3.js][repo] package.

Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-ccip-read
```

## Usage

```js
if (isOffChainLookup(err, result) && isCall) {
    const options = {
        ccipReadGatewayCallback: method.ccipReadGatewayCallback,
        ccipReadGatewayUrls: method.ccipReadGatewayUrls,
        ccipReadGatewayAllowList: method.ccipReadGatewayAllowList,
    };
    const ccipReadResult = ccipReadCall(err, result, payload, send, options);
    defer.resolve(ccipReadResult);
    return;
}
```

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-ccip-read.svg
[npm-url]: https://npmjs.org/package/web3-ccip-read
[deps-image]: https://david-dm.org/ethereum/web3.js/1.x/status.svg?path=packages/web3-ccip-read
[deps-url]: https://david-dm.org/ethereum/web3.js/1.x?path=packages/web3-ccip-read
[deps-dev-image]: https://david-dm.org/ethereum/web3.js/1.x/dev-status.svg?path=packages/web3-ccip-read
[deps-dev-url]: https://david-dm.org/ethereum/web3.js/1.x?type=dev&path=packages/web3-ccip-read
