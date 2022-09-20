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
export const accessListItemSchema = {
	type: 'object',
	properties: {
		address: {
			eth: 'address',
		},
		storageKeys: {
			type: 'array',
			items: {
				eth: 'bytes32',
			},
		},
	},
};

export const accessListSchema = {
	type: 'array',
	items: {
		...accessListItemSchema,
	},
};

export const chainSchema = {
	type: 'string',
	enum: ['goerli', 'kovan', 'mainnet', 'rinkeby', 'ropsten', 'sepolia'],
};

export const hardforkSchema = {
	type: 'string',
	enum: [
		'arrowGlacier',
		'berlin',
		'byzantium',
		'chainstart',
		'constantinople',
		'dao',
		'homestead',
		'istanbul',
		'london',
		'merge',
		'muirGlacier',
		'petersburg',
		'shanghai',
		'spuriousDragon',
		'tangerineWhistle',
	],
};

export const customChainSchema = {
	type: 'object',
	properties: {
		name: {
			eth: 'string',
		},
		networkId: {
			eth: 'uint',
		},
		chainId: {
			eth: 'uint',
		},
	},
};

export const transactionSchema = {
	type: 'object',
	properties: {
		from: {
			eth: 'address',
		},
		to: {
			eth: 'address',
		},
		value: {
			eth: 'uint',
		},
		gas: {
			eth: 'uint',
		},
		gasPrice: {
			eth: 'uint',
		},
		effectiveGasPrice: {
			eth: 'uint',
		},
		type: {
			eth: 'uint',
		},
		maxFeePerGas: {
			eth: 'uint',
		},
		maxPriorityFeePerGas: {
			eth: 'uint',
		},
		accessList: {
			...accessListSchema,
		},
		data: {
			eth: 'bytes',
		},
		input: {
			eth: 'bytes',
		},
		nonce: {
			eth: 'uint',
		},
		chain: { ...chainSchema },
		hardfork: { ...hardforkSchema },
		chainId: {
			eth: 'uint',
		},
		networkId: {
			eth: 'uint',
		},
		common: {
			type: 'object',
			properties: {
				customChain: { ...customChainSchema },
				baseChain: {
					...chainSchema,
				},
				hardfork: {
					...hardforkSchema,
				},
			},
		},
		gasLimit: {
			eth: 'uint',
		},
		v: {
			eth: 'uint',
		},
		r: {
			eth: 'bytes',
		},
		s: {
			eth: 'bytes',
		},
	},
};

export const transactionInfoSchema = {
	type: 'object',
	properties: {
		...transactionSchema.properties,
		blockHash: {
			eth: 'bytes32',
		},
		blockNumber: {
			eth: 'uint',
		},
		hash: {
			eth: 'bytes32',
		},
		transactionIndex: {
			eth: 'uint',
		},
		from: {
			eth: 'address',
		},
		to: {
			eth: 'address',
		},
		value: {
			eth: 'uint',
		},
		gas: {
			eth: 'uint',
		},
		gasPrice: {
			eth: 'uint',
		},
		effectiveGasPrice: {
			eth: 'uint',
		},
		type: {
			eth: 'uint',
		},
		maxFeePerGas: {
			eth: 'uint',
		},
		maxPriorityFeePerGas: {
			eth: 'uint',
		},
		accessList: {
			...accessListSchema,
		},
		data: {
			eth: 'bytes',
		},
		input: {
			eth: 'bytes',
		},
		nonce: {
			eth: 'uint',
		},
		gasLimit: {
			eth: 'uint',
		},
		v: {
			eth: 'uint',
		},
		r: {
			eth: 'bytes',
		},
		s: {
			eth: 'bytes',
		},
	},
};

export const blockSchema = {
	type: 'object',
	properties: {
		parentHash: {
			eth: 'bytes32',
		},
		sha3Uncles: {
			eth: 'bytes32',
		},
		miner: {
			eth: 'bytes',
		},
		stateRoot: {
			eth: 'bytes32',
		},
		transactionsRoot: {
			eth: 'bytes32',
		},
		receiptsRoot: {
			eth: 'bytes32',
		},
		logsBloom: {
			eth: 'bytes256',
		},
		difficulty: {
			eth: 'uint',
		},
		number: {
			eth: 'uint',
		},
		gasLimit: {
			eth: 'uint',
		},
		gasUsed: {
			eth: 'uint',
		},
		timestamp: {
			eth: 'uint',
		},
		extraData: {
			eth: 'bytes',
		},
		mixHash: {
			eth: 'bytes32',
		},
		nonce: {
			eth: 'uint',
		},
		totalDifficulty: {
			eth: 'uint',
		},
		baseFeePerGas: {
			eth: 'uint',
		},
		size: {
			eth: 'uint',
		},
		transactions: {
			oneOf: [
				{
					type: 'array',
					items: {
						...transactionInfoSchema,
					},
				},
				{
					type: 'array',
					items: {
						eth: 'bytes32',
					},
				},
			],
		},
		uncles: {
			type: 'array',
			items: {
				eth: 'bytes32',
			},
		},
		hash: {
			eth: 'bytes32',
		},
	},
};

