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

	public constructor(provider: SupportedProviders<EthExecutionAPI>) {
		super({ provider });

		// Have to use local alias to initiate contract context
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		const eth = self.use(Eth);

		// Eth Module
		this.eth = Object.assign(eth, {
			// ENS module
			ens: self.use(ENS, registryAddresses.main), // registry address defaults to main network

			// Iban helpers
			Iban,

			// Contract helper and module
			Contract: function ContractBuilder<Abi extends ContractAbi>(
				this: typeof ContractBuilder,
				jsonInterface: Abi,
				address?: Address,
				options?: ContractInitOptions,
			) {
				if (!(this instanceof ContractBuilder)) {
					throw new ContractError(
						'Please use the "new" keyword to instantiate a contract.',
					);
				}

				return self.use(Contract, jsonInterface, address, options);
			} as unknown as new <Abi extends ContractAbi>(
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
			},
		});
	}
}

export default Web3;
