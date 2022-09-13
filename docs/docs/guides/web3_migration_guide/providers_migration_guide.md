---
title: Web3 Providers Migration Guide
sidebar_position: 2
sidebar_label: Web3.providers
---

There are multiple ways to set the provider.

```ts title='Setting a provider'
web3.setProvider(myProvider);
web3.eth.setProvider(myProvider);
web3.Contract.setProvider(myProvider);
contractInstance.setProvider(myProvider);
```

The key rule for setting provider is as follows:

1. Any provider set on the higher level will be applied to all lower levels. e.g. Any provider set using `web3.setProvider` will also be applied to `web3.eth` object.
2. For contracts `web3.Contract.setProvider` can be used to set provider for **all instances** of contracts created by `web3.eth.Contract`.

:::tip
A provider can be either `string` type or [`SupportedProviders`](/api/web3-core#SupportedProviders).
:::

## Examples

### Local Geth Node

```ts
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');
// or
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// change provider
web3.setProvider('ws://localhost:8546');
// or
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));

// Using the IPC provider in node.js
const net = require('net');
const web3 = new Web3('/Users/myuser/Library/Ethereum/geth.ipc', net); // mac os path
// or
const web3 = new Web3(
	new Web3.providers.IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', net),
); // mac os path
// on windows the path is: "\\\\.\\pipe\\geth.ipc"
// on linux the path is: "/users/myuser/.ethereum/geth.ipc"
```

### Remote Node Provider

```ts
// Using a remote node provider, like Alchemy (https://www.alchemyapi.io/supernode), is simple.
const Web3 = require('web3');
const web3 = new Web3('https://eth-mainnet.alchemyapi.io/v2/your-api-key');
```

### Injected providers

The Injected provider should be in compliance with [EIP1193](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md).

Web3.js 4.x Provider specifications are defined in https://github.com/ChainSafe/web3.js/blob/4.x/packages/web3-types/src/web3_base_provider.ts for Injected Providers

### Provider Options

There are differences in the objects that could be passed in providers' constructors.

#### HttpProvider

In `1.x` options passed in the constructor should be of type `HttpProviderOptions` (see `web3-core/types` in `1.x`). The `HttpProviderOptions` interface consists of

```ts
export interface HttpProviderOptions {
	keepAlive?: boolean;
	timeout?: number;
	headers?: HttpHeader[];
	withCredentials?: boolean;
	agent?: HttpAgent;
}

export interface HttpAgent {
	http?: http.Agent;
	https?: https.Agent;
	baseUrl?: string;
}

export interface HttpHeader {
	name: string;
	value: string;
}
```

In `4.x` the options is of type `HttpProviderOptions`, which is an object with a `providerOptions` key and value a `RequestInit` object.
Regarding `RequestInit` see [microsoft's github](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.requestinit.html)

For example:

```ts
//in 1.x
let httpOptions = {
    keepAlive: true,
    withCredentials: false,
    timeout: 20000, // ms
    headers: [
        {
            name: 'Access-Control-Allow-Origin',
            value: '*'
        },
    ],
    agent: {
        http: http.Agent(...),
        baseUrl: ''
    }
};

//in 4.x
let httpOptions = {
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

#### WebsocketProvider

In `1.x` options passed in the constructor should be of type `WebsocketProviderOptions` (see `web3-core/types` in `1.x`). The `WebsocketProviderOptions` interface consists of

```ts
export interface WebsocketProviderOptions {
	host?: string;
	timeout?: number;
	reconnectDelay?: number;
	headers?: any;
	protocol?: string;
	clientConfig?: object;
	requestOptions?: any;
	origin?: string;
	reconnect?: ReconnectOptions;
}

export interface ReconnectOptions {
	auto?: boolean;
	delay?: number;
	maxAttempts?: number;
	onTimeout?: boolean;
}
```

In `4.x` the options object is of type `ClientRequestArgs` or of `ClientOptions`. See
Regarding `RequestInit` see [here](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_http_d_._http_.clientrequestargs.html) for `ClientRequestArgs` and [here](https://github.com/websockets/ws) for `ClientOptions`

In `4.x` a second option parameter can be given regarding reconnecting.

The interface:

```ts
export type ReconnectOptions = {
	autoReconnect: boolean;
	delay: number;
	maxAttempts: number;
};
```

For example:

```ts
// in 1.x
var options = {
	timeout: 30000, // ms

	// Useful for credentialed urls, e.g: ws://username:password@localhost:8546
	headers: {
		authorization: 'Basic username:password',
	},

	clientConfig: {
		// Useful if requests are large
		maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
		maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

		// Useful to keep a connection alive
		keepalive: true,
		keepaliveInterval: 60000, // ms
	},

	// Enable auto reconnection
	reconnect: {
		auto: true,
		delay: 5000, // ms
		maxAttempts: 5,
		onTimeout: false,
	},
};
// in 4.x
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
