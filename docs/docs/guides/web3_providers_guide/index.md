---
sidebar_position: 1
sidebar_label: 'Mastering Providers'
---

# Web3js providers overview

Providers are services that are responsible for enabling Web3.js connectivity with the Ethereum network. Using a provider to connect your application to an Ethereum node is necessary for querying data, sending transactions, and interacting with smart contracts. This guide will explore the different types of Web3.js providers, how to set them up, and how to use them in an application.

A provider is typically supplied when constructing a new `Web3` object:

```typescript title='Initialize a provider'
import { Web3 } from 'web3';

const web3 = new Web3(/* PROVIDER*/);

//calling any method that interact with the network would use the previous passed provider.
await web3.eth.getBlockNumber();
```

The new `Web3` instance will use the supplied provider to interact with the blockchain network. This interaction happens when sending requests and receiving responses, and possibly when listening to provider events (if the provider supports this).

## Providers Types

Web3.js supports several types of providers for different use cases. Here are the available types:

1. [HTTP Provider](#http-provider)
2. [WebSocket Provider](#websocket-provider)
3. [IPC Provider (for Node.js)](#ipc-provider)
4. [Third-party Providers (Compliant with EIP 1193)](#injected-provider)

HTTP and WebSocket providers can be supplied as URL strings. All provider types can be supplied by constructing one of the [`SupportedProviders`](/api/web3/namespace/types#SupportedProviders) types.

Keep reading to learn more about the different types of providers and how to use them.

### HTTP Provider

HTTP is a request-response protocol and does not support persistent connection, which means that HTTP providers are not suitable for use cases that require real-time [event subscriptions](/guides/events_subscriptions/).

``` ts title='Initialize an HTTP Provider'
import { Web3, HttpProvider } from 'web3';

//supply an HTTP provider as a URL string
//highlight-next-line
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_ID');

await web3.eth.getBlockNumber()
// ↳ 18849658n

// OR

//supply an HTTP provider by constructing a new HttpProvider
//highlight-next-line
const web3_2 = new Web3(new HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_ID'));

await web3.eth.getBlockNumber()
// ↳ 18849658n
```

### WebSocket provider

WebSockets support a persistent connection between a client and a server, which means they are suitable for use cases that require real-time [event subscriptions](/guides/events_subscriptions/).

``` ts title='Initialize WS Provider'
import { Web3, WebSocketProvider } from 'web3';

//supply a WebSocket provider as a URL string
//highlight-next-line
const web3 = new Web3('wss://mainnet.infura.io/ws/v3/YOUR_INFURA_ID');

await web3.eth.getBlockNumber();	
// ↳ 18849658n

// OR

//supply a WebSocket provider by constructing a new WebSocketProvider
//highlight-next-line
const web3_2 = new Web3(new WebSocketProvider('wss://mainnet.infura.io/ws/v3/YOUR_INFURA_ID'));

await web3.eth.getBlockNumber();
// ↳ 18849658n
```

### IPC Provider

IPC (inter-process communication) providers offer high-performance local communication and provide a faster alternative to HTTP providers. IPC providers are tailored for efficiency and excel in local environments, and also support real-time event subscriptions.

``` ts title='Initialize IPC Provider'
import { Web3 } from 'web3';
//highlight-next-line
import { IpcProvider } from 'web3-providers-ipc';

//highlight-next-line
const web3 = new Web3(new IpcProvider('/users/myuser/.ethereum/geth.ipc'));

await web3.eth.getBlockNumber();
// ↳ 18849658n
```

### Injected Provider

Injected providers are supplied by an external third-party, most often a wallet or a web browser that is designed to be used with the Ethereum network. In addition to providing network connectivity, injected providers often supply one or more [accounts](/guides/wallet/). Web3.js supports any injected provider that is compliant with [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193). Injected providers support real-time event subscriptions. Continue reading for an [example](#injected-provider-1) of using an injected provider.

## Usage Scenarios

A provider may be local to an application (i.e. running on the same machine) or remote (i.e. running on a third-party server). Injected providers are a third alternative that are supplied by an external third-party, most often a wallet or a web browser that is designed to be used with the Ethereum network. Keep reading for more examples that illustrate how to work with local, remote, and injected providers.

### Local Provider

Local providers can usually be accessed via IPC, HTTP, or WebSocket. The following examples demonstrates using a local Geth node to supply the Web3.js provider.

```typescript title='IPC, HTTP and WS provider'
import { Web3 } from 'web3';
import { IpcProvider } from 'web3-providers-ipc';

//highlight-next-line
//IPC provider
const web3 = new Web3(new IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc'));//mac os path
// on windows the path is: '\\\\.\\pipe\\geth.ipc'
// on linux the path is: '/users/myuser/.ethereum/geth.ipc'

//highlight-next-line
//HTTP provider
web3.setProvider('http://localhost:8545');
// or
web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'));

//highlight-next-line
//WebSocket provider
web3.setProvider('ws://localhost:8546');
// or
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
```

### Remote Provider

Services like [Alchemy](https://www.alchemy.com/), [Infura](https://www.infura.io/), and [QuickNode](https://www.quicknode.com/) offer Ethereum node services that can be accessed via HTTP or Websocket.

```ts title='Alchemy, Infura, etc'
// like Alchemy (https://www.alchemyapi.io/supernode)
// or infura (https://mainnet.infura.io/v3/your_infura_key)
import { Web3 } from 'web3';
const web3 = new Web3('https://eth-mainnet.alchemyapi.io/v2/your-api-key');
```

### Injected Provider

Injected providers are supplied by an external third-party, most often a wallet or a web browser that is designed to be used with the Ethereum network. In addition to providing network connectivity, injected providers often supply one or more [accounts](/guides/wallet/). Web3.js supports any injected provider that is compliant with [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) and has been tested with multiple EIP-1193 providers, including [MetaMask](https://docs.metamask.io/wallet/reference/provider-api/), [Hardhat](https://hardhat.org/hardhat-runner/docs/advanced/hardhat-runtime-environment), and [Incubed (IN3)](https://in3.readthedocs.io/en/develop/index.html).

:::note
The following example should be run in a browser with the MetaMask extension installed.
:::

```html title='E.g, Metamask'
<script src='https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js'></script>
<script>
 window.addEventListener('load', function () {
 // Check if web3 is available
  if (typeof window.ethereum !== 'undefined') {
	
    //highlight-start
    // Use the browser injected Ethereum provider
    web3 = new Web3(window.ethereum);
    //highlight-end

    // Request access to the user's MetaMask account
    window.ethereum.enable();

    // Get the user's accounts
    web3.eth.getAccounts().then(function (accounts) {
     // Show the first account
     document.getElementById('log').innerHTML = 'Connected with MetaMask account: ' + accounts[0];
    });
  } else {
    // If web3 is not available, give instructions to install MetaMask
    document.getElementById('log').innerHTML = 'Please install MetaMask to connect with the Ethereum network';
  }
 });
</script>
```

## Provider Options

There are differences in the objects that could be passed in the Provider constructors.

### HttpProvider

The options is of type `HttpProviderOptions`, which is an object with a single key named `providerOptions` and its value is an object of type `RequestInit`.
Regarding `RequestInit` see [microsoft's github](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.requestinit.html).

```ts title='HTTP Provider example'
const httpOptions = {
    providerOptions: {
        body: undefined,
        cache: 'force-cache',
        credentials: 'same-origin',
        headers: {
             'Content-Type': 'application/json',
        },
        integrity: 'foo',
        keepalive: true,
        method: 'GET',
        mode: 'same-origin',
        redirect: 'error',
        referrer: 'foo',
        referrerPolicy: 'same-origin',
        signal: undefined,
        window: undefined,
    } as RequestInit,
};
```

### WebSocketProvider

Use WebSocketProvider to connect to a Node using a WebSocket connection, i.e. over the `ws` or `wss` protocol.

The options object is of type `ClientRequestArgs` or of `ClientOptions`. See [here](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_http_d_._http_.clientrequestargs.html) for `ClientRequestArgs` and [here](https://github.com/websockets/ws) for `ClientOptions`.

The second option parameter can be given regarding reconnecting. And here is its type:

```ts title='WebSocket Provider example'
// this is the same options interface used for both WebSocketProvider and IpcProvider
type ReconnectOptions = {
  autoReconnect: boolean, // default: `true`
  delay: number, // default: `5000`
  maxAttempts: number, // default: `5`
};

```

```ts title='Instantiation of WebSocket Provider'
const provider = new WebSocketProvider(
  `ws://localhost:8545`,
  {
    headers: {
      // to provide the API key if the Node requires the key to be inside the `headers` for example:
      'x-api-key': '<Api key>',
    },
  },
  {
    delay: 500,
    autoReconnect: true,
    maxAttempts: 10,
  }
);
```

The second and the third parameters are both optional. And, for example, the second parameter could be an empty object or undefined, like in the following example:

```ts title='Instantiation of WebSocket Provider'
const provider = new WebSocketProvider(
  `ws://localhost:8545`,
  {},
  {
    delay: 500,
    autoReconnect: true,
    maxAttempts: 10,
  }
);
```

Below is an example for the passed options:

```ts title='WS Provider options example'
let clientOptions: ClientOptions = {
  // Useful for credentialed urls, e.g: ws://username:password@localhost:8546
  headers: {
    authorization: 'Basic username:password',
  },
  maxPayload: 100000000,
};

const reconnectOptions: ReconnectOptions = {
  autoReconnect: true,
  delay: 5000,
  maxAttempts: 5,
};
```

### IpcProvider

The IPC Provider could be used in node.js dapps when running a local node. And it provide the most secure connection.

It accepts a second parameter called `socketOptions`. And, its type is `SocketConstructorOpts`. See [here](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_net_d_._net_.socketconstructoropts.html) for full details. And here is its interface:

```ts title='IPC Provider options'
// for more check https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_net_d_._net_.socketconstructoropts.html
interface SocketConstructorOpts {
  fd?: number | undefined;
  allowHalfOpen?: boolean | undefined;
  readable?: boolean | undefined;
  writable?: boolean | undefined;
}
```

And, the third parameter is called `reconnectOptions` that is of the type `ReconnectOptions`. It can be given to control: auto-reconnecting, delay and max tries attempts. And here its type:

```ts
// this is the same options interface used for both WebSocketProvider and IpcProvider
type ReconnectOptions = {
  autoReconnect: boolean, // default: `true`
  delay: number, // default: `5000`
  maxAttempts: number, // default: `5`
};
```

Below is an example for the passed options for each version:

```ts title='Options Example'
let clientOptions: SocketConstructorOpts = {
	allowHalfOpen: false;
	readable: true;
	writable: true;
};

const reconnectOptions: ReconnectOptions = {
	autoReconnect: true,
	delay: 5000,
	maxAttempts: 5,
};
```

And here is a sample instantiation for the `IpcProvider`:

```ts title='IPC Provider example'
const provider = new IpcProvider(
  `path.ipc`,
  {
    writable: false,
  },
  {
    delay: 500,
    autoReconnect: true,
    maxAttempts: 10,
  }
);
```

The second and the third parameters are both optional. And, for example, the second parameter could be an empty object or undefined.

```ts title='IPC Provider example'
const provider = new IpcProvider(
  `path.ipc`,
  {},
  {
    delay: 500,
    autoReconnect: true,
    maxAttempts: 10,
  }
);
```

:::info
This section applies for both `IpcProvider` and `WebSocketProvider`.
:::

The error message, for the max reconnect attempts, will contain the value of the variable `maxAttempts` as follows:

`` `Maximum number of reconnect attempts reached! (${maxAttempts})` ``

And here is how to catch the error, if max attempts reached when there is auto reconnecting:

```ts title='Error message for reconnect attempts'
provider.on('error', (error) => {
  if (error.message.startsWith('Maximum number of reconnect attempts reached!')) {
    // the `error.message` will be `Maximum number of reconnect attempts reached! (${maxAttempts})`
    // the `maxAttempts` is equal to the provided value by the user, or the default value `5`.
  }
});
```