export const blockHeaderSchema = {
	type: 'object',
	properties: {
		parentHash: {
			eth: 'bytes32',
		},
		receiptRoot: {
			eth: 'bytes32',
		},
		miner: {
			eth: 'bytes',
		},
		stateRoot: {
			eth: 'bytes32',
		},
		transactionsRoot: {
			eth: 'bytes32',
		},
		logsBloom: {
			eth: 'bytes256',
		},
		difficulty: {
			eth: 'uint',
		},
		number: {
			eth: 'uint',
		},
		gasLimit: {
			eth: 'uint',
		},
		gasUsed: {
			eth: 'uint',
		},
		timestamp: {
			eth: 'uint',
		},
		extraData: {
			eth: 'bytes',
		},
		nonce: {
			eth: 'uint',
		},
		sha3Uncles: {
			eth: 'bytes32',
		},
	},
};

export const logSchema = {
	type: 'object',
	properties: {
		removed: {
			eth: 'bool',
		},
		logIndex: {
			eth: 'uint',
		},
		transactionIndex: {
			eth: 'uint',
		},
		transactionHash: {
			eth: 'bytes32',
		},
		blockHash: {
			eth: 'bytes32',
		},
		blockNumber: {
			eth: 'uint',
		},
		address: {
			eth: 'address',
		},
		data: {
			eth: 'bytes',
		},
		topics: {
			type: 'array',
			items: {
				eth: 'bytes32',
			},
		},
	},
};
export const syncSchema = {
	type: 'object',
	properties: {
		startingBlock: {
			eth: 'string',
		},
		currentBlock: {
			eth: 'string',
		},
		highestBlock: {
			eth: 'string',
		},
		knownStates: {
			eth: 'string',
		},
		pulledStates: {
			eth: 'string',
		},
	},
};

export const transactionReceiptSchema = {
	type: 'object',
	properties: {
		transactionHash: {
			eth: 'bytes32',
		},
		transactionIndex: {
			eth: 'uint',
		},
		blockHash: {
			eth: 'bytes32',
		},
		blockNumber: {
			eth: 'uint',
		},
		from: {
			eth: 'address',
		},
		to: {
			eth: 'address',
		},
		cumulativeGasUsed: {
			eth: 'uint',
		},
		gasUsed: {
			eth: 'uint',
		},
		effectiveGasPrice: {
			eth: 'uint',
		},
		contractAddress: {
			eth: 'address',
		},
		logs: {
			type: 'array',
			items: {
				...logSchema,
			},
		},
		logsBloom: {
			eth: 'bytes',
		},
		root: {
			eth: 'bytes',
		},
		status: {
			eth: 'uint',
		},
		type: {
			eth: 'uint',
		},
	},
};

export const feeHistorySchema = {
	type: 'object',
	properties: {
		oldestBlock: {
			eth: 'uint',
		},
		baseFeePerGas: {
			type: 'array',
			items: {
				eth: 'uint',
			},
		},
		reward: {
			type: 'array',
			items: {
				type: 'array',
				items: {
					eth: 'uint',
				},
			},
		},
		gasUsedRatio: {
			type: 'array',
			items: {
				type: 'number',
			},
		},
	},
};

export const storageProofSchema = {
	type: 'object',
	properties: {
		key: {
			eth: 'bytes32',
		},
		value: {
			eth: 'uint',
		},
		proof: {
			type: 'array',
			items: {
				eth: 'bytes32',
			},
		},
	},
};

export const accountSchema = {
	type: 'object',
	properties: {
		balance: {
			eth: 'uint',
		},
		codeHash: {
			eth: 'bytes32',
		},
		nonce: {
			eth: 'uint',
		},
		storageHash: {
			eth: 'bytes32',
		},
		accountProof: {
			type: 'array',
			items: {
				eth: 'bytes32',
			},
		},
		storageProof: {
			type: 'array',
			items: {
				...storageProofSchema,
			},
		},
	},
};
