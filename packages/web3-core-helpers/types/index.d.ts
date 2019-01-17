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
/**
 * @file index.d.ts
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */
import {AbstractWeb3Module, Log, Transaction, TransactionReceipt} from 'web3-core';

export interface formatters {
    outputBigNumberFormatter(number: number): number;
    inputSignFormatter(data: string): string;
    inputAddressFormatter(address: string): string;
    isPredefinedBlockNumber(blockNumber: string): boolean;
    inputDefaultBlockNumberFormatter(blockNumber: string, moduleInstance: AbstractWeb3Module): string;
    inputBlockNumberFormatter(blockNumber: string | number): string | number;
    outputBlockFormatter(block: Object): Object; // TODO: Create Block interface
    txInputFormatter(txObject: Transaction): Transaction;
    inputCallFormatter(txObject: Transaction): Transaction;
    inputTransactionFormatter(txObject: Transaction): Transaction;
    outputTransactionFormatter(TransactionReceipt: string): TransactionReceipt;
    outputTransactionReceiptFormatter(TransactionReceipt: string): TransactionReceipt;
    inputLogFormatter(log: Log): Log;
    outputLogFormatter(log: Log): Log;
    inputPostFormatter(post: Object): Object; // TODO: Create Post interface
    outputPostFormatter(post: Object): Object; // TODO: Create Post interface
    outputSyncingFormatter(result: Object): Object; // TODO: Create SyncLog interface
}
