---
sidebar_position: 1
sidebar_label: 'Mastering Providers'
---

# Web3.js Providers Overview

Providers are services that are responsible for enabling Web3.js connectivity with the Ethereum network. Using a provider to connect your application to an Ethereum node is necessary for querying data, sending transactions, and interacting with smart contracts. This guide will explore the different types of Web3.js providers, how to set them up, and how to use them in an application.

A provider is typically supplied when constructing a new `Web3` object:

```typescript title='Initialize a provider'
import { Web3 } from 'web3';

const web3 = new Web3(/* PROVIDER*/);

// calling any method that interacts with the network will use the supplied provider
await web3.eth.getBlockNumber();
```

The new `Web3` instance will use the supplied provider to interact with the blockchain network. This interaction happens when sending requests and receiving responses, and possibly when listening to provider events (if the provider supports this).

## Providers Types

Web3.js supports several types of providers for different use cases. Here are the available types:

1. [HTTP Provider](#http-provider)
2. [WebSocket Provider](#websocket-provider)
3. [IPC Provider (for Node.js)](#ipc-provider)
4. [Injected Providers (Compliant with EIP 1193)](#injected-provider)

HTTP and WebSocket providers can be supplied as URL strings. All provider types can be supplied by constructing one of the [`SupportedProviders`](/api/web3/namespace/types#SupportedProviders) types.

Keep reading to learn more about the different types of providers and how to use them.

### HTTP Provider

HTTP is a request-response protocol and does not support persistent connection, which means that HTTP providers are not suitable for use cases that require real-time [event subscriptions](/guides/events_subscriptions/).

``` ts title='Initialize an HTTP Provider'
import { Web3, HttpProvider } from 'web3';

// supply an HTTP provider as a URL string
// highlight-next-line
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_ID');

await web3.eth.getBlockNumber()
// ↳ 18849658n

// OR

// supply an HTTP provider by constructing a new HttpProvider
// highlight-next-line
const web3_2 = new Web3(new HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_ID'));

await web3.eth.getBlockNumber()
// ↳ 18849658n
```

#### Configuring HTTP Providers

HTTP providers can be configured by including an [`HttpProviderOptions`](/api/web3-providers-http/interface/HttpProviderOptions/) object in the [`HttpProvider` constructor](/api/web3-providers-http/class/HttpProvider#constructor). The `HttpProviderOptions` type has a single property, `providerOptions`, which is a standard TypeScript [`RequestInit`](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.requestinit.html) object.

```ts title='Configuring an HTTP Provider'
import { Web3, HttpProvider } from 'web3';

const httpOptions = {
    providerOptions: {
        body: undefined,
        cache: 'force-cache',
        credentials: 'same-origin',
        headers: {
             'Content-Type': 'application/json',
        },
        integrity: undefined,
        keepalive: true,
        method: 'GET',
        mode: 'same-origin',
        redirect: 'error',
        referrer: undefined,
        referrerPolicy: 'same-origin',
        signal: undefined,
        window: undefined,
    } as RequestInit,
};

const web3 = new Web3(new HttpProvider('https://eth.llamarpc.com', httpOptions));
```

### WebSocket Provider

WebSockets support a persistent connection between a client and a server, which means they are suitable for use cases that require real-time [event subscriptions](/guides/events_subscriptions/).

``` ts title='Initialize WS Provider'
import { Web3, WebSocketProvider } from 'web3';

// supply a WebSocket provider as a URL string
// highlight-next-line
const web3 = new Web3('wss://mainnet.infura.io/ws/v3/YOUR_INFURA_ID');

await web3.eth.getBlockNumber();	
// ↳ 18849658n

// OR

// supply a WebSocket provider by constructing a new WebSocketProvider
// highlight-next-line
const web3_2 = new Web3(new WebSocketProvider('wss://mainnet.infura.io/ws/v3/YOUR_INFURA_ID'));

await web3.eth.getBlockNumber();
// ↳ 18849658n
```

#### Configuring WebSocket Providers

The [`WebSocketProvider` constructor](/api/web3-providers-ws/class/WebSocketProvider#constructor) accepts two optional parameters that can be used to configure the behavior of the `WebSocketProvider`: the first parameter must be of type [`ClientRequestArgs`](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_http_d_._http_.clientrequestargs.html) or of [`ClientOptions`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/e5ee5eae6a592198e469ad9f412bab8d223fcbb6/types/ws/index.d.ts#L243) and the second parameter must be of type [`ReconnectOptions`](/api/web3/namespace/utils#ReconnectOptions).

```ts title='Configuring a WebSocket Provider'
// include both optional parameters
const provider = new WebSocketProvider(
  `ws://localhost:8545`,
  {
    headers: {
      // for node services that require an API key in a header
      'x-api-key': '<API key>',
    },
  },
  {
    delay: 500,
    autoReconnect: true,
    maxAttempts: 10,
  }
);

// OR include only ReconnectOptions
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

### IPC Provider

IPC (inter-process communication) providers offer high-performance local communication and provide a faster alternative to HTTP providers. IPC providers are tailored for efficiency and excel in local environments, and also support real-time [event subscriptions](/guides/events_subscriptions/).

``` ts title='Initialize IPC Provider'
import { Web3 } from 'web3';
// highlight-next-line
import { IpcProvider } from 'web3-providers-ipc';

// highlight-next-line
const web3 = new Web3(new IpcProvider('/users/myuser/.ethereum/geth.ipc'));

await web3.eth.getBlockNumber();
// ↳ 18849658n
```

#### Configuring IPC Providers

The [`IpcProvider` constructor](/api/web3-providers-ipc/class/IpcProvider#constructor) accepts two optional parameters that can be used to configure the behavior of the `IpcProvider`: the first parameter must be of type [`SocketConstructorOpts`](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_net_d_._net_.socketconstructoropts.html) and the second parameter must be of type [`ReconnectOptions`](/api/web3/namespace/utils#ReconnectOptions).



```ts title='Configuring an IPC Provider'
// include both optional parameters
const provider = new IpcProvider(
  '/Users/myuser/Library/Ethereum/geth.ipc',
  {
    writable: false,
  },
  {
    delay: 500,
    autoReconnect: true,
    maxAttempts: 10,
  }
);

// OR include only ReconnectOptions
const provider = new IpcProvider(
  '/Users/myuser/Library/Ethereum/geth.ipc',
  {},
  {
    delay: 500,
    autoReconnect: true,
    maxAttempts: 10,
  }
);
```

### Injected Provider

Injected providers are supplied by an external third-party, most often a wallet or a web browser that is designed to be used with the Ethereum network. In addition to providing network connectivity, injected providers often supply one or more [accounts](/guides/wallet/). Web3.js supports any injected provider that is compliant with [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193). Injected providers support real-time [event subscriptions](/guides/events_subscriptions/). Continue reading for an [example](#injected-provider-1) of using an injected provider.

## Provider Origins

A provider may be local to an application (i.e. running on the same machine) or remote (i.e. running on a third-party server). Injected providers are a third alternative that are supplied by an external third-party, most often a wallet or a web browser that is designed to be used with the Ethereum network. Keep reading for more examples that illustrate how to work with local, remote, and injected providers.

### Local Provider

Local providers can usually be accessed via IPC, HTTP, or WebSocket. The following examples demonstrates using a local Geth node to supply the Web3.js provider.

```typescript title='IPC, HTTP and WS provider'
import { Web3 } from 'web3';
import { IpcProvider } from 'web3-providers-ipc';

// highlight-next-line
// IPC provider
const web3 = new Web3(new IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc'));
// the path above is for macOS
// on Windows the path is: '\\\\.\\pipe\\geth.ipc'
// on Linux the path is: '/users/myuser/.ethereum/geth.ipc'

// highlight-next-line
// HTTP provider
web3.setProvider('http://localhost:8545');
// OR
web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'));

// highlight-next-line
// WebSocket provider
web3.setProvider('ws://localhost:8546');
// OR
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
```

### Remote Provider

Services like [Alchemy](https://www.alchemy.com/), [Infura](https://www.infura.io/), and [QuickNode](https://www.quicknode.com/) offer Ethereum node services that can be accessed via HTTP or Websocket.

```ts title='Alchemy, Infura, etc'
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
  // check if web3 is available
  if (typeof window.ethereum !== 'undefined') {
	
    // highlight-start
    // use the browser injected Ethereum provider
    web3 = new Web3(window.ethereum);
    // highlight-end

    // request access to the user's MetaMask account
    window.ethereum.enable();

    // get the user's accounts
    web3.eth.getAccounts().then(function (accounts) {
     // show the first account
     document.getElementById('log').innerHTML = 'Connected with MetaMask account: ' + accounts[0];
    });
  } else {
    // if window.ethereum is not available, give instructions to install MetaMask
    document.getElementById('log').innerHTML = 'Please install MetaMask to connect with the Ethereum network';
  }
 });
</script>
```
