---
sidebar_position: 1
sidebar_label: 'Web3 Plugin Authors'
---

# Web3.js Plugin Author's Guide

This guide intends to provide the necessary context for developing plugins for Web3.js.

## Before Getting Started

It's highly recommended you as the plugin author understand the limitations of TypeScript's module augmentation as described in the [main plugin guide](/docs/guides/web3_plugin_guide/), so you can communicate to your users that they are responsible for augmenting the module they register your plugin onto if they desire to have type support when using your plugin. Ideally this could be solved for by the plugin author, or better yet Web3.js, but so far a better solution is unknown - if you have any ideas, please [create an issue](https://github.com/web3/web3.js/issues/new/choose) and help us improve Web3.js' UX.

## Creating Your Plugin

### Plugin Dependencies

At the minimum, your plugin should depend on the `4.x` version of `web3-core`. This will allow your plugin class to extend the provided `Web3PluginBase` abstract class. However, `web3-core` shouldn't be listed as a regular dependency, instead it should be listed in your plugin's `package.json` as a [peer dependency](https://nodejs.org/en/blog/npm/peer-dependencies/):

```json
{
	"name": "web3-plugin-custom-rpc-methods",
	"version": "0.0.1",
	"peerDependencies": {
		"web3-core": ">= 4.0.1-alpha.0 < 5",
	}
}
```

When your users install your plugin, this will allow the package manager to make use of the user installed `web3-core` if available and if the version satisfies the version constraints instead of installing it's own version of `web3-core`.

### Extending `Web3PluginBase`

Your plugin class should `extend` the `Web3PluginBase` abstract class. This class `extends` [Web3Context](/api/web3-core/class/Web3Context) and when the user registers your plugin onto a module, your plugin's `Web3Context` will point to the module's `Web3Context` giving your plugin access to things such as user configured [requestManager](/api/web3-core/class/Web3Context#requestManager) and [accountProvider](/api/web3-core/class/Web3Context#accountProvider).

```typescript
import { Web3PluginBase } from 'web3-core';

export class CustomRpcMethodsPlugin extends Web3PluginBase { ... }
```

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

#### Providing an API Generic to `Web3PluginBase`

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

### Overriding `Web3Context`'s `link` Method
