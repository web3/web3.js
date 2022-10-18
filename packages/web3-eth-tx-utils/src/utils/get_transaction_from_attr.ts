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
import { Web3Context } from 'web3-core';
import { InvalidTransactionWithSender, LocalWalletNotAvailableError } from 'web3-errors';
import { privateKeyToAddress } from 'web3-eth-accounts';
import {
	EthExecutionAPI,
	HexString,
	Transaction,
	TransactionWithLocalWalletIndex,
} from 'web3-types';
import { FMT_BYTES, FMT_NUMBER, format } from 'web3-utils';
import { isAddress, isNullish, isNumber } from 'web3-validator';

export const getTransactionFromAttr = (
	web3Context: Web3Context<EthExecutionAPI>,
	transaction?: Transaction | TransactionWithLocalWalletIndex,
	privateKey?: HexString | Buffer,
) => {
	if (transaction?.from !== undefined) {
		if (typeof transaction.from === 'string' && isAddress(transaction.from)) {
			return transaction.from;
		}
		if (isNumber(transaction.from)) {
			if (web3Context.wallet) {
				const account = web3Context.wallet.get(
					format({ eth: 'uint' }, transaction.from, {
						number: FMT_NUMBER.NUMBER,
						bytes: FMT_BYTES.HEX,
					}),
				);

				if (!isNullish(account)) {
					return account.address;
				}

				throw new LocalWalletNotAvailableError();
			}
			throw new LocalWalletNotAvailableError();
		} else {
			throw new InvalidTransactionWithSender(transaction.from);
		}
	}
	if (!isNullish(privateKey)) return privateKeyToAddress(privateKey);
	if (!isNullish(web3Context.defaultAccount)) return web3Context.defaultAccount;

	return undefined;
};
