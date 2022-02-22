import { Web3Context } from 'web3-core';
import { EthExecutionAPI } from 'web3-common';

import * as rpcMethodsWrappers from './rpc_method_wrappers';

export default class Web3Net extends Web3Context<EthExecutionAPI> {
	public async getId() {
		return rpcMethodsWrappers.getId(this);
	}

	public async isListening() {
		return rpcMethodsWrappers.isListening(this);
	}

	public async getPeerCount() {
		return rpcMethodsWrappers.getPeerCount(this);
	}
}
