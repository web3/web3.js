---
sidebar_position: 1
sidebar_label: 'Plugin Users'
---

# web3.js Plugin User's Guide

This guide intends to provide the necessary context for registering plugins with web3.js packages.

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


