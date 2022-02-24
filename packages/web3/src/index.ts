import { EthExecutionAPI } from 'web3-common';
import { SupportedProviders, Web3Context } from 'web3-core';
import Web3Eth from 'web3-eth';
import Contract, { ContractInitOptions } from 'web3-eth-contract';
import { ContractAbi } from 'web3-eth-abi';
import { Address } from 'web3-utils';
import { ContractError } from './errors';

export class Web3 extends Web3Context<EthExecutionAPI> {
	public eth: Web3Eth & {
		Contract: new <Abi extends ContractAbi>(
			jsonInterface: Abi,
			address?: Address,
			options?: ContractInitOptions,
		) => Contract<Abi>;
	};

	public constructor(provider: SupportedProviders<EthExecutionAPI>) {
		super({ provider });

		// Have to use local alias to initiate contract context
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		this.eth = Object.assign(self.use(Web3Eth), {
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
		});
	}
}

export default Web3;
