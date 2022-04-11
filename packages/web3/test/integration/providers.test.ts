import { toWei, numberToHex } from 'web3-utils';

import { httpStringProvider, accounts } from '../fixtures/config';
import { Web3 } from '../../src/index';

describe('Web3 providers', () => {
	it('should set the provider', async () => {
		const web3 = new Web3('http://dummy.com');

		web3.provider = httpStringProvider;

		expect(web3).toBeInstanceOf(Web3);

		const response = await web3.eth.getBalance(accounts[0].address);

		expect(response).toEqual(
			numberToHex(toWei(parseInt(accounts[0].balance, 10), 'ether')).toString(),
		);
	});
});
