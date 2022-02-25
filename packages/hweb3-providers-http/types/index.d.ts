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
 * @author Patryk Matyjasiak <patryk.matyjasiak@arianelabs.com>
 * @date 2022
 */

import { HttpProviderBase } from 'web3-core-helpers';
import { Client, Transaction } from '@hashgraph/sdk';
import { ITransactionResponse, ITransactionReceipt } from "@hashgraph/proto";

export class HttpProvider extends HttpProviderBase {
    client: Client;
    connected: boolean;

    constructor(client: Client);

    send(
        tx: Transaction,
        callback?: (
            error: Error | null,
            result: ITransactionResponse | undefined
        ) => void
    ): void;

    getReceipt(
        txReceipt: ITransactionResponse,
        callback?: (
            error: Error | null,
            result: ITransactionReceipt | undefined
        ) => void
    ): void;

    sign(
        data: string
    ): Uint8Array;

    signTransaction(
        tx: Transaction
    ): Uint8Array;

    disconnect(): boolean;
    supportsSubscriptions(): boolean;
}
