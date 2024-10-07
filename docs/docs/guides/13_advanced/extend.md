---
sidebar_position: 2
sidebar_label: Extending Web3.js
---

# Extending Web3.js

Although the preferred way to add custom RPC methods to Web3.js is to [create a plugin](/guides/advanced/custom_RPC), Web3.js also exposes a [legacy `extend` method](/api/web3/class/Web3Context#extend) that can be used for the same purpose. Keep reading to learn how to use the legacy `extend` method to add a custom RPC method to an instance of Web3.js.

## `ExtensionObject`

The legacy `extend` method accepts a single parameter that should implement the [`ExtensionObject` interface](/api/web3/namespace/core/#ExtensionObject). An `ExtensionObject` consists of two properties: an optional `string` property named `property` and a required property named `methods` that is an array of objects that implement the [`Method` interface](/api/web3/namespace/core/#Method). The `Method` interface specifies two properties, both of which are required and both of which are strings: `name` and `call`. The `property` property of an `Extension` object can be used to specify the name of the Web3.js member property that will expose the custom RPC methods (if this parameter is omitted, the new RPC methods will be exposed by the "root" Web3.js object). Each element of the `methods` array from the `ExtensionObject` specifies a new custom RPC method - the `name` property is the name of the new function that will be used to call the custom RPC method and the `call` property is the actual RPC endpoint that should be invoked. The new function will accept parameters that will be passed along when invoking the RPC endpoint.

Here is a complete example of using the legacy `extend` method:

```js
import { Web3 } from 'web3';

const web3 = new Web3('https://eth.llamarpc.com');

async function main() {
	web3.extend({
		property: 'BlockReceipts',
		methods: [
			{
				name: 'getBlockReceipts',
				// https://www.quicknode.com/docs/ethereum/eth_getBlockReceipts
				call: 'eth_getBlockReceipts',
			},
		],
	});

	const receipts = await web3.BlockReceipts.getBlockReceipts('latest');
	console.log(receipts);
}

main();
```
