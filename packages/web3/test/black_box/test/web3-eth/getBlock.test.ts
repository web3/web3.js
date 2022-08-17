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
import Web3 from 'web3';
import { validator } from 'web3-validator';
// import { blockSchema } from 'web3-eth';

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
		// TODO: This attribute can be array of hashes or transaction info
		transactions: {
            oneOf: [
                {
                    type: 'array',
                    items: 'bytes32',
                }
            ]
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

describe('Black Box Unit Tests - web3.eth.getBlock', () => {
	let web3: Web3;

	beforeAll(() => {
		web3 = new Web3(process.env.WEB3_SYSTEM_TEST_PROVIDER);
	});

    it('should get the latest block and validate it against blockSchema', async () => {
		const response = await web3.eth.getBlock('latest');
		expect(response).toBeDefined();
		expect(validator.validateJSONSchema(blockSchema, response));
	});

	it('should get the latest block and validate it against blockSchema - hydrated = true', async () => {
		const response = await web3.eth.getBlock('latest', true);
		expect(response).toBeDefined();
		expect(validator.validateJSONSchema(blockSchema, response));
	});
});
