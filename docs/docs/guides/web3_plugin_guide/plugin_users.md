---
sidebar_position: 0
sidebar_label: 'For Plugin Users'
---

# Plugin User Guide

This guide intends to provide the necessary context for registering plugins with web3.js packages.

## Installing the Plugin

Unless otherwise mentioned by the plugin author, installing a plugin should be as simple as `yarn add web3-sample-plugin`. This should add the plugin as a dependency within your `package.json` and the plugin should be available to import within your code.

```json
# package.json
{
	...
	"dependencies": {
		"web3-sample-plugin": "0.1.0"
	}
}
```

## Registering the Plugin

The `.registerPlugin` method is what you're going to be using to add a plugin to an instance of a class sourced from web3.js' modules (i.e. `Web3` or `Web3Eth`). This method only exists on classes that extend `Web3Context`, so it may not be available on every class you import from a Web3.js package.

The following is an example of registering a plugin named `SamplePlugin` onto an instance of `Web3`:

```typescript
import Web3 from 'web3';
import SamplePlugin from 'web3-sample-plugin';

const web3 = new Web3('http://127.0.0.1:8545');
web3.registerPlugin(new SamplePlugin(any_parameters, if_needed));

web3.samplePlugin.sampleMethod();
```
