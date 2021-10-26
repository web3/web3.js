import { Web3BaseProvider } from 'web3-common';
import { JsonRpcResponse } from 'web3-common/src';
import { Web3RequestManager } from 'web3-core/src/web3_request_manager';

enum ReturnTypes {
	HexString = 'HexString',
	Number = 'Number',
	NumberString = 'NumberString',
	BigInt = 'BigInt',
}

interface Web3EthOptions {
	defaultReturnType: ReturnTypes;
}

interface Web3EthMethodOptions {
	returnType: ReturnTypes;
}

export class Web3Eth {
	private _requestManager: Web3RequestManager;
	private _options: Web3EthOptions;

	constructor(provider: Web3BaseProvider | string, options: Web3EthOptions) {
		// TODO
		// @ts-expect-error - Expects additional argument, but I don't think it needs it
		this._requestManager = new Web3RequestManager(provider);
		this._options = options;
	}

	public async getProtocolVersion(options?: Web3EthMethodOptions): Promise<ReturnTypes> {
		// TODO
		// @ts-expect-error - request is type any
		let response = await this._requestManager.provider.request<JsonRpcResponse<string>, []>({
			method: 'eth_protocolVersion',
		});

		if (options?.returnType !== undefined) {
			// convert response.result
		}

		return response;
	}
}
