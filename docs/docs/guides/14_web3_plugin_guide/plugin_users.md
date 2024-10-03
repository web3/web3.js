---
sidebar_position: 3
sidebar_label: 'For Plugin Users'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Plugin User Guide

This guide intends to provide the necessary context for registering plugins with web3.js packages.

To help you get started, take a look at a list of useful plugins at [https://web3js.org/plugins](https://web3js.org/plugins)

## Installing the Plugin

Unless otherwise mentioned by the plugin author, installing a plugin should be as simple as `yarn add web3-plugin-example`. This should add the plugin as a dependency within your `package.json` and the plugin should be available to import within your code.

```json
# package.json
{
	...
	"dependencies": {
		"web3-plugin-example": "0.1.0"
	}
}
```

## Registering the Plugin

To add a plugin to an instance of a class sourced from web3.js' modules (such as `Web3` or `Web3Eth`), you will use the `.registerPlugin` method. It's important to note that this method is only available on classes that extend `Web3Context`, so it may not be available on every class you import from a Web3.js package.

For illustration purposes, let's assume a plugin developer has the following code for their plugin. Please note that this code should not be touched by the plugin user:

<Tabs groupId='prog-lang' queryString>

<TabItem value='javascript' label='JavaScript'
attributes={{className: 'javascript-tab'}}>

```typescript
// code written by the plugin **developer**

const { Web3PluginBase } = require('web3');

export class PluginExample extends Web3PluginBase {
	public pluginNamespace = 'pluginExample';

	public sampleMethod() {
		return 'simpleValue';
	}
}

// Module Augmentation
declare module 'web3' {
	interface Web3Context {
		pluginExample: PluginExample;
	}
}
```

  </TabItem>
  
  <TabItem value='typescript' label='TypeScript' default 
  	attributes={{className: 'typescript-tab'}}>

```typescript
// code written by the plugin **developer**

import { Web3PluginBase } from 'web3';

export class PluginExample extends Web3PluginBase {
	public pluginNamespace = 'pluginExample';

	public sampleMethod() {
		return 'simpleValue';
	}
}

// Module Augmentation
declare module 'web3' {
	interface Web3Context {
		pluginExample: PluginExample;
	}
}
```

  </TabItem>
</Tabs>

Here is an example of how to register the `PluginExample` onto an instance of `Web3`:

<Tabs groupId='prog-lang' queryString>

<TabItem value='javascript' label='JavaScript'
attributes={{className: 'javascript-tab'}}>

```javascript
// code written by the plugin **user**

const { Web3 } = require('web3');
const { PluginExample } = require('web3-plugin-example');

const web3 = new Web3('http://127.0.0.1:8545');
web3.registerPlugin(new PluginExample(any_parameters, if_needed));

web3.pluginExample.sampleMethod();
```

  </TabItem>
  
  <TabItem value='typescript' label='TypeScript' default 
  	attributes={{className: 'typescript-tab'}}>

```typescript
// code written by the plugin **user**

import { Web3 } from 'web3';
import { PluginExample } from 'web3-plugin-example';

const web3 = new Web3('http://127.0.0.1:8545');
web3.registerPlugin(new PluginExample(any_parameters, if_needed));

web3.pluginExample.sampleMethod();
```

  </TabItem>
</Tabs>
