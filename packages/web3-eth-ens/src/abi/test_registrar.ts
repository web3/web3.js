// https://github.com/ensdomains/ens/blob/master/contracts/TestRegistrar.sol
const TEST_REGISTRAR = [
	{
		inputs: [
			{
				internalType: 'contract ENS',
				name: 'ensAddr',
				type: 'address',
			},
			{
				internalType: 'bytes32',
				name: 'node',
				type: 'bytes32',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [],
		name: 'ens',
		outputs: [
			{
				internalType: 'contract ENS',
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
				name: '',
				type: 'bytes32',
			},
		],
		name: 'expiryTimes',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
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
		name: 'register',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'rootNode',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
] as const;

export default TEST_REGISTRAR;
