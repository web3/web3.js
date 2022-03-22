import { Web3Context } from 'web3-core';

import { ValidTypes } from 'web3-utils';
import * as rpcMethodsWrappers from './rpc_method_wrappers';
import { Web3NetAPI } from './web3_net_api';

export class Web3Net extends Web3Context<Web3NetAPI> {
	public async getId<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getId(this, returnType);
	}

	public async getPeerCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
		returnType?: ReturnType,
	) {
		return rpcMethodsWrappers.getPeerCount(this, returnType);
	}

	public async isListening() {
		return rpcMethodsWrappers.isListening(this);
	}
}
