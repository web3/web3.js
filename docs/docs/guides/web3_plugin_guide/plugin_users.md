---
sidebar_position: 1
sidebar_label: 'Plugin Users'
---

# web3.js Plugin User's Guide

This guide intends to provide the necessary context for registering plugins with web3.js packages.

## Before Getting Started

It's highly recommended you as a plugin user understand the limitations of TypeScript's module augmentation as described in the [main plugin guide](/docs/guides/web3_plugin_guide/), so you can get the most out of TypeScript's type safety while using web3.js plugins.

## Installing the Plugin

Unless otherwise mentioned by the plugin author, installing a plugin should be as simple as `yarn add plugin-name`. This should add the plugin as a dependency within your `package.json` and the plugin should be available to import within your code.

```json
{
	"name": "your-package-name",
	"version": "0.0.1",
	"dependencies": {
		"web3-plugin": "0.0.1"
	}
}
```

## Registering the Plugin

The `.registerPlugin` method is what we're going to be using to add a plugin to an instance of a class sourced from web3.js' modules (i.e. `Web3` or `Web3Eth`). This method only exists on classes that extend `Web3Context`, so it may not be available on every class you import from a Web3.js package.

Below are a couple examples of registering the following `SimplePlugin` with various classes imported from various web3.js packages:

This is an example plugin being used for demonstration purposes:

```typescript
import { Web3PluginBase } from 'web3-core';

export class SimplePlugin extends Web3PluginBase {
	public pluginNamespace = 'simplePlugin';

	public simpleMethod() {
		return 'simpleValue';
	}
}
```

:::caution
The following code does not include the [module augmentation](/docs/guides/web3_plugin_guide/#module-augmentation) necessary to provide type safety and hinting when using a registered plugin, please refer to the [Setting Up Module Augmentation](/docs/guides/web3_plugin_guide/plugin_users#setting-up-module-augmentation) section for how to augment the `Web3` module to enable typing features for a plugin.
:::

```typescript
import Web3 from 'web3';
import SimplePlugin from 'web3-plugin';

const web3 = new Web3('http://127.0.0.1:8545');
web3.registerPlugin(new SimplePlugin());

// @ts-expect-error Property 'simplePlugin' does not exist on type 'Web3'
web3.simplePlugin.simpleMethod();
```

#### Why is `@ts-expect-error` Required

`// @ts-expect-error Property 'simplePlugin' does not exist on type 'Web3'` is required in order for TypeScript to compile this code; This is due to the lack of module augmentation. `.simplePlugin` is not a part of the standard interface of the `Web3` class that TypeScript is made aware of when we import `Web3`. Module augmentation is us telling TypeScript,

_"Hey, we're modifying the `Web3` class interface to include the interface of `SimplePlugin`"_

and TypeScript will be able to infer the interface of `SimplePlugin` so that we no longer receive an error when calling `web3.simplePlugin.simpleMethod();`

## Setting Up Module Augmentation

This section of the guide will delve deeper into setting up module augmentation, if you run into any issues, please don't hesitate to [create an issue](https://github.com/web3/web3.js/issues/new/choose) or drop a message in the `web3js-general` channel in the ChainSafe [Discord](https://discord.gg/yjyvFRP), and someone from the team/community will assist you.

### Creating an Export Helper File

There exists a [limitation](https://github.com/web3/web3.js/pull/5393/#discussion_r1000727269) with TypeScript's module augmentation: it can only handle _named modules_. So that web3.js stays backwards compatible, our most commonly used modules (e.g. `Web3`, `Web3Eth`, `Contract`) are exported as `default` exports and are not explicitly named as required by TypeScript for module augmentation. The workaround for this issue is to create a separate file within your project where you import the default module you wish to augment and re-export it as a named module:

Re-exporting `Web3`, `Web3Context`, and `Web3Eth` as named modules:

```typescript
import Web3 from 'web3';
export { Web3 };
```

```typescript
import Web3Context from 'web3-core';
export { Web3Context };
```

```typescript
import Web3Eth from 'web3-eth';
export { Web3Eth };
```

The file that performs this re-exporting can be named whatever, but for the sake of this guide, we'll be assuming the file is named `web3_export_helper.ts`.

### Re-declaring the Module

The first step is telling TypeScript that we're interested in re-defining a module's (i.e. a web3.js package such as `web3-core`, `web3`, or `web3-eth`) interface. In simpler terms, TypeScript is already aware of what methods and classes exist for each web3.js module, but when registering a plugin, we're adding additional methods and/or classes to the module's interface and TypeScript needs a little help understanding what's going to be available within the module after the plugin is registered.

We start with the following:

```typescript
import { Web3 } from './web3_export_helper';

declare module 'web3' {...}
```

In the above example, we're interested in registering a plugin to an instance of `Web3Context` from the `web3-core` module. So we tell TypeScript that we're going to manually declare the module interface for `web3-core`.

### Adding our Plugin's Interface

Now that TypeScript's aware that the interface of the `web3-core` module is going to be augmented, we add our changes. In this case, we're adding the interface of `SimplePlugin` to the interface of `Web3Context` which is what we're going to be calling `.registerPlugin` on:

```typescript
import SimplePlugin from 'web3-plugin';

import { Web3 } from './web3_export_helper';

declare module 'web3' {
	interface Web3 {
		simplePlugin: SimplePlugin;
	}
}
```

:::info
The property name (i.e. `pluginNamespace`), `simplePlugin` in

```typescript
{
	simplePlugin: SimplePlugin;
}
```

**MUST** be the same as the `pluginNamespace` set by the plugin.

```typescript
import { Web3PluginBase } from 'web3-core';

export class SimplePlugin extends Web3PluginBase {
	public pluginNamespace = 'simplePlugin';

	...
}
```

This is because `.registerPlugin` will use the `pluginNamespace` property provided by the plugin as the property name when it registers the plugin with the class instance you call `.registerPlugin` on:

```typescript
const web3 = new Web3('http://127.0.0.1:8545');
web3.registerPlugin(new SimplePlugin());
// Now simplePlugin (i.e. the pluginNamespace) isavailable
// on our instance of Web3
web3.simplePlugin;
```

:::

And that's all that's required to augment a named module to add type support for a plugin. Now you should be able to remove the `// @ts-expect-error` from the above code example:

```typescript
import Web3 from 'web3';
import SimplePlugin from 'web3-plugin';

declare module 'web3' {
	interface Web3 {
		simplePlugin: SimplePlugin;
	}
}

const web3 = new Web3('http://127.0.0.1:8545');
web3.registerPlugin(new SimplePlugin());

web3.simplePlugin.simpleMethod();
```
