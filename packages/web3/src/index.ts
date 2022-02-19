import { EthExecutionAPI } from 'web3-common';
import { SupportedProviders, Web3Context } from 'web3-core';
import Web3Eth from 'web3-eth';

export class Web3 extends Web3Context<EthExecutionAPI> {
	public eth: Web3Eth;

	public constructor(provider: SupportedProviders<EthExecutionAPI> | string) {
		super(provider);

		this.eth = this.use(Web3Eth);
	}
}

export default Web3;
