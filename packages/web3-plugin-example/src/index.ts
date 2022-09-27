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
import { Web3PluginBase } from 'web3-core';
import { Address, Web3APISpec } from 'web3-types';
// @ts-expect-error 'Web3' is declared but its value is never read.
import { Web3 } from 'web3';

import { AggregatorV3InterfaceABI } from './aggregator_v3_interface_abi';

interface Price {
	roundId: string;
	answer: string;
	startedAt: string;
	updatedAt: string;
	answeredInRound: string;
}

interface ChainlinkPluginAPI extends Web3APISpec {
	getPrice: () => Promise<Price>;
}

declare module 'web3' {
	interface Web3 {
		chainlink: ChainlinkPluginAPI;
	}
}

export class ChainlinkPlugin extends Web3PluginBase<ChainlinkPluginAPI> {
	public pluginNamespace = 'chainlink';

	protected readonly _contract: Contract<typeof AggregatorV3InterfaceABI>;

	public constructor(abi: ContractAbi, address: Address) {
		super();
		this._contract = new Contract(abi, address);
	}

	public async getPrice() {
		if (this._contract.currentProvider === undefined) this._contract.link(this);
		return this._contract.methods.latestRoundData().call();
	}
}
