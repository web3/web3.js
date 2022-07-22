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

import { TransactionError } from 'web3-errors';
import { Bytes, Numbers, Transaction, TransactionReceipt } from 'web3-types';
import { DataFormat, ETH_DATA_FORMAT, FormatType } from 'web3-utils';

export type InternalTransaction = FormatType<Transaction, typeof ETH_DATA_FORMAT>;

export type SendTransactionEvents<ReturnFormat extends DataFormat> = {
	sending: FormatType<Transaction, typeof ETH_DATA_FORMAT>;
	sent: FormatType<Transaction, typeof ETH_DATA_FORMAT>;
	transactionHash: FormatType<Bytes, ReturnFormat>;
	receipt: FormatType<TransactionReceipt, ReturnFormat>;
	confirmation: {
		confirmations: FormatType<Numbers, ReturnFormat>;
		receipt: FormatType<TransactionReceipt, ReturnFormat>;
		latestBlockHash: FormatType<Bytes, ReturnFormat>;
	};
	error: TransactionError<FormatType<TransactionReceipt, ReturnFormat>>;
};

export type SendSignedTransactionEvents<ReturnFormat extends DataFormat> = {
	sending: FormatType<Bytes, typeof ETH_DATA_FORMAT>;
	sent: FormatType<Bytes, typeof ETH_DATA_FORMAT>;
	transactionHash: FormatType<Bytes, ReturnFormat>;
	receipt: FormatType<TransactionReceipt, ReturnFormat>;
	confirmation: {
		confirmations: FormatType<Numbers, ReturnFormat>;
		receipt: FormatType<TransactionReceipt, ReturnFormat>;
		latestBlockHash: FormatType<Bytes, ReturnFormat>;
	};
	error: TransactionError<FormatType<TransactionReceipt, ReturnFormat>>;
};

export interface SendTransactionOptions<ResolveType = TransactionReceipt> {
	ignoreGasPricing?: boolean;
	transactionResolver?: (receipt: TransactionReceipt) => ResolveType;
}

export interface SendSignedTransactionOptions<ResolveType = TransactionReceipt> {
	transactionResolver?: (receipt: TransactionReceipt) => ResolveType;
}
