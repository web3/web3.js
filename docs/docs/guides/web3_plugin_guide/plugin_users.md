---
sidebar_position: 0
sidebar_label: 'For Plugin Users'
---

# Plugin User Guide

This guide intends to provide the necessary context for registering plugins with web3.js packages.

## Installing the Plugin

Unless otherwise mentioned by the plugin author, installing a plugin should be as simple as `yarn add plugin-name`. This should add the plugin as a dependency within your `package.json` and the plugin should be available to import within your code.

```json
{
	"name": "your-package-name",
	"version": "0.0.1",
	"dependencies": {
		"web3-plugin": "0.1.0"
	}
}
```

## Registering the Plugin

The `.registerPlugin` method is what you're going to be using to add a plugin to an instance of a class sourced from web3.js' modules (i.e. `Web3` or `Web3Eth`). This method only exists on classes that extend `Web3Context`, so it may not be available on every class you import from a Web3.js package.

The following is an example of registering the plugin `SimplePlugin` onto an instance of `Web3`:

```typescript
import { Web3PluginBase } from 'web3-core';

export class SimplePlugin extends Web3PluginBase {
	public pluginNamespace = 'simplePlugin';

	public simpleMethod() {
		return 'simpleValue';
	}
}
```

```typescript
import Web3 from 'web3';
import SimplePlugin from 'web3-plugin';

const web3 = new Web3('http://127.0.0.1:8545');
web3.registerPlugin(new SimplePlugin());

web3.simplePlugin.simpleMethod();
```
