import { Web3BaseProvider, JsonRpcResponse } from 'web3-common';
import { Web3RequestManager } from 'web3-core';

interface Web3EthOptions {
	defaultReturnType: ReturnTypes;
}

export class Web3Eth {
	private _requestManager: Web3RequestManager;
	private _options: Web3EthOptions;

	constructor(provider: Web3BaseProvider | string, options: Web3EthOptions) {
		this._requestManager = new Web3RequestManager(provider);
		this._options = options;
	}
}
