import { Web3Context } from 'web3-core';

import { getSyncing } from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { isSyncing } from '../../../src/rpc_method_wrappers';

jest.mock('../../../src/rpc_methods');

describe('isSyncing', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it('should call rpcMethods.getSyncing with expected parameters', async () => {
		await isSyncing(web3Context);
		expect(getSyncing).toHaveBeenCalledWith(web3Context.requestManager);
	});
});
