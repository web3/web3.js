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
// eslint-disable-next-line max-classes-per-file
import { Web3Context } from 'web3-core';
import Web3Eth from 'web3-eth';
import { ContractAbi } from 'web3-eth-abi';
import Contract, { ContractInitOptions } from 'web3-eth-contract';
import { ENS, registryAddresses } from 'web3-eth-ens';
import Iban from 'web3-eth-iban';
import Personal from 'web3-eth-personal';
import Net from 'web3-net';
import * as utils from 'web3-utils';
import { isNullish } from 'web3-utils';
import { EthExecutionAPI, Address, SupportedProviders } from 'web3-types';
import abi from './abi';
import { initAccountsForContext } from './accounts';
import { Web3EthInterface } from './types';
import { Web3PkgInfo } from './version';

export default class Web3 extends Web3Context<EthExecutionAPI> {
	public static version = Web3PkgInfo.version;
	public static utils = utils;
	public static modules = {
		Web3Eth,
		Iban,
		Net,
		ENS,
		Personal,
	};

	public utils: typeof utils;

	public eth: Web3EthInterface;

	public constructor(provider?: SupportedProviders<EthExecutionAPI> | string) {
		super({ provider });

		if (isNullish(provider) || (typeof provider === 'string' && provider.trim() === '')) {
			console.warn(
				'NOTE: web3.js is running without provider. You need to pass a provider in order to interact with the network!',
			);
		}

		const accounts = initAccountsForContext(this);

		// Init protected properties
		this._wallet = accounts.wallet;
		this._accountProvider = accounts;

		this.utils = utils;

		// Have to use local alias to initiate contract context
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		class ContractBuilder<Abi extends ContractAbi> extends Contract<Abi> {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			private static readonly _contracts: Contract<any>[] = [];

			public constructor(jsonInterface: Abi);
			public constructor(jsonInterface: Abi, address: Address);
			public constructor(jsonInterface: Abi, options: ContractInitOptions);
			public constructor(jsonInterface: Abi, address: Address, options: ContractInitOptions);
			public constructor(
				jsonInterface: Abi,
				addressOrOptions?: Address | ContractInitOptions,
				options?: ContractInitOptions,
			) {
				if (typeof addressOrOptions === 'string') {
					super(jsonInterface, addressOrOptions, self.getContextObject());
				} else if (typeof addressOrOptions === 'object') {
					super(jsonInterface, addressOrOptions, self.getContextObject());
				} else if (!isNullish(addressOrOptions) && isNullish(options)) {
					super(jsonInterface, addressOrOptions ?? {}, self.getContextObject());
				} else if (isNullish(addressOrOptions) && !isNullish(options)) {
					super(jsonInterface, options ?? {}, self.getContextObject());
				} else {
					super(jsonInterface, self.getContextObject());
				}

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				ContractBuilder._contracts.push(this as Contract<any>);
			}

			public static setProvider(_provider: SupportedProviders<EthExecutionAPI>): boolean {
				for (const contract of ContractBuilder._contracts) {
					contract.provider = _provider;
				}
				return true;
			}
		}

		const eth = self.use(Web3Eth);

		// Eth Module
		this.eth = Object.assign(eth, {
			// ENS module
			ens: self.use(ENS, registryAddresses.main), // registry address defaults to main network

			// Iban helpers
			Iban,

			net: self.use(Net),
			personal: self.use(Personal),

			// Contract helper and module
			Contract: ContractBuilder,

			// ABI Helpers
			abi,

			// Accounts helper
			accounts,
		});
	}
}
