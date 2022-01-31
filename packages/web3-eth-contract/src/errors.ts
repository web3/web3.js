import { Web3Error, ERR_CONTRACT } from 'web3-common';

export class Web3ContractError extends Web3Error {
	public code = ERR_CONTRACT;
}
