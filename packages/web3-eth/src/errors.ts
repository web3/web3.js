/* eslint-disable max-classes-per-file */

import { Web3Error } from 'web3-utils';

export class InvalidTransactionWithSender extends Web3Error {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public constructor(value: any) {
		// TODO Discuss this naive approach to logging object
		// Does not account for non JSON properties
		super(JSON.stringify(value), 'invalid transaction with sender');
	}
}

export class InvalidTransactionCall extends Web3Error {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public constructor(value: any) {
		// TODO Discuss this naive approach to logging object
		// Does not account for non JSON properties
		super(JSON.stringify(value), 'invalid transaction call');
	}
}
