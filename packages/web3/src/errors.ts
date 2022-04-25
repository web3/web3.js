import { Web3Error, ERR_CONTRACT_INSTANCE_CREATION } from 'web3-common';

export class ContractError extends Web3Error {
	public code = ERR_CONTRACT_INSTANCE_CREATION;
}
