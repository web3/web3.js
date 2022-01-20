// https://github.com/ensdomains/ens/blob/master/contracts/ENS.sol
const REGISTRY = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'operator',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'approved',
				type: 'bool',
			},
		],
		name: 'ApprovalForAll',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'node',
				type: 'bytes32',
			},
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'label',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'NewOwner',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'node',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'resolver',
				type: 'address',
			},
		],
		name: 'NewResolver',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'node',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'uint64',
				name: 'ttl',
				type: 'uint64',
			},
		],
		name: 'NewTTL',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'node',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'operator',
				type: 'address',
			},
		],
		name: 'isApprovedForAll',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'node',
				type: 'bytes32',
			},
		],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'node',
				type: 'bytes32',
			},
		],
		name: 'recordExists',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'node',
				type: 'bytes32',
			},
		],
		name: 'resolver',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'operator',
				type: 'address',
			},
			{
				internalType: 'bool',
				name: 'approved',
				type: 'bool',
			},
		],
		name: 'setApprovalForAll',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'node',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'setOwner',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'node',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'resolver',
				type: 'address',
			},
			{
				internalType: 'uint64',
				name: 'ttl',
				type: 'uint64',
			},
		],
		name: 'setRecord',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'node',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'resolver',
				type: 'address',
			},
		],
		name: 'setResolver',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'node',
				type: 'bytes32',
			},
			{
				internalType: 'bytes32',
				name: 'label',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'setSubnodeOwner',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'node',
				type: 'bytes32',
			},
			{
				internalType: 'bytes32',
				name: 'label',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'resolver',
				type: 'address',
			},
			{
				internalType: 'uint64',
				name: 'ttl',
				type: 'uint64',
			},
		],
		name: 'setSubnodeRecord',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'node',
				type: 'bytes32',
			},
			{
				internalType: 'uint64',
				name: 'ttl',
				type: 'uint64',
			},
		],
		name: 'setTTL',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'node',
				type: 'bytes32',
			},
		],
		name: 'ttl',
		outputs: [
			{
				internalType: 'uint64',
				name: '',
				type: 'uint64',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
] as const;

module.exports = REGISTRY;
