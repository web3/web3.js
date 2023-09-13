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
import { Web3PluginBase } from 'web3-core';
import Contract from 'web3-eth-contract';
import { Address, ContractAbi, DataFormat, DEFAULT_RETURN_FORMAT, Numbers } from 'web3-types';
import { format, numberToHex } from 'web3-utils';
// eslint-disable-next-line require-extensions/require-extensions
import { ERC20TokenAbi } from './ERC20Token';
// eslint-disable-next-line require-extensions/require-extensions
import { Web3Context } from './reexported_web3_context';

export class ContractMethodWrappersPlugin extends Web3PluginBase {
	public pluginNamespace = 'contractMethodWrappersPlugin';

	// This should be private, but it's public so _contract.requestManager.send can
	// be mocked in contract_method_wrappers.test.ts
	public readonly _contract: Contract<typeof ERC20TokenAbi>;

	public constructor(abi: ContractAbi, address: Address) {
		super();
		this._contract = new Contract(abi, address);
	}

	/**
	 * This method overrides the inherited `link` method from `Web3PluginBase`
	 * to add to a configured `RequestManager` to our Contract instance
	 * when `Web3.registerPlugin` is called.
	 *
	 * @param parentContext - The context to be added to the instance of `ChainlinkPlugin`,
	 * and by extension, the instance of `Contract`.
	 */
	public link(parentContext: Web3Context) {
		super.link(parentContext);
		this._contract.link(parentContext);
	}

	public async getFormattedBalance<ReturnFormat extends DataFormat>(
		address: Address,
		returnFormat: ReturnFormat,
	) {
		return format(
			{ format: 'unit' },
			await this._contract.methods.balanceOf(address).call(),
			returnFormat,
		);
	}

	public async transferAndGetBalances<ReturnFormat extends DataFormat>(
		sender: Address,
		recipient: Address,
		amount: Numbers,
		returnFormat?: ReturnFormat,
	) {
		await this._contract.methods
			.transfer(recipient, numberToHex(amount))
			.send({ from: sender, type: 0 });
		return {
			sender: {
				address: sender,
				balance: await this.getFormattedBalance(
					sender,
					returnFormat ?? DEFAULT_RETURN_FORMAT,
				),
			},
			recipient: {
				address: recipient,
				balance: await this.getFormattedBalance(
					recipient,
					returnFormat ?? DEFAULT_RETURN_FORMAT,
				),
			},
		};
	}
}

// Module Augmentation
declare module './reexported_web3_context' {
	interface Web3Context {
		contractMethodWrappersPlugin: ContractMethodWrappersPlugin;
	}
}

export { Web3Context };
