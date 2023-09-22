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
import { AbiEventFragment, ContractOptions } from 'web3-types';
import { encodeEventABI } from '../../src';

const contractOptions: ContractOptions = {
	address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
} as ContractOptions;
const abiEventFragment: AbiEventFragment & { signature: string } = {
	anonymous: false,
	inputs: [
		{
			indexed: true,
			internalType: 'string',
			name: 'str',
			type: 'string',
		},
		{
			indexed: true,
			internalType: 'uint256',
			name: 'val',
			type: 'uint256',
		},
		{
			indexed: true,
			internalType: 'bool',
			name: 'flag',
			type: 'bool',
		},
	],
	name: 'MultiValueIndexedEventWithStringIndexed',
	type: 'event',
	signature: '0x5b5730af07e266d8b4845f404beb3b193085c686b0edd8e8e20cd4b3fc2b6cd5',
};

describe('encodeEventAbi', () => {
	it('should format fromBlock for filter', () => {
		const encodedEventFilter = encodeEventABI(contractOptions, abiEventFragment, {
			fromBlock: 10,
		});

		expect(encodedEventFilter).toMatchObject({
			fromBlock: '0xa',
			address: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
		});
	});

	it('should format toBlock for filter', () => {
		const encodedEventFilter = encodeEventABI(contractOptions, abiEventFragment, {
			toBlock: 10,
		});

		expect(encodedEventFilter).toMatchObject({
			toBlock: '0xa',
			address: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
		});
	});

	it('should set topics array for filter to given topics array', () => {
		const encodedEventFilter = encodeEventABI(contractOptions, abiEventFragment, {
			topics: ['0x3f6d5d7b72c0059e2ecac56fd4adeefb2cff23aa41d13170f78ea6bf81e6e0ca'],
		});

		expect(encodedEventFilter).toMatchObject({
			topics: ['0x3f6d5d7b72c0059e2ecac56fd4adeefb2cff23aa41d13170f78ea6bf81e6e0ca'],
			address: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
		});
	});

	it('should set filter to get all events for address starting at fromBlock', () => {
		const encodedEventFilter = encodeEventABI(
			contractOptions,
			{
				anonymous: false,
				name: 'ALLEVENTS',
				type: 'event',
				signature: '0x5b5730af07e266d8b4845f404beb3b193085c686b0edd8e8e20cd4b3fc2b6cd5',
			},
			{
				fromBlock: 1000,
			},
		);

		expect(encodedEventFilter).toMatchObject({
			fromBlock: '0x3e8',
			address: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
		});
	});

	// This test fails because encoding of a dynamic sized array is not current supported
	// Received error: AbiError: Parameter encoding error
	it.skip('should set the filter topics to the keccak256 hash of the provided filter value', () => {
		const _abiEventFragment: AbiEventFragment & { signature: string } = {
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: 'uint256[]',
					name: 'vals',
					type: 'uint256[]',
				},
			],
			name: 'IndexedArrayEvent',
			type: 'event',
			signature: '0x71aefd401e4886a78931d42be506247958b9751348fa91aa2f9dbbd557e9208e',
		};

		encodeEventABI(contractOptions, _abiEventFragment, {
			filter: {
				vals: [1, 2, 3],
			},
		});
	});

	// This test fails because encoding of a dynamic sized array is not current supported
	// Received error: AbiError: Parameter encoding error
	it.skip('should set the filter topics', () => {
		const _abiEventFragment: AbiEventFragment & { signature: string } = {
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: 'uint256[]',
					name: 'vals',
					type: 'uint256[]',
				},
				{
					indexed: true,
					internalType: 'string[]',
					name: 'strs',
					type: 'string[]',
				},
				{
					indexed: true,
					internalType: 'bool[]',
					name: 'flags',
					type: 'bool[]',
				},
			],
			name: 'IndexedMultiValArrayEvent',
			type: 'event',
			signature: '0x9b5a12617e7ca791109ef5e09b8cc23cb4034e0e3dfb4aadac37b55fd28718f6',
		};

		encodeEventABI(contractOptions, _abiEventFragment, {
			filter: {
				vals: [1, 2, 3],
			},
		});
	});

	it('should filter by the keccak256 of the provided indexed string filter', () => {
		const encodedEventFilter = encodeEventABI(contractOptions, abiEventFragment, {
			filter: {
				str: 'str4',
			},
		});

		expect(encodedEventFilter).toMatchObject({
			topics: [
				'0x5b5730af07e266d8b4845f404beb3b193085c686b0edd8e8e20cd4b3fc2b6cd5',
				'0x3f6d5d7b72c0059e2ecac56fd4adeefb2cff23aa41d13170f78ea6bf81e6e0ca',
				// eslint-disable-next-line no-null/no-null
				null,
				// eslint-disable-next-line no-null/no-null
				null,
			],
			address: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
		});
	});

	it('should filter by the provided bool filter', () => {
		const encodedEventFilter = encodeEventABI(contractOptions, abiEventFragment, {
			filter: {
				flag: true,
			},
		});

		expect(encodedEventFilter).toMatchObject({
			topics: [
				'0x5b5730af07e266d8b4845f404beb3b193085c686b0edd8e8e20cd4b3fc2b6cd5',
				// eslint-disable-next-line no-null/no-null
				null,
				// eslint-disable-next-line no-null/no-null
				null,
				'0x0000000000000000000000000000000000000000000000000000000000000001',
			],
			address: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
		});
	});
});
