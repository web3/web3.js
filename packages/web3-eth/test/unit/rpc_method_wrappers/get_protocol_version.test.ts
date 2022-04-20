import { Web3Context } from 'web3-core';

import { getProtocolVersion as rpcMethodsGetProtocolVersion } from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { getProtocolVersion } from '../../../src/rpc_method_wrappers';

jest.mock('../../../src/rpc_methods');

describe('getProtocolVersion', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it('should call rpcMethods.getProtocolVersion with expected parameters', async () => {
		await getProtocolVersion(web3Context);
		expect(rpcMethodsGetProtocolVersion).toHaveBeenCalledWith(web3Context.requestManager);
	});
});
