# web3-core-subscriptions

[![NPM Package][npm-image]][npm-url] [![Dependency Status][deps-image]][deps-url] [![Dev Dependency Status][deps-dev-image]][deps-dev-url]tus][deps-image]][deps-url] [![Dev Dependency Status][deps-dev-image]][deps-dev-url]

This is a sub-package of [web3.js][repo]

This subscriptions package is used within some [web3.js][repo] packages.

Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-core-subscriptions
```

## Usage

```js
const Web3Subscriptions = require('web3-core-subscriptions');

const sub = new Web3Subscriptions({
    name: 'subscribe',
    type: 'eth',
    subscriptions: {
        'newBlockHeaders': {
            subscriptionName: 'newHeads',
            params: 0,
            outputFormatter: formatters.outputBlockFormatter
        },
        'pendingTransactions': {
            params: 0,
            outputFormatter: formatters.outputTransactionFormatter
        }
    }
});
sub.attachToObject(myCoolLib);

myCoolLib.subscribe('newBlockHeaders', function(){ ... });
```

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-core-subscriptions.svg
[npm-url]: https://npmjs.org/package/web3-core-subscriptions
[deps-image]: https://david-dm.org/ethereum/web3.js/1.x/status.svg?path=packages/web3-core-subscriptions
[deps-url]: https://david-dm.org/ethereum/web3.js/1.x?path=packages/web3-core-subscriptions
[deps-dev-image]: https://david-dm.org/ethereum/web3.js/1.x/dev-status.svg?path=packages/web3-core-subscriptions
[deps-dev-url]: https://david-dm.org/ethereum/web3.js/1.x?type=dev&path=packages/web3-core-subscriptions

