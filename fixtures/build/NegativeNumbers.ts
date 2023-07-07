/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
export const NegativeNumbersAbi = [
	{
		inputs: [
			{
				internalType: 'int256',
				name: 'number',
				type: 'int256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'int256',
				name: 'one',
				type: 'int256',
			},
		],
		name: 'OneNegativeNumber',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'int256',
				name: 'one',
				type: 'int256',
			},
		],
		name: 'OneNegativeNumberIndexed',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'positive',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'int256',
				name: 'negative',
				type: 'int256',
			},
			{
				indexed: false,
				internalType: 'string',
				name: 'str',
				type: 'string',
			},
		],
		name: 'OtherNegativeNumbers',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'positive',
				type: 'uint256',
			},
			{
				indexed: true,
				internalType: 'int256',
				name: 'negative',
				type: 'int256',
			},
			{
				indexed: false,
				internalType: 'string',
				name: 'str',
				type: 'string',
			},
		],
		name: 'OtherNegativeNumbersIndexed',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'int256',
				name: 'one',
				type: 'int256',
			},
			{
				indexed: false,
				internalType: 'int256',
				name: 'two',
				type: 'int256',
			},
		],
		name: 'TwoNegativeNumbers',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'int256',
				name: 'one',
				type: 'int256',
			},
			{
				indexed: true,
				internalType: 'int256',
				name: 'two',
				type: 'int256',
			},
		],
		name: 'TwoNegativeNumbersIndexed',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'int256',
				name: 'number',
				type: 'int256',
			},
		],
		name: 'oneNegativeNumber',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'int256',
				name: 'number',
				type: 'int256',
			},
			{
				internalType: 'int256',
				name: 'number2',
				type: 'int256',
			},
			{
				internalType: 'string',
				name: 'str',
				type: 'string',
			},
		],
		name: 'otherNegativeNumbers',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'storedNegativeNumber',
		outputs: [
			{
				internalType: 'int256',
				name: '',
				type: 'int256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'int256',
				name: 'number',
				type: 'int256',
			},
			{
				internalType: 'int256',
				name: 'number2',
				type: 'int256',
			},
		],
		name: 'twoNegativeNumbers',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
] as const;

export const NegativeNumbersBytecode =
	'0x608060405234801561001057600080fd5b506040516105b93803806105b98339818101604052810190610032919061007a565b80600081905550506100a7565b600080fd5b6000819050919050565b61005781610044565b811461006257600080fd5b50565b6000815190506100748161004e565b92915050565b6000602082840312156100905761008f61003f565b5b600061009e84828501610065565b91505092915050565b610503806100b66000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c806309872ebc1461005157806310e9b2b41461006f5780634a299b871461008b5780636119780b146100a7575b600080fd5b6100596100c3565b6040516100669190610232565b60405180910390f35b61008960048036038101906100849190610283565b6100c9565b005b6100a560048036038101906100a09190610315565b610130565b005b6100c160048036038101906100bc9190610389565b6101ae565b005b60005481565b7f5b53dc4e9e8fa2416d4e172bdad04be5a6d622643bc9ef45987b2caadd0d0c95816040516100f89190610232565b60405180910390a1807f33e7dccd3899498f4408d6468e5dfad650f32574dba2ec4f13399a82e62166d560405160405180910390a250565b7f2e1fb99ee1b27b6491b2d46a54ac8daca82f2da6810e4b8eed4d634f78fa6948848484846040516101659493929190610440565b60405180910390a182847f0e29b573959c1b6ffd5e16886385ec1732e187cc5ac10e8faceb5e02a1c7b50b84846040516101a0929190610480565b60405180910390a350505050565b7ffaa997e4b16dcde196bbb99868e16fa934a0b4c1f019e494d9fbffb5abc46fc282826040516101df9291906104a4565b60405180910390a180827f0204c97becd72594486cf753e30e8acfc9951ee663e404bc858e3d10b80da99b60405160405180910390a35050565b6000819050919050565b61022c81610219565b82525050565b60006020820190506102476000830184610223565b92915050565b600080fd5b600080fd5b61026081610219565b811461026b57600080fd5b50565b60008135905061027d81610257565b92915050565b6000602082840312156102995761029861024d565b5b60006102a78482850161026e565b91505092915050565b600080fd5b600080fd5b600080fd5b60008083601f8401126102d5576102d46102b0565b5b8235905067ffffffffffffffff8111156102f2576102f16102b5565b5b60208301915083600182028301111561030e5761030d6102ba565b5b9250929050565b6000806000806060858703121561032f5761032e61024d565b5b600061033d8782880161026e565b945050602061034e8782880161026e565b935050604085013567ffffffffffffffff81111561036f5761036e610252565b5b61037b878288016102bf565b925092505092959194509250565b600080604083850312156103a05761039f61024d565b5b60006103ae8582860161026e565b92505060206103bf8582860161026e565b9150509250929050565b6000819050919050565b6103dc816103c9565b82525050565b600082825260208201905092915050565b82818337600083830152505050565b6000601f19601f8301169050919050565b600061041f83856103e2565b935061042c8385846103f3565b61043583610402565b840190509392505050565b600060608201905061045560008301876103d3565b6104626020830186610223565b8181036040830152610475818486610413565b905095945050505050565b6000602082019050818103600083015261049b818486610413565b90509392505050565b60006040820190506104b96000830185610223565b6104c66020830184610223565b939250505056fea26469706673582212203eb052901c785465d43fe463b8123363abc0767d1df3b47a9c4cdc319870d8c264736f6c634300080d0033';
