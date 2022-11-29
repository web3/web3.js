---
sidebar_position: 0
sidebar_label: 'Plugin Authors'
---

# web3.js Plugin Author's Guide

This guide intends to provide the necessary context for developing plugins for web3.js.

:::caution
To provide type safety and IntelliSense for your plugin users, please refer to the [Setting Up Module Augmentation](/docs/guides/web3_plugin_guide/plugin_authors#setting-up-module-augmentation) section for how to augment the `Web3Context` module to enable typing features for your plugin.
:::

## Plugin Dependencies

At the minimum, your plugin should depend on the `4.x` version of `web3-core`. This will allow your plugin class to extend the provided `Web3PluginBase` abstract class. However, `web3-core` shouldn't be listed as a regular dependency, instead it should be listed in your plugin's `package.json` as a [peer dependency](https://nodejs.org/en/blog/npm/peer-dependencies/):

```json
{
	"name": "web3-plugin-custom-rpc-methods",
	"version": "0.1.0",
	"peerDependencies": {
		"web3-core": ">= 4.0.1-alpha.0 < 5"
	}
}
```

When your users install your plugin, this will allow the package manager to make use of the user installed `web3-core` if available and if the version satisfies the version constraints instead of installing it's own version of `web3-core`.

## Extending `Web3PluginBase`

Your plugin class should `extend` the `Web3PluginBase` abstract class. This class `extends` [Web3Context](/api/web3-core/class/Web3Context) and when the user registers your plugin with a class, your plugin's `Web3Context` will point to the module's `Web3Context` giving your plugin access to things such as user configured [requestManager](/api/web3-core/class/Web3Context#requestManager) and [accountProvider](/api/web3-core/class/Web3Context#accountProvider).

```typescript
import { Web3PluginBase } from 'web3-core';

export class CustomRpcMethodsPlugin extends Web3PluginBase { ... }
```

### Extending `Web3EthPluginBase`

In addition to `Web3PluginBase`, you can choose to extend `Web3EthPluginBase` which will provide the [Ethereum JSON RPC API interface](http://localhost:3000/api/web3-types#EthExecutionAPI), which packages such as `Web3Eth` use, as a generic to your plugin's `requestManager`, giving it type support for the [Ethereum JSON RPC spec](https://ethereum.github.io/execution-apis/api-documentation/). This would be the recommended approach if your plugin makes Ethereum JSON RPC calls directly to a provider using web3's provided `requestManager`.

```typescript
import { Web3EthPluginBase } from 'web3-core';

export class CustomRpcMethodsPlugin extends Web3EthPluginBase { ... }
```

### `pluginNamespace`

After extending the `Web3PluginBase` class, your plugin will need a `public` `pluginNamespace` property that configures how your plugin will be accessed on the class your plugin was registered with. In the following example, the `pluginNamespace` is set to `customRpcMethods`, so when the user registers the plugin they will access your plugin as follows:

The following represents your plugin code:

```typescript
// custom_rpc_methods_plugin.ts
import { Web3PluginBase } from 'web3-core';

export class CustomRpcMethodsPlugin extends Web3PluginBase {
	public pluginNamespace = 'customRpcMethods';

	public someMethod() {
		return 'someValue';
	}
}
```

The following represents the plugin user's code:

```typescript
// registering_a_plugin.ts
import { Web3Context } from 'web3-core';

import { CustomRpcMethodsPlugin } from './custom_rpc_methods_plugin';

const web3Context = new Web3Context('http://127.0.0.1:8545');
web3Context.registerPlugin(new CustomRpcMethodsPlugin());

await web3Context.customRpcMethods.someMethod();
```

### Using the Inherited `Web3Context`

Below is an example of `CustomRpcMethodsPlugin` making use of `this.requestManager` which will have access to an Ethereum provider if one was configured by the user. In the event that no `provider` was set by the user, the below code will throw a [ProviderError](/api/web3-errors/class/ProviderError) if `customRpcMethod` was to be called:

```typescript
import { Web3PluginBase } from 'web3-core';

export class CustomRpcMethodsPlugin extends Web3PluginBase {
	public pluginNamespace = 'customRpcMethods';

	public async customRpcMethod() {
		return this.requestManager.send({
			method: 'custom_rpc_method',
			params: [],
		});
	}
}
```

Below depicts a plugin user's code that does not configure an Ethereum provider, resulting in a thrown [ProviderError](/api/web3-errors/class/ProviderError) when calling `customRpcMethod`:

```typescript
// registering_a_plugin.ts
import { Web3Context } from 'web3-core';

import { CustomRpcMethodsPlugin } from './custom_rpc_methods_plugin';

const web3Context = new Web3Context();
web3Context.registerPlugin(new CustomRpcMethodsPlugin());

// The following would result in a thrown ProviderError when
// the plugin attempts to call this.requestManager.send(...)
await web3Context.customRpcMethods.customRpcMethod();
```

Thrown [ProviderError](/api/web3-errors/class/ProviderError):

```bash
ProviderError: Provider not available. Use `.setProvider` or `.provider=` to initialize the provider.
```

### Providing an API Generic to `Web3PluginBase`

If needed, you can provide an API type (that follows the [Web3ApiSpec](/api/web3-types#Web3APISpec) pattern) as a generic to `Web3PluginBase` that will add type hinting to the `requestManager` when developing your plugin. In the below code, this is the `CustomRpcApi` type that's being passed as `Web3PluginBase<CustomRpcApi>`

```typescript
import { Web3PluginBase } from 'web3-core';

type CustomRpcApi = {
	custom_rpc_method_with_parameters: (parameter1: string, parameter2: number) => string;
};

export class CustomRpcMethodsPlugin extends Web3PluginBase<CustomRpcApi> {
	public pluginNamespace = 'customRpcMethods';

	public async customRpcMethodWithParameters(parameter1: string, parameter2: number) {
		return this.requestManager.send({
			method: 'custom_rpc_method_with_parameters',
			params: [parameter1, parameter2],
		});
	}
}
```

## Using web3.js Packages within Your Plugin

### Overriding `Web3Context`'s `.link` Method

There currently exists [an issue](https://github.com/web3/web3.js/issues/5492) with certain web3.js packages not correctly linking their `Web3Context` with the context of the class the user has registered the plugin with. As mentioned in the issue, this can result in a bug where a plugin instantiates an instance of `Contract` (from `web3-eth-contract`) and attempts to call a method on the `Contract` instance (which uses the `requestManager` to make a call to the Ethereum provider), resulting in a [ProviderError](/api/web3-errors/class/ProviderError) even though the plugin user has set a provider and it should be available to the plugin.

A workaround for this issue is available, below is an example of it:

```typescript
import { Web3Context, Web3PluginBase } from 'web3-core';
import { ContractAbi } from 'web3-eth-abi';
import Contract from 'web3-eth-contract';
import { Address } from 'web3-types';
import { DataFormat, DEFAULT_RETURN_FORMAT, format } from 'web3-utils';

import { ERC20TokenAbi } from './ERC20Token';

export class ContractMethodWrappersPlugin extends Web3PluginBase {
	public pluginNamespace = 'contractMethodWrappersPlugin';

	private readonly _contract: Contract<typeof ERC20TokenAbi>;

	public constructor(abi: ContractAbi, address: Address) {
		super();
		this._contract = new Contract(abi, address);
	}

	/**
	 * This method overrides the inherited `link` method from
	 * `Web3PluginBase` to add a configured `RequestManager`
	 * to the Contract instance when `Web3.registerPlugin`
	 * is called.
	 *
	 * @param parentContext - The context to be added to the instance of `ChainlinkPlugin`,
	 * and by extension, the instance of `Contract`.
	 */
	public link(parentContext: Web3Context) {
		super.link(parentContext);
		this._contract.link(parentContext);
	}

	public async getFormattedBalance<ReturnFormat extends DataFormat>(
		address: Address,
		returnFormat?: ReturnFormat,
	) {
		return format(
			{ eth: 'unit' },
			await this._contract.methods.balanceOf(address).call(),
			returnFormat ?? DEFAULT_RETURN_FORMAT,
		);
	}
}
```

The workaround is overwriting the inherited `link` method (inherited from `Web3PluginBase` which inherits it from `Web3Context`) and explicitly calling `.link` on the `Contract` instance. The `parentContext` will get passed when the user calls `registerPlugin`, it will be the context of the class the user is registering your plugin with.

The following is the workaround, and will probably need to be done for any instantiated web3.js package your plugin uses that makes use of `Web3Context`:

```typescript
public link(parentContext: Web3Context) {
	super.link(parentContext);
	// This workaround will ensure the context of the Contract
	// instance is linked to the context of the class the
	// plugin user is registering the plugin with
	this._contract.link(parentContext);
}
```

## Setting Up Module Augmentation

In order to provide type safety and IntelliSense for your plugin when it's registered by the user, you must [augment](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) the `Web3Context` module. In simpler terms, you will be making TypeScript aware that you are modifying the interface of `Web3Context`, and any class that extends it, to include the interface of your plugin (i.e. your plugin's added methods, properties, etc.). A good tutorial that further explains the topic can be found [here](https://www.digitalocean.com/community/tutorials/typescript-module-augmentation).

### A Quick Disclaimer

The `registerPlugin` method exists on the `Web3Context` class, so any class that `extends Web3Context` has the ability to add your plugin's additional functionality to its interface. By augmenting `Web3Context` to include your plugin's interface, you're essentially providing a blanket augmentation that adds your plugin's interface to **all** Web3 modules that extend `Web3Context` (i.e. `web3`, `web3-eth`, `web3-eth-contract`, etc.).

:::warning
By augmenting `Web3Context` (and by extension all class interfaces that extend it), your plugin's interface will show up in things like IntelliSense for **all** Web3 modules that extend `Web3Context`, even if your plugin isn't registered - This is something worth making your users aware of, as they'll only be able to use your plugin if they register it with a Web3 class instance using `.registerPlugin`

For context, here is an example of your plugin's interface showing up in IntelliSense even though your plugin hasn't been registered (the code in this example is further explained in the subsequent sections):

```typescript
// custom_rpc_methods_plugin.ts
import { Web3PluginBase } from 'web3-core';

import { Web3Context } from './reexported_web3_context';

export class CustomRpcMethodsPlugin extends Web3PluginBase {
	public pluginNamespace = 'customRpcMethods';

	public someMethod() {
		return 'someValue';
	}
}

// Module Augmentation
declare module './reexported_web3_context' {
	interface Web3Context {
		customRpcMethods: CustomRpcMethodsPlugin;
	}
}

export { Web3Context };
```

The following represent what your plugin users would see:

![web3 context augmentation](./assets/web3_context_augmentation.png 'web3Context augmentation')

The above screenshot shows IntelliSense thinking `.customRpcMethods.someMethod` is available to call on the instance of `Web3`, even though the plugin user hasn't registered `CustomRpcMethodsPlugin` - running this code would result in an error.
:::

### Re-exporting Web3Context

Currently TypeScript's module augmentation only supports named exports, so the first step in augmenting `Web3Context` is to re-export it as a named export. To do this you're going to create a `reexported_web3_context.ts` file (the name of this file can be whatever you prefer, but for the sake of this guide, it's going to be assumed it's named `reexported_web3_context.ts` and is located within the same directory as the `custom_rpc_methods_plugin.ts` file). The file contents should be as follows:

```typescript
// reexported_web3_context.ts
import { Web3Context } from 'web3-core';

export { Web3Context };
```

### Re-declaring the Module

Now you're going to tell TypeScript that you're interested in re-defining a module's (in this case `reexported_web3_context`) interface. In simpler terms, TypeScript is already aware of what methods and classes exist for each web3.js module, but when registering a plugin, you're adding additional methods and/or classes to the module's interface and TypeScript needs a little help understanding what's going to be available within the module after the plugin is registered.

```typescript
// custom_rpc_methods_plugin.ts
import { Web3PluginBase } from 'web3-core';

// Here the re-exported Web3Context from
// the previous section is being imported
import { Web3Context } from './reexported_web3_context';

export class CustomRpcMethodsPlugin extends Web3PluginBase {
	public pluginNamespace = 'customRpcMethods';

	public someMethod() {
		return 'someValue';
	}
}

// Here is the declaration to TypeScript that you are
// augmenting the imported module (i.e. ./reexported_web3_context)
declare module './reexported_web3_context' {...}
```

### Adding Your Plugin's Interface

Now that TypeScript is aware that the interface of the `reexport_web3_context` module is going to be augmented, you can add your plugin's interface. In this case, you're adding the interface of `CustomRpcMethodsPlugin` to the interface of `Web3Context` which is what the **plugin-user** is going to be calling `.registerPlugin` on:

```typescript
// custom_rpc_methods_plugin.ts
import { Web3PluginBase } from 'web3-core';

import { Web3Context } from './reexport_web3_context';

export class CustomRpcMethodsPlugin extends Web3PluginBase {
	public pluginNamespace = 'customRpcMethods';

	public someMethod() {
		return 'someValue';
	}
}

declare module './reexported_web3_context.ts' {
	// Here is where you're adding your plugin's
	// interface to the interface of Web3Context
	interface Web3Context {
		customRpcMethods: CustomRpcMethodsPlugin;
	}
}
```

:::info
The property name (i.e. `pluginNamespace`), `customRpcMethods` in

```typescript
{
	customRpcMethods: CustomRpcMethodsPlugin;
}
```

**MUST** be the same as the `pluginNamespace` set by the plugin.

```typescript
import { Web3PluginBase } from 'web3-core';

export class CustomRpcMethodsPlugin extends Web3PluginBase {
	public pluginNamespace = 'customRpcMethods';

	...
}
```

This is because `.registerPlugin` will use the `pluginNamespace` property provided by the plugin as the property name when it registers the plugin with the class instance you call `.registerPlugin` on:

```typescript
const web3 = new Web3('http://127.0.0.1:8545');
web3.registerPlugin(new CustomRpcMethodsPlugin());
// Now customRpcMethods (i.e. the pluginNamespace) is available
// on the instance of Web3
web3.customRpcMethods;
```

:::

### Exporting The Augmented Web3Context

Lastly, you just need to export the augmented `Web3Context` by adding the following after the module re-declaration:

```typescript
export { Web3Context };
```

The full code example is as follows:

```typescript
// custom_rpc_methods_plugin.ts
import { Web3PluginBase } from 'web3-core';

import { Web3Context } from './custom_rpc_methods_plugin';

export class CustomRpcMethodsPlugin extends Web3PluginBase {
	public pluginNamespace = 'customRpcMethods';

	public someMethod() {
		return 'someValue';
	}
}

declare module './custom_rpc_methods_plugin.ts' {
	interface Web3Context {
		customRpcMethods: CustomRpcMethodsPlugin;
	}
}

// Here is where you are exporting your augmented Web3Context
export { Web3Context };
```
