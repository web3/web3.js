# web3-providers-ws

[![NPM Package][npm-image]][npm-url] [![Dependency Status][deps-image]][deps-url] [![Dev Dependency Status][deps-dev-image]][deps-dev-url]

This is a sub-package of [web3.js][repo].

This is a websocket provider for [web3.js][repo].  

Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-providers-ws
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-providers-ws.js` in your html file.
This will expose the `Web3WsProvider` object on the window object.

## Usage

```js
// in node.js
var Web3WsProvider = require('web3-providers-ws');

var options = {
    timeout: 30000, // ms

    // Useful for credentialed urls, e.g: ws://username:password@localhost:8546
    headers: {
      authorization: 'Basic username:password'
    },

    clientConfig: {
      // Useful if requests are large
      maxReceivedFrameSize: 100000000,   // bytes - default: 1MiB
      maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

      // Useful to keep a connection alive
      keepalive: true,
      keepaliveInterval: 60000 // ms
    },

    // Enable auto reconnection
    reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false
    }
};

var ws = new Web3WsProvider('ws://localhost:8546', options);
```

Additional client config options can be found [here](https://github.com/theturtle32/WebSocket-Node/blob/v1.0.31/docs/WebSocketClient.md#client-config-options).

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-providers-ws.svg
[npm-url]: https://npmjs.org/package/web3-providers-ws
[deps-image]: https://david-dm.org/ethereum/web3.js/1.x/status.svg?path=packages/web3-providers-ws
[deps-url]: https://david-dm.org/ethereum/web3.js/1.x?path=packages/web3-providers-ws
[deps-dev-image]: https://david-dm.org/ethereum/web3.js/1.x/dev-status.svg?path=packages/web3-providers-ws
[deps-dev-url]: https://david-dm.org/ethereum/web3.js/1.x?type=dev&path=packages/web3-providers-ws
