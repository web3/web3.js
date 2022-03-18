import { DataFormat, DEFAULT_RETURN_FORMAT } from 'web3-common';
import { Web3Context } from 'web3-core';
import * as rpcMethodsWrappers from './rpc_method_wrappers';
import { Web3NetAPI } from './web3_net_api';

export class Web3Net extends Web3Context<Web3NetAPI> {
	public async getId<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getId(this, returnFormat);
	}

	public async getPeerCount<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getPeerCount(this, returnFormat);
	}

	public async isListening() {
		return rpcMethodsWrappers.isListening(this);
	}
}
