---
title: web3.providers Migration Guide
sidebar_position: 2
sidebar_label: web3.providers
---

For full description about the providers, their priorities and their types, you can check [web3.js Providers Guide](../../web3_providers_guide/).

### Provider Options Changes

There are differences in the objects that could be passed in the Provider constructors between version 1.x and 4.x. Below, you will find the difference for every Provider object type.

#### HttpProvider

In 1.x, options passed in the constructor should be of type [`HttpProviderOptions`](https://github.com/web3/web3.js/blob/1.x/packages/web3-core-helpers/types/index.d.ts#L173). The `HttpProviderOptions` interface consists of:

```ts
interface HttpProviderOptions {
	keepAlive?: boolean;
	timeout?: number;
	headers?: HttpHeader[];
	withCredentials?: boolean;
	agent?: HttpAgent;
}

interface HttpAgent {
	http?: http.Agent;
	https?: https.Agent;
	baseUrl?: string;
}

interface HttpHeader {
	name: string;
	value: string;
}
```

In 4.x, the options is of type `HttpProviderOptions`, which is an object with a `providerOptions` key and value a `RequestInit` object.
Regarding `RequestInit` see [microsoft's github](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.requestinit.html).

For example:

```ts
// in 1.x
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

// in 4.x
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

#### WebSocketProvider

In 1.x, options passed in the constructor should be of type [`WebsocketProviderOptions`](https://github.com/web3/web3.js/blob/1.x/packages/web3-core-helpers/types/index.d.ts#L192). The `WebsocketProviderOptions` interface consists of:

```ts
interface WebsocketProviderOptions {
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

interface ReconnectOptions {
	auto?: boolean;
	delay?: number;
	maxAttempts?: number;
	onTimeout?: boolean;
}
```

In 4.x, the `socketOptions` parameter is of type `ClientRequestArgs` or of `ClientOptions`. See [here](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_http_d_._http_.clientrequestargs.html) for `ClientRequestArgs` and [here](https://github.com/websockets/ws) for `ClientOptions`.

In 4.x the `reconnectOptions` parameter can be given to control: auto-reconnecting, delay and max tries attempts. And here is its type:

```ts
// this is the same options interface used for both WebSocketProvider and IpcProvider
type ReconnectOptions = {
	autoReconnect: boolean; // default: `true`
	delay: number; // default: `5000`
	maxAttempts: number; // default: `5`
};
```

##### Options examples

Below is an example for the passed options for each version:

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

And here is a sample instantiation for the `WebSocketProvider`:

```ts
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
	},
);
```

The second and the third parameters are both optional. And you can for example, the second parameter could be an empty object or undefined, like in the following example:

```ts
const provider = new WebSocketProvider(
	`ws://localhost:8545`,
	{},
	{
		delay: 500,
		autoReconnect: true,
		maxAttempts: 10,
	},
);
```

#### Legacy Event `close` has been deprecated

Following EIP-1193, the `close` event has been deprecated and is superceded by `disconnect`.
In 1.x, we listen for a `close` event:

```ts
const provider = new WebSocketProvider(host + port);
// we would use close to listen to the disconnect function
provider.on('close', function (err) {
	console.log('closed');
	resolve();
});
provider.disconnect(1012);
// would eventually log closed
```

In 4.x, we listen for a `disconnect` event:

```ts
const provider = new WebSocketProvider(host + port);
// we would use disconnect to listen to the disconnect function
provider.on('disconnect', function (err) {
	console.log('closed');
	resolve();
});
provider.disconnect(1012);
// would eventually log 'closed'
```

#### IpcProvider

The IPC provider is used in node.js dapps when running a local node. And it provide the most secure connection.

In 1.x, it used to accept the path and an instance of net.Server as in the following example:

```ts
import * as net from 'net';

const ipcProvider = new IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', new net.Server());
```

In 4.x, it's no longer installed by default as its nodejs modules are impacting web3.js browser usage.
You can use it by installing `web3-providers-ipc` and creating a new instance. Since it's compatible with Eip1193Provider,
you can pass it on to the Web3 instance.

```ts
import { IpcProvider } from 'web3-providers-ipc';

const ipcProvider = new IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc');
```

It accepts a second parameter called `socketOptions`. And, its type is `SocketConstructorOpts`. See [here](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_net_d_._net_.socketconstructoropts.html) for full details. And here is its interface:

```ts
interface SocketConstructorOpts {
	fd?: number | undefined;
	allowHalfOpen?: boolean | undefined;
	readable?: boolean | undefined;
	writable?: boolean | undefined;
	signal?: AbortSignal;
}
```

In 4.x the third parameter is called `reconnectOptions` that is of the type `ReconnectOptions`. It can be given to control: auto-reconnecting, delay and max tries attempts. And here its type:

```ts
// this is the same options interface used for both WebSocketProvider and IpcProvider
type ReconnectOptions = {
	autoReconnect: boolean; // default: `true`
	delay: number; // default: `5000`
	maxAttempts: number; // default: `5`
};
```

##### Options examples

Below is an example for the passed options for each version:

```ts
// in 1.x
var net = require('net');

new Web3.providers.IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', net); // mac os path
// on windows the path is: "\\\\.\\pipe\\geth.ipc"
// on linux the path is: "/users/myuser/.ethereum/geth.ipc"

// in 4.x
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

```ts
import { IpcProvider } from 'web3-providers-ipc';

const provider = new IpcProvider(
	`path.ipc`,
	{
		writable: false,
	},
	{
		delay: 500,
		autoReconnect: true,
		maxAttempts: 10,
	},
);
```

The second and the third parameters are both optional. And, for example, the second parameter could be an empty object or undefined.

```ts
import { IpcProvider } from 'web3-providers-ipc';

const provider = new IpcProvider(
	`path.ipc`,
	{},
	{
		delay: 500,
		autoReconnect: true,
		maxAttempts: 10,
	},
);
```

#### Error message for reconnect attempts

:::note
This section applies for both `IpcProvider` and `WebSocketProvider`.
:::

The error in, version 1.x, was an Error object that contains the message:
`'Maximum number of reconnect attempts reached!'`

And, the error in version 4.x, is the same, but will also contain the value of the variable `maxAttempts` as follows:

`` `Maximum number of reconnect attempts reached! (${maxAttempts})` ``

And here is how to catch the error, in version 4.x, if max attempts reached when there is auto reconnecting:

```ts
provider.on('error', error => {
	if (error.message.startsWith('Maximum number of reconnect attempts reached!')) {
		// the `error.message` will be `Maximum number of reconnect attempts reached! (${maxAttempts})`
		// the `maxAttempts` is equal to the provided value by the user, or the default value `5`.
	}
});
```

#### Legacy Event `close` has been deprecated

Following EIP-1193, the `close` event has been deprecated and is superseded by `disconnect`.
In 1.x, we listen for a `close` event:

```ts
const provider = new IpcProvider(host + port);
// we would use close to listen to the disconnect function
provider.on('close', function (err) {
	console.log('closed');
	resolve();
});
provider.disconnect(1012);
// would eventually log closed
```

In 4.x, we listen for a `disconnect` event:

```ts
const provider = new IpcProvider(host + port);
// we would use disconnect to listen to the disconnect function
provider.on('disconnect', function (err) {
	console.log('closed');
	resolve();
});
provider.disconnect(1012);
// would eventually log 'closed'
```
