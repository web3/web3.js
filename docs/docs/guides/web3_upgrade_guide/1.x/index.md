---
sidebar_position: 1
sidebar_label: 'Upgrade from 1.x'
---

# Upgrade from 1.x

This upgrade guide is for upgrading from web3.js 1.x to web3.js 4.x.

## Breaking Changes

### The `web3` package will return all web3.js exported objects

`require('web3')` will now return all web3 exported-objects organized in namespaces (and few are available on top level). So, it is no longer supported to write the following code:

```ts
// This will return the name space and the line after it will throw an error!
const Web3 = require('web3');

const web3 = new Web3();
```

And the correct usage now is:

```ts
const { Web3 } = require('web3');

const web3 = new Web3();
```

### Passing Callbacks to functions

Passing callbacks to functions is no longer supported, except for event listeners.

For example, the approach to subscribing-to and listening-for blockchain events has changed in version 4.x. Detailed instructions can be found in the [**`web3.eth.subscribe` Migration Guide**](./subscribe_migration_guide.md#subscribing-to-events).

However, the approach to subscribing to Provider events remains the same, utilizing callbacks as explained in the [Providers Events Listening guide](../../web3_providers_guide/events_listening.md). It is important to note that Providers have undergone some breaking changes, including the renaming of the `on('close', ...)` to `on('disconnect', ...)`.

### Not Implemented or Exported

-   [extend](https://web3js.readthedocs.io/en/v1.7.3/web3.html#extend) Extending web3 modules functionality is not implemented
-   [web3.bzz](https://web3js.readthedocs.io/en/v1.7.3/web3-bzz.html) Package for interacting with Swarm is not implemented
-   [web3.shh](https://web3js.readthedocs.io/en/v1.7.3/web3-shh.html) Package for interacting with Whisper is not implemented

`const web3 = new Web3(Web3.givenProvider);`

It will not have:

```ts
// web3.bzz is NOT available
// web3.shh is NOT available
// web3.extend is NOT available
```

### Defaults and Configs

-   `givenProvider` default value is `undefined` instead of `null`
-   `currentProvider` default value is `undefined` instead of `null` (if web3 is instantiated without a provider)

### Web3 BatchRequest

```ts
const batch = new web3.BatchRequest();
```

#### batch.add()

In 1.x nothing was returned, in 4.x returns a deferred promise which can be used to run specific code after completion of each respective request.

```ts
// in 1.x
batch.add(
	web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback),
);

// in 4.x

const request1 = {
	jsonrpc: '2.0',
	id: 10,
	method: 'eth_getBalance',
	params: ['0xf4ffff492596ac13fee6126846350433bf9a5021', 'latest'],
};
const request2 = {
	jsonrpc: '2.0',
	id: 12,
	method: 'eth_getBalance',
	params: ['0xdc6bad79dab7ea733098f66f6c6f9dd008da3258', 'latest'],
};
batch.add(request1);
const request2Promise = batch.add(request2);
request2Promise.then(response => {
	console.log(response);
});
```

#### batch.execute()

In 4.x execute returns a promise, where 1.x was based on the callbacks of requests passed to `add`.

```ts
// in 1.x
batch.execute();

// in 4.x
const responses = await batch.execute();
```

### Types

All the re-useable types which were earlier been exposed from `web3` package are now moved to independent package `web3-types` package.

:::note
We don't encourage using the `@types/web3` package.
:::

```ts
// Provider types
// in 1.x
import type { Provider, Callback, JsonRPCResponse } from 'web3/providers';

// in 4.x
import type {
	Web3BaseProvider as Provider,
	Web3ProviderRequestCallback as Callback,
	JsonRpcResponse,
} from 'web3-types';
```

Similarly some useable types from the old package `web3-core` are also moved to `web3-types`

```ts
// in 1.x
import type { Transaction, TransactionReceipt } from 'web3-core';

// in 4.x
import type { Transaction, TransactionReceipt } from 'web3-types';
```

### Formatters

Starting 4.x releases, the package `web3-core-helpers` will not be maintained and the formatters are now moved to the `web3-core` package.

```ts
// in 1.x
import { formatters } from 'web3-core-helpers';

// in 4.x
import { formatters } from 'web3-core';
```

### PromiEvent

Starting 4.x releases, the package `web3-core-promievent` will not be maintained and the class are now moved to the `web3-core` package.

```ts
// in 1.x
import Web3PromiEvent from 'web3-core-promievent';

// in 4.x
import { Web3PromiEvent } from 'web3-core';
```

The `PromiEvent` class does not support `removeEventListener` or `addEventListener`. Instead we recommend to use `on` and `off`.
