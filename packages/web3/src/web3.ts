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
import { EthExecutionAPI, ETH_DATA_FORMAT, format } from 'web3-common';
import { SupportedProviders, Web3Context } from 'web3-core';
import Web3Eth, { prepareTransactionForSigning, Transaction } from 'web3-eth';
import Iban from 'web3-eth-iban';
import Net from 'web3-net';
import { ENS, registryAddresses } from 'web3-eth-ens';
import Personal from 'web3-eth-personal';
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
import * as utils from 'web3-utils';
import { Address, Bytes } from 'web3-utils';
import { Web3EthInterface } from './types';
import packageJson from '../package.json';

export class Web3 extends Web3Context<EthExecutionAPI> {
	public static version = packageJson.version;
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
		const signTransactionWithState = async (transaction: Transaction, privateKey: Bytes) => {
			const tx = await prepareTransactionForSigning(transaction, this);

			const privateKeyBytes = format({ eth: 'bytes' }, privateKey, ETH_DATA_FORMAT);

			return signTransaction(tx, privateKeyBytes);
		};

		const privateKeyToAccountWithState = (privateKey: Buffer | string) => {
			const account = privateKeyToAccount(privateKey);

			return {
				...account,
				signTransaction: async (transaction: Transaction) =>
					signTransactionWithState(transaction, account.privateKey),
			};
		};

		const decryptWithState = async (
			keystore: string,
			password: string,
			options?: Record<string, unknown>,
		) => {
			const account = await decrypt(
				keystore,
				password,
				(options?.nonStrict as boolean) ?? true,
			);

			return {
				...account,
				signTransaction: async (transaction: Transaction) =>
					signTransactionWithState(transaction, account.privateKey),
			};
		};

		const createWithState = () => {
			const account = create();

			return {
				...account,
				signTransaction: async (transaction: Transaction) =>
					signTransactionWithState(transaction, account.privateKey),
			};
		};

		const accountProvider = {
			create: createWithState,
			privateKeyToAccount: privateKeyToAccountWithState,
			decrypt: decryptWithState,
		};

		const wallet = new Wallet(accountProvider);

		super({ provider, wallet, accountProvider });

		this.utils = utils;

		// Have to use local alias to initiate contract context
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		class ContractBuilder<Abi extends ContractAbi> extends Contract<Abi> {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			private static readonly _contracts: Contract<any>[] = [];

			public constructor(
				jsonInterface: Abi,
				address?: Address,
				options?: ContractInitOptions,
			) {
				super(jsonInterface, address, options, self.getContextObject());

				ContractBuilder._contracts.push(this);
			}

			public static setProvider(_provider: SupportedProviders<EthExecutionAPI>) {
				for (const contract of ContractBuilder._contracts) {
					contract.provider = _provider;
				}
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
				create: createWithState,
				privateKeyToAccount: privateKeyToAccountWithState,
				signTransaction: signTransactionWithState,
				recoverTransaction,
				hashMessage,
				sign,
				recover,
				encrypt,
				decrypt: decryptWithState,
				wallet,
			},
		});
	}
}

export default Web3;
