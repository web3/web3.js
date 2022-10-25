---
sidebar_position: 1
sidebar_label: 'Web3 Plugins'
---

# Web3.js Plugins Guide

In addition to the Web3.js standard libraries, plugins add specific functionality to the end user. This extra functionality could be wrappers around specific contracts, additional RPC method wrappers, or could even extend the logic of Web3.js methods.

## Before Getting Started

### Module Augmentation

In order to provide typing support for the registered plugin, the plugin user must [augment the module](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) they're registering the plugin with. In simpler terms, we must make TypeScript aware that we are modifying a module's (i.e. a package such as `web3` or `web3-eth`) interface with additional methods, properties, and/or classes. A good tutorial that further explains the topic can be found [here](https://www.digitalocean.com/community/tutorials/typescript-module-augmentation).

The `registerPlugin` method exists on the `Web3Context` class, so any class that `extends` `Web3Context` has the ability to add on the plugin's additional functionality to it's interface. Because of this, the burden of module augmentation falls on the plugin user as Web3.js and the plugin author are unaware of the module the end user is calling `registerPlugin` on.

#### Web3.js Example

The following is an example plugin that adds additional RPC method wrappers:

```typescript
// custom_rpc_methods_plugin.ts
import { Web3PluginBase } from 'web3-core';

type CustomRpcApi = {
	custom_rpc_method: () => string;
	custom_rpc_method_with_parameters: (parameter1: string, parameter2: number) => string;
};

export class CustomRpcMethodsPlugin extends Web3PluginBase<CustomRpcApi> {
	public pluginNamespace = 'customRpcMethods';

	public async customRpcMethod() {
		return this.requestManager.send({
			method: 'custom_rpc_method',
			params: [],
		});
	}

	public async customRpcMethodWithParameters(parameter1: string, parameter2: number) {
		return this.requestManager.send({
			method: 'custom_rpc_method_with_parameters',
			params: [parameter1, parameter2],
		});
	}
}
```

In the below example, the end user is registering the above `CustomRpcMethodsPlugin` with an instance of `Web3Context`:

```typescript
// registering_a_plugin.ts
import { Web3Context } from 'web3-core';

import { CustomRpcMethodsPlugin } from './custom_rpc_methods_plugin';

declare module 'web3-core' {
	interface Web3Context {
		customRpcMethods: CustomRpcMethodsPlugin;
	}
}

const web3Context = new Web3Context('http://127.0.0.1:8545');
web3Context.registerPlugin(new CustomRpcMethodsPlugin());
```

From the above code, the following is the module augmentation that's required to be declared by the plugin user:

```typescript
declare module 'web3-core' {
	interface Web3Context {
		customRpcMethods: CustomRpcMethodsPlugin;
	}
}
```

Now after augmenting the `Web3Context` interface from the `web3-core` module, we can have the below type safe code:

##### `web3Context.customRpcMethods.customRpcMethod`

![custom rpc method](./assets/custom_rpc_method.png 'web3Context.customRpcMethods.customRpcMethod')

##### `web3Context.customRpcMethods.customRpcMethodWithParameters`

![custom rpc method with parameters](./assets/custom_rpc_method_with_parameters.png 'web3Context.customRpcMethods.customRpcMethodWithParameters')
