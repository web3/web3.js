# web3-providers-ws

This is a sub package of [web3.js][repo]

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

    // Useful if requests are large
    clientConfig: {
      maxReceivedFrameSize: 100000000,   // bytes - default: 1MiB
      maxReceivedMessageSize: 100000000, // bytes - default: 8MiB
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

(Additional client config options can be found [here][1])

[1]: https://github.com/web3-js/WebSocket-Node/blob/polyfill/globalThis/docs/WebSocketClient.md
```

## Types

All the typescript typings are placed in the types folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
