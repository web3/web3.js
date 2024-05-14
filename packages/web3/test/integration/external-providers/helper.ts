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

import { SupportedProviders } from 'web3-types';
import { Contract } from 'web3-eth-contract';
import Web3 from '../../../src/index';
import { BasicAbi, BasicBytecode } from '../../shared_fixtures/build/Basic';

/**
 * Performs basic RPC calls (like `eth_accounts`, `eth_blockNumber` and `eth_sendTransaction`)
 * @param provider - an instance of a compatible provider
 */
export async function performBasicRpcCalls(provider: SupportedProviders) {
	const web3 = new Web3(provider);
	const accounts = await web3.eth.getAccounts();
	expect(accounts).toBeDefined();
	expect(accounts.length).toBeGreaterThan(0);
	// get the last block number
	const blockNumber0 = await web3.eth.getBlockNumber();
	expect(typeof blockNumber0).toBe('bigint');

	// send a transaction
	const tx = await web3.eth.sendTransaction({
		to: accounts[1],
		from: accounts[0],
		value: '1',
		gas: 21000,
	});
	expect(tx.status).toBe(BigInt(1));

	const blockNumber1 = await web3.eth.getBlockNumber();
	expect(typeof blockNumber1).toBe('bigint');

	// After sending a transaction, the blocknumber is supposed to be greater than or equal the block number before sending the transaction
	expect(blockNumber1).toBeGreaterThanOrEqual(blockNumber0);
}

export async function failErrorCalls(provider: SupportedProviders) {
	let contract: Contract<typeof BasicAbi>;
	const web3 = new Web3(provider);

	contract = new web3.eth.Contract(BasicAbi, undefined, {
		provider,
	});

	let deployOptions: Record<string, unknown>;

	// eslint-disable-next-line prefer-const
	deployOptions = {
		data: BasicBytecode,
		arguments: [10, 'string init value'],
	};
	const accounts = await web3.eth.getAccounts();

	const sendOptions = { from: accounts[0], gas: '1000000' };

	contract = await contract.deploy(deployOptions).send(sendOptions);

	await contract.methods.reverts().send({ from: accounts[0] });
}
