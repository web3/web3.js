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
import { EthExecutionAPI } from 'web3-common';
import { SupportedProviders, Web3Context } from 'web3-core';
import Eth from 'web3-eth';
import { Iban } from 'web3-eth-iban';
import { ENS, registryAddresses } from 'web3-eth-ens';
import {
	ContractAbi,
	encodeFunctionCall,
	encodeParameter,
	encodeParameters,
	decodeParameter,
	decodeParameters,
	encodeFunctionSignature,
	encodeEventSignature,
	decodeLog,
} from 'web3-eth-abi';
import Contract, { ContractInitOptions } from 'web3-eth-contract';
import {
	create,
	privateKeyToAccount,
	signTransaction,
	recoverTransaction,
	hashMessage,
	sign,
	recover,
	encrypt,
	decrypt,
	Wallet,
} from 'web3-eth-accounts';
import { Address } from 'web3-utils';
import { ContractError } from './errors';

export class Web3 extends Web3Context<EthExecutionAPI> {
	public eth: Eth & {
		Iban: typeof Iban;
		ens: ENS;
		Contract: new <Abi extends ContractAbi>(
			jsonInterface: Abi,
			address?: Address,
			options?: ContractInitOptions,
		) => Contract<Abi>;
		abi: {
			encodeEventSignature: typeof encodeFunctionSignature;
			encodeFunctionCall: typeof encodeFunctionCall;
			encodeFunctionSignature: typeof encodeFunctionSignature;
			encodeParameter: typeof encodeParameter;
			encodeParameters: typeof encodeParameters;
			decodeParameter: typeof decodeParameter;
			decodeParameters: typeof decodeParameters;
			decodeLog: typeof decodeLog;
		};
		accounts: {
			create: typeof create;
			privateKeyToAccount: typeof privateKeyToAccount;
			signTransaction: typeof signTransaction;
			recoverTransaction: typeof recoverTransaction;
			hashMessage: typeof hashMessage;
			sign: typeof sign;
			recover: typeof recover;
			encrypt: typeof encrypt;
			decrypt: typeof decrypt;
		};
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected readonly _contracts: Contract<any>[];

	public constructor(provider: SupportedProviders<EthExecutionAPI>) {
		const accountProvider = {
			create,
			privateKeyToAccount,
			decrypt: async (
				keystore: string,
				password: string,
				options?: Record<string, unknown>,
			) => decrypt(keystore, password, (options?.nonStrict as boolean) ?? true),
		};

		const wallet = new Wallet(accountProvider);

		super({ provider, wallet, accountProvider });

		this._contracts = [];

		// Have to use local alias to initiate contract context
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		const eth = self.use(Eth);

		function ContractBuilder<Abi extends ContractAbi>(
			this: typeof ContractBuilder,
			jsonInterface: Abi,
			address?: Address,
			options?: ContractInitOptions,
		) {
			if (!(this instanceof ContractBuilder)) {
				throw new ContractError('Please use the "new" keyword to instantiate a contract.');
			}

			const contract = self.use(Contract, jsonInterface, address, options);

			self._contracts.push(contract);

			return contract;
		}

		ContractBuilder.setProvider = (_provider: SupportedProviders<EthExecutionAPI>) => {
			for (const contract of self._contracts) {
				contract.provider = _provider;
			}
		};

		// Eth Module
		this.eth = Object.assign(eth, {
			// ENS module
			ens: self.use(ENS, registryAddresses.main), // registry address defaults to main network

			// Iban helpers
			Iban,

			// Contract helper and module
			Contract: ContractBuilder as unknown as new <Abi extends ContractAbi>(
				jsonInterface: Abi,
				address?: Address,
				options?: ContractInitOptions,
			) => Contract<Abi>,

			// ABI Helpers
			abi: {
				encodeEventSignature,
				encodeFunctionCall,
				encodeFunctionSignature,
				encodeParameter,
				encodeParameters,
				decodeParameter,
				decodeParameters,
				decodeLog,
			},

			// Accounts helper
			accounts: {
				create,
				privateKeyToAccount,
				signTransaction,
				recoverTransaction,
				hashMessage,
				sign,
				recover,
				encrypt,
				decrypt,
				wallet,
			},
		});
	}
}

export default Web3;
