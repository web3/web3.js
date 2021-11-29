import { EthAbiParameterCoder } from './coder/eth_abi_coders';

const abi = {
	inputs: [
		{
			internalType: 'uint256',
			name: 'first',
			type: 'uint256',
		},
		{
			internalType: 'uint32[]',
			name: 'second',
			type: 'uint32[]',
		},
		{
			internalType: 'bytes10',
			name: 'third',
			type: 'bytes10',
		},
		{
			internalType: 'bytes',
			name: 'fourth',
			type: 'bytes',
		},
		// {
		// 	components: [
		// 		{
		// 			internalType: 'uint256',
		// 			name: 'a',
		// 			type: 'uint256',
		// 		},
		// 		{
		// 			internalType: 'uint256[]',
		// 			name: 'b',
		// 			type: 'uint256[]',
		// 		},
		// 		{
		// 			components: [
		// 				{
		// 					internalType: 'uint256',
		// 					name: 'x',
		// 					type: 'uint256',
		// 				},
		// 				{
		// 					internalType: 'uint256',
		// 					name: 'y',
		// 					type: 'uint256',
		// 				},
		// 			],
		// 			internalType: 'struct Test.T[]',
		// 			name: 'c',
		// 			type: 'tuple[]',
		// 		},
		// 	],
		// 	internalType: 'struct Test.S',
		// 	name: 'sVar',
		// 	type: 'tuple',
		// },
		// {
		// 	components: [
		// 		{
		// 			internalType: 'uint256',
		// 			name: 'x',
		// 			type: 'uint256',
		// 		},
		// 		{
		// 			internalType: 'uint256',
		// 			name: 'y',
		// 			type: 'uint256',
		// 		},
		// 	],
		// 	internalType: 'struct Test.T',
		// 	name: 'tVar',
		// 	type: 'tuple',
		// },
		// {
		// 	components: [
		// 		{
		// 			internalType: 'uint256',
		// 			name: 'x',
		// 			type: 'uint256',
		// 		},
		// 		{
		// 			internalType: 'uint256',
		// 			name: 'y',
		// 			type: 'uint256',
		// 		},
		// 	],
		// 	internalType: 'struct Test.T[]',
		// 	name: 'tArray',
		// 	type: 'tuple[]',
		// },
		// {
		// 	internalType: 'int256[5]',
		// 	name: 'fixedArray',
		// 	type: 'int256[5]',
		// },
	],
	name: 'func',
	outputs: [
		{
			internalType: 'uint256',
			name: '',
			type: 'uint256',
		},
	],
	stateMutability: 'view',
	type: 'function' as const,
};

const coder = new EthAbiParameterCoder(abi.inputs);
// const data = EthAbiParameterCoder.compile(abi.inputs);
console.log(coder.encode([0x123, [0x456, 0x789], '1234567890', 'Hello, world!']).toString('hex'));
// console.log(data[7]);
