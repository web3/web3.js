import { Web3Error } from 'web3-utils';

export class ContractError extends Web3Error {
	public constructor(message: string) {
		super('ContractError', message);
	}
}
