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

export class formatters {
    static outputBigNumberFormatter(number: number): number;

    static inputSignFormatter(data: string): string;

    static inputAddressFormatter(address: string): string;

    static isPredefinedBlockNumber(blockNumber: string): boolean;

    static inputDefaultBlockNumberFormatter(
        blockNumber: string,
        moduleInstance: any
    ): string;

    static inputBlockNumberFormatter(
        blockNumber: string | number
    ): string | number;

    static outputBlockFormatter(block: object): object; // TODO: Create Block interface

    static txInputFormatter(txObject: object): object;

    static inputCallFormatter(txObject: object): object;

    static inputTransactionFormatter(txObject: object): object;

    static outputTransactionFormatter(receipt: object): object;

    static outputTransactionReceiptFormatter(receipt: object): object;

    static inputLogFormatter(log: object): object;

    static outputLogFormatter(log: object): object;

    static inputPostFormatter(post: object): object; // TODO: Create Post interface

    static outputPostFormatter(post: object): object; // TODO: Create Post interface

    static outputSyncingFormatter(result: object): object; // TODO: Create SyncLog interface
}
