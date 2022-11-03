---
sidebar_position: 0
sidebar_label: 'Plugin Authors'
---

# web3.js Plugin Author's Guide

This guide intends to provide the necessary context for developing plugins for web3.js.

## Before Getting Started

It's highly recommended you as the plugin author understand the limitations of TypeScript's module augmentation as described in the [main plugin guide](/docs/guides/web3_plugin_guide/), so you can communicate to your users that they are responsible for augmenting the class interface they register your plugin with if they desire to have type support when using your plugin. Ideally this could be solved for by the plugin author, or better yet web3.js, but so far a better solution is unknown - if you have any ideas, please [create an issue](https://github.com/web3/web3.js/issues/new/choose) and help us improve web3.js' UX.

## Plugin Dependencies

At the minimum, your plugin should depend on the `4.x` version of `web3-core`. This will allow your plugin class to extend the provided `Web3PluginBase` abstract class. However, `web3-core` shouldn't be listed as a regular dependency, instead it should be listed in your plugin's `package.json` as a [peer dependency](https://nodejs.org/en/blog/npm/peer-dependencies/):

```json
{
	"name": "web3-plugin-custom-rpc-methods",
	"version": "0.0.1",
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
import { Web3Context } from './web3_export_helper';
import { CustomRpcMethodsPlugin } from './custom_rpc_methods_plugin';

declare module 'web3-core' {
	interface Web3Context {
		customRpcMethods: CustomRpcMethodsPlugin;
	}
}

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

Below is representing a plugin user's code that does not configure an Ethereum provider, resulting in a thrown [ProviderError](/api/web3-errors/class/ProviderError):

```typescript
// registering_a_plugin.ts
import { Web3Context } from './web3_export_helper';
import { CustomRpcMethodsPlugin } from './custom_rpc_methods_plugin';

declare module 'web3-core' {
	interface Web3Context {
		customRpcMethods: CustomRpcMethodsPlugin;
	}
}

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
	 * This method overrides the inherited `link` method from `Web3PluginBase`
	 * to add to a configured `RequestManager` to our Contract instance
	 * when `Web3.registerPlugin` is called.
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
