/* eslint-disable max-classes-per-file */

import { TransactionCall, TransactionWithSender } from 'web3-common';
import { Web3Error } from 'web3-utils';

export class InvalidTransactionWithSender extends Web3Error {
	public constructor(value: TransactionWithSender) {
		// TODO Discuss this naive approach to logging object
		// Does not account for non JSON properties
		super(JSON.stringify(value), 'invalid transaction with sender');
	}
}

export class InvalidTransactionCall extends Web3Error {
	public constructor(value: TransactionCall) {
		// TODO Discuss this naive approach to logging object
		// Does not account for non JSON properties
		super(JSON.stringify(value), 'invalid transaction call');
	}
}
