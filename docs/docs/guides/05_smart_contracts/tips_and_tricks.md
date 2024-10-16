---
sidebar_position: 4
sidebar_label: 'Tips and Tricks'
---

# Smart Contracts Tips and Tricks

:::tip
📝 This article offers insights into **Smart Contracts** with helpful tips and tricks. If you have suggestions or questions, feel free to open an issue. We also welcome contributions through PRs.
:::

## Ignoring Web3.js autofill gas prices

When interacting with methods in contracts, Web3.js will automatically fill the gas. If you are using metamask or a similar provider and would rather have a suggestion elsewhere, the `ignoreGasPricing` option enables you to send transactions or interact with contracts without having web3.js automatically fill in the gas estimate.

#### Contract example

```ts
let contractDeployed: Contract<typeof BasicAbi>;
// instantiate contract...
contractDeployed.config.ignoreGasPricing = true;
const receipt = await contractDeployed.methods.setValues(1, 'string value', true).send(sendOptions);
```

## Calling Smart Contracts Methods with Parameter Overloading

### Overview of Function Overloading

Parameter overloading enables smart contracts to define multiple functions bearing the same name, differentiated only by their parameters. While this enhances legibility and organization, it complicates calls due to the need for precise method identification.

### Example Code

Below is a demonstration of invoking two versions of the `funcWithParamsOverloading` function in a smart contract, differentiated by their parameter types: `uint256` versus `address`.

The Solidity code:

```solidity
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.20 <0.9.0;

contract TestOverlading {
	function funcWithParamsOverloading(uint256 userId) public pure returns (string memory) {
		return "called for the parameter with the type 'uint256'";
	}

	function funcWithParamsOverloading(address userAddress) public pure returns (string memory) {
		return "called for the parameter with the type 'address'";
	}
}

```

The TypeScript:

```typescript
import { Web3 } from 'web3';

const ABI = [
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'userId',
				type: 'uint256',
			},
		],
		name: 'funcWithParamsOverloading',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'userAddress',
				type: 'address',
			},
		],
		name: 'funcWithParamsOverloading',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
] as const;

(async function () {
	const web3 = new Web3(provider);

	const contract = new web3.eth.Contract(ABI, contractAddress);

	// Calling the function that accepts an address
	const res1 = await contract.methods['funcWithParamsOverloading(address)'](userAddress).call();

	// Calling the function that accepts a uint256
	const res2 = await contract.methods['funcWithParamsOverloading(uint256)'](userId).call();
})();
```

### Handling Ambiguity in Overloaded Methods

Omitting the explicit specification for overloading, as highlighted earlier, results in the default selection of the first method match in the ABI, along with a warning. Future web3.js releases will address this with an error to enforce stricter specification.

#### Demonstrating the Importance of Specificity

To underline specificity's value, here's a scenario of invoking an overloaded function without specifying the parameter type:

```typescript
// Assuming a contract with overloaded methods: funcWithParamsOverloading(uint256) and funcWithParamsOverloading(string)...

(async function () {
  try {
    // A call without specifying overloading results in a warning and choosing the first matched overload
    const ambiguousResult = await contract.methods.funcWithParamsOverloading('0x0123').call();
})();
```

This generates a console warning on the ambiguity and auto-selects the first matching function overload found in the ABI:

```
Multiple methods found that are compatible with the given inputs. Found 2 compatible methods: ["funcWithParamsOverloading(uint256) (signature: 0x...)", "funcWithParamsOverloading(string) (signature: 0x...)"] The first one will be used: funcWithParamsOverloading(uint256)
```

### Future Considerations

Future releases of web3.js, specifically version 5.x, will replace the warning with an error whenever multiple methods match a call without explicit overloading. This aims to foster greater precision in method invocation.

### Key Takeaway for function overlading: Method Specification

When working with overloaded smart contract methods, it's imperative to specify the intended method by appending its parameter types within parentheses, such as `funcWithParamsOverloading(address)` versus `funcWithParamsOverloading(uint256)`. This ensures the accuracy of method invocation, leading to more efficient and clearer contract interactions.
