---
sidebar_position: 2
sidebar_label: 'For Plugin Developers'
---

# Plugin Developer Guide

This guide intends to provide the necessary context for developing plugins for web3.js.

Feel free to explore some of [the already built plugins](https://web3js.org/plugins) and/or
use this [template](https://github.com/ChainSafe/web3.js-plugin-template) to start with development of your Web3.js plugin.

:::caution
To provide type safety and IntelliSense for your plugin users, please refer to the [Setting Up Module Augmentation](#setting-up-module-augmentation) section for how to augment the `Web3Context` module to enable typing features for your plugin.
:::

## Plugin Dependencies

At the minimum, your plugin should depend on `web3` package version `4.0.2`. This will allow your plugin class to extend the provided `Web3PluginBase` abstract class. However, `web3` shouldn't be listed as a regular dependency, instead it should be listed in your plugin's `package.json` as a [peer dependency](https://nodejs.org/en/blog/npm/peer-dependencies/).

:::important
It is important to note that the plugin name should be structured as `@<organization>/web3-plugin-<name>` or  `web3-plugin-<name>`.
:::

```json
{
	"name": "web3-plugin-custom-rpc-methods",
	"version": "0.1.0",
	"peerDependencies": {
		"web3": ">= 4.0.2 < 5"
	}
}
```

When your users install your plugin, this will allow the package manager to make use of the user installed `web3` if available and if the version satisfies the version constraints instead of installing its own version of `web3`.

## Add New Transaction Type

Furthermore, you have the flexibility to expand your range of transaction types, enhancing compatibility with the `web3.js` library.


```typescript
// create new TransactionType class which extends BaseTransaction class
import { BaseTransaction } from 'web3-eth-accounts';
const TRANSACTION_TYPE = 15;
class SomeNewTxTypeTransaction extends BaseTransaction {
  // ...
}

// create new plugin and add `SomeNewTxTypeTransaction` to the library
import { Web3EthPluginBase } from 'web3';

class SomeNewTxTypeTransactionPlugin extends Web3PluginBase {
  public pluginNamespace = 'someNewTxTypeTransaction';
  public constructor() {
    super();
    TransactionFactory.registerTransactionType(TRANSACTION_TYPE, SomeNewTxTypeTransaction);
  }
}
```

## Extending `Web3PluginBase`

Your plugin class should `extend` the `Web3PluginBase` abstract class. This class `extends` [Web3Context](/api/web3-core/class/Web3Context) and when the user registers your plugin with a class, your plugin's `Web3Context` will point to the module's `Web3Context` giving your plugin access to things such as user configured [requestManager](/api/web3-core/class/Web3Context#requestManager) and [accountProvider](/api/web3-core/class/Web3Context#accountProvider).

```typescript
import { Web3PluginBase } from 'web3';

export class CustomRpcMethodsPlugin extends Web3PluginBase { ... }
```

### Extending `Web3EthPluginBase`

In addition to `Web3PluginBase`, you can choose to extend `Web3EthPluginBase` which will provide the [Ethereum JSON RPC API interface](/api/web3-types#EthExecutionAPI), which packages such as `Web3Eth` use, as a generic to your plugin's `requestManager`, giving it type support for the [Ethereum JSON RPC spec](https://ethereum.github.io/execution-apis/api-documentation/). This would be the recommended approach if your plugin makes Ethereum JSON RPC calls directly to a provider using web3's provided `requestManager`.

```typescript
import { Web3EthPluginBase } from 'web3';

export class CustomRpcMethodsPlugin extends Web3EthPluginBase { ... }
```

### `pluginNamespace`

After extending the `Web3PluginBase` class, your plugin will need a `public` `pluginNamespace` property that configures how your plugin will be accessed on the class, which your plugin was registered with. In the following example, the `pluginNamespace` is set to `customRpcMethods`, so when the user registers the plugin they will access your plugin as follows:

The following represents your plugin code:

```typescript
// custom_rpc_methods_plugin.ts
import { Web3PluginBase } from 'web3';

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
import { Web3Context } from 'web3';

import { CustomRpcMethodsPlugin } from './custom_rpc_methods_plugin';

const web3Context = new Web3Context('http://127.0.0.1:8545');
web3Context.registerPlugin(new CustomRpcMethodsPlugin());

await web3Context.customRpcMethods.someMethod();
```

### Using the Inherited `Web3Context`

Below is an example of `CustomRpcMethodsPlugin` making use of `this.requestManager` which will have access to an Ethereum provider if one was configured by the user. In the event that no `provider` was set by the user, the below code will throw a [ProviderError](/api/web3-errors/class/ProviderError) if `customRpcMethod` was to be called:

```typescript
import { Web3PluginBase } from 'web3';

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
import { Web3Context } from 'web3';

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
import { Web3PluginBase } from 'web3';

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
import { Contract, ContractAbi, Web3Context, Web3PluginBase, types, utils } from 'web3';

import { ERC20TokenAbi } from './ERC20Token';

export class ContractMethodWrappersPlugin extends Web3PluginBase {
  public pluginNamespace = 'contractMethodWrappersPlugin';

  private readonly _contract: Contract<typeof ERC20TokenAbi>;

  public constructor(abi: ContractAbi, address: types.Address) {
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

  public async getFormattedBalance<ReturnFormat extends types.DataFormat>(address: types.Address, returnFormat?: ReturnFormat) {
    return utils.format({ eth: 'unit' }, await this._contract.methods.balanceOf(address).call(), returnFormat ?? types.DEFAULT_RETURN_FORMAT);
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

## Plugin Middleware

Middleware allows plugins to intercept network interactions and inject custom logic. There are two types of plugin middleware: [request middleware](#request-middleware) and [transaction middleware](#transaction-middleware). In both cases, the middleware is implemented as a new class and registered with the plugin in the plugin's `link` method. Keep reading to learn how to add middleware to a plugin.

### Request Middleware

Request middleware allows plugins to modify RPC requests before they are sent to the network and modify RPC responses before they are returned to Web3.js for further internal processing. Request middleware must implement the [`RequestManagerMiddleware`](/api/web3-core/interface/RequestManagerMiddleware) interface, which specifies two functions: [`processRequest`](/api/web3-core/interface/RequestManagerMiddleware#processRequest) and [`processResponse`](/api/web3-core/interface/RequestManagerMiddleware#processResponse). Here is a simple example of request middleware that prints RPC requests and responses to the console:

```ts
export class RequestMiddleware<API> implements RequestManagerMiddleware<API> {
  public async processRequest<ParamType = unknown[]>(
    request: JsonRpcPayload<ParamType>
  ): Promise<JsonRpcPayload<ParamType>> {
    const reqObj = { ...request } as JsonRpcPayload;
    console.log("Request:", reqObj);
    return Promise.resolve(reqObj as JsonRpcPayload<ParamType>);
  }

  public async processResponse<
    Method extends Web3APIMethod<API>,
    ResponseType = Web3APIReturnType<API, Method>
  >(
    response: JsonRpcResponse<ResponseType>
  ): Promise<JsonRpcResponse<ResponseType>> {
    const resObj = { ...response };
    console.log("Response:", resObj);
    return Promise.resolve(resObj);
  }
}
```

To add request middleware to a plugin, use the [`Web3RequestManager.setMiddleware`](/api/web3-core/class/Web3RequestManager#setMiddleware) method in the plugin's `link` method as demonstrated below:

```ts
public link(parentContext: Web3Context): void {
  parentContext.requestManager.setMiddleware(new RequestMiddleware());
  super.link(parentContext);
}
```

### Transaction Middleware

Transaction middleware allows plugins to modify transaction data before it is sent to the network. Transaction middleware must implement the [`TransactionMiddleware`](/api/web3-eth/interface/TransactionMiddleware) interface, which specifies one function: [`processTransaction`](/api/web3-eth/interface/TransactionMiddleware#processTransaction). Here is a simple example of transaction middleware that prints transaction data to the console:

```ts
export class TxnMiddleware implements TransactionMiddleware {
  public async processTransaction(
    transaction: TransactionMiddlewareData
  ): Promise<TransactionMiddlewareData> {
    const txObj = { ...transaction };
    console.log("Transaction data:", txObj);
    return Promise.resolve(txObj);
  }
}
```

To add transaction middleware to a plugin, use the [`Web3Eth.setTransactionMiddleware`](/api/web3-eth/class/Web3Eth#setTransactionMiddleware) method in the plugin's `link` method as demonstrated below:

```ts
public link(parentContext: Web3Context): void {
  (parentContext as any).Web3Eth.setTransactionMiddleware(
    new TxnMiddleware()
  );
  super.link(parentContext);
}
```

## Setting Up Module Augmentation

In order to provide type safety and IntelliSense for your plugin when it's registered by the user, you must [augment](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) the `Web3Context` module. In simpler terms, you will be making TypeScript aware that you are modifying the interface of the class `Web3Context`, and any class that extends it, to include the interface of your plugin (i.e. your plugin's added methods, properties, etc.). As a result, your plugin object will be accessible within a namespace of your choice, which will be available within any `Web3Context` object.

A good tutorial that further explains Module Augmentation, in general, can be found [here](https://www.digitalocean.com/community/tutorials/typescript-module-augmentation).

### Module Augmentation

When registering a plugin, you're adding additional methods and/or classes to the module's interface and TypeScript needs a little help understanding what's going to be available within the module after the plugin is registered.

```typescript
// custom_rpc_methods_plugin.ts
import { Web3PluginBase } from 'web3';

export class CustomRpcMethodsPlugin extends Web3PluginBase {
  public pluginNamespace = 'customRpcMethods';

  public someMethod() {
    return 'someValue';
  }
}

// Module Augmentation
declare module 'web3' {
  // Here is where you're adding your plugin's
  // class inside Web3Context class
  interface Web3Context {
    customRpcMethods: CustomRpcMethodsPlugin;
  }
}
```

### Important points to consider

1. By augmenting `Web3Context` (and, by extension, all the classes that extend it), your plugin's interface will show up in things like IntelliSense for **all** Web3 modules that extend `Web3Context`, even if your plugin isn't registered.
   This is something worth making your users aware of, as they'll only be able to use your plugin if they register it with a Web3 class instance using `.registerPlugin`.

:::danger

The following represent what your **plugin users** would see, when they use the plugin `CustomRpcMethodsPlugin`, without calling `.registerPlugin`:

![web3 context augmentation](./assets/web3_context_augmentation.png 'Web3Context augmentation')

The above screenshot shows IntelliSense thinking `.customRpcMethods.someMethod` is available to call on the instance of `Web3`, regardless if the plugin user registered or did not register `CustomRpcMethodsPlugin`.
But, the user who does not call `.registerPlugin`, before accessing your plugin, would face an error. And you need to make it clear for them that they need to call `.registerPlugin`, before they can access any plugin functionality.

:::

2. The `registerPlugin` method exists on the `Web3Context` class, so any class that `extends Web3Context` has the ability to add your plugin's additional functionality to its interface. So, by augmenting `Web3Context` to include your plugin's interface, you're essentially providing a blanket augmentation that adds your plugin's interface to **all** Web3 modules that extend `Web3Context` (i.e. `web3`, `web3-eth`, `web3-eth-contract`, etc.).

3. The value of the `pluginNamespace`, that we used `customRpcMethods` for it in our sample code, **MUST** have the exact same name at 2 places: The first place is in the augmentation. And the second is the value of the public `pluginNamespace` inside your plugin class.

    So, for example, kindly notice using `customRpcMethods` in the next 2 snippets:

    Module Augmentation:

```typescript
// code written by the plugin **developer**

declare module 'web3' {
  // Here is where you're adding your plugin inside Web3Context
  interface Web3Context {
    customRpcMethods: CustomRpcMethodsPlugin;
  }
}
```

Your the plugin class:

```typescript
// code written by the plugin **developer**

export class CustomRpcMethodsPlugin extends Web3PluginBase {
  public pluginNamespace = 'customRpcMethods';

  //...
}
```

This is because `.registerPlugin` will use the `pluginNamespace` property provided by the plugin as the property name when it registers the plugin with the class instance that the **plugin user** will call `.registerPlugin` on:

```typescript
// code written by the plugin **user**

const web3 = new Web3('http://127.0.0.1:8545');
web3.registerPlugin(new CustomRpcMethodsPlugin());
// Now customRpcMethods (i.e. the pluginNamespace) is available
// on the instance of Web3
web3.customRpcMethods;
```

## Complete Example

You may find it helpful to reference a complete example for developing and using a web3 plugin. The [Web3.js Chainlink Plugin](https://github.com/ChainSafe/web3.js-plugin-chainlink/) repository provides an excellent example which you can check out.
