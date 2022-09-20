# web3-providers-ws

[![NPM Package][npm-image]][npm-url]

This is a websocket provider sub-package for [web3.js][repo].  

Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-providers-ws
```

## Usage

```js
const Web3WsProvider = require('web3-providers-ws');

const options = {
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

const ws = new Web3WsProvider('ws://localhost:8546', options);
```

Additional client config options can be found [here](https://github.com/theturtle32/WebSocket-Node/blob/v1.0.31/docs/WebSocketClient.md#client-config-options).

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-providers-ws.svg
[npm-url]: https://npmjs.org/package/web3-providers-ws

