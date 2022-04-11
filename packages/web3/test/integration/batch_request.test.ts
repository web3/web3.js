/* eslint-disable @typescript-eslint/no-unsafe-call */
import { JsonRpcOptionalRequest } from 'web3-common';
import { toWei, numberToHex } from 'web3-utils';

import { httpStringProvider, accounts } from '../fixtures/config';
import { Web3 } from '../../src/index';

describe('Batch Request', () => {
	let request1: JsonRpcOptionalRequest;
	let request2: JsonRpcOptionalRequest;
	beforeEach(() => {
		request1 = {
			id: 10,
			method: 'eth_getBalance',
			params: [accounts[0].address, 'latest'],
		};
		request2 = {
			id: 11,
			method: 'eth_getBalance',
			params: [accounts[1].address, 'latest'],
		};
	});

	const balanceWeiHex = (balance: string) =>
		numberToHex(toWei(parseInt(balance, 10), 'ether')).toString();

	it('should execute batch requests', async () => {
		const web3 = new Web3(httpStringProvider);

		const batch = new web3.BatchRequest();

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		batch.add(request1);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		batch.add(request2);
		const response = await batch.execute();
		const hexWeiBalances = accounts.map(acc => balanceWeiHex(acc.balance));

		expect(response).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: request1.id, result: hexWeiBalances[0] }),
				expect.objectContaining({ id: request2.id, result: hexWeiBalances[1] }),
			]),
		);
	});
});
