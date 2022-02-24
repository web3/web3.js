import { Web3Context } from 'web3-core';

import * as rpcMethodsWrappers from './rpc_method_wrappers';
import { NetRPCApi } from './types';

export class Web3Net extends Web3Context<NetRPCApi> {
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

export default Web3Net;
