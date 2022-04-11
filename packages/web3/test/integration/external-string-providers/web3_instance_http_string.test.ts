import { externalHttpsStringProvider } from '../../fixtures/config';

import { Web3 } from '../../../src/index';

describe('Web3 instance', () => {
	describe('Create Web3 class instance with string providers', () => {
		it('should create instance with string of http provider', async () => {
			const web3 = new Web3(externalHttpsStringProvider);
			expect(web3).toBeInstanceOf(Web3);
		});
	});
});
