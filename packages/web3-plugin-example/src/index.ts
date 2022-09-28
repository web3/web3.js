/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
import { ContractAbi } from 'web3-eth-abi';
import Contract from 'web3-eth-contract';
import { Web3EthPluginBase } from 'web3-core';
import { Address, BlockNumberOrTag } from 'web3-types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { Web3 } from 'web3';

import { AggregatorV3InterfaceABI } from './aggregator_v3_interface_abi';

interface Price {
	roundId: string;
	answer: string;
	startedAt: string;
	updatedAt: string;
	answeredInRound: string;
}

export type ChainlinkPluginAPI = {
	customJsonRpcMethod: () => Promise<Price>;
};

export class ChainlinkPlugin extends Web3EthPluginBase<ChainlinkPluginAPI> {
	public pluginNamespace = 'chainlink';

	protected readonly _contract: Contract<typeof AggregatorV3InterfaceABI>;

	public constructor(abi: ContractAbi, address: Address) {
		super();
		this._contract = new Contract(abi, address);
	}

	/**
	 * An example for calling a custom JSON RPC function called customJsonRpcMethod
	 * Supposing that the connected Ethereum Node provides non-standard function called `customJsonRpcMethod`
	 */
	public async customApi() {
		return this._requestManager.send({
			method: 'customJsonRpcMethod',
			params: [],
		});
	}

	/**
	 * An example for providing a method that calls a smart contract and do possibly do some processing
	 * @returns a promise to Price
	 */
	public async getPrice(): Promise<Price> {
		// call any function(s) or smart contract method(s)
		if (this._contract.currentProvider === undefined) this._contract.link(this);
		const price = await this._contract.methods.latestRoundData().call();
		// do whatever processing needed and return
		return price as unknown as Price;
	}

	/**
	 * Just to show how the standard JSON RPC methods could be called as usual
	 * @returns a promise to a string
	 */
	public async getBalance(address: Address, blockNumber: BlockNumberOrTag) {
		// call any standard
		return this._requestManager.send({
			method: 'eth_getBalance',
			params: [address, blockNumber],
		});
	}
}

declare module 'web3' {
	interface Web3 {
		chainlink: ChainlinkPlugin;
	}
}
