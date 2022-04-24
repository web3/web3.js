import { Web3Error, ERR_CONTRACT, ReceiptInfo } from 'web3-common';

export class Web3ContractError extends Web3Error {
	public code = ERR_CONTRACT;
	public receipt?: ReceiptInfo;

	public constructor(message: string, receipt?: ReceiptInfo) {
		super(message);

		this.receipt = receipt;
	}
}
