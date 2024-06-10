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

import {
	BaseTransaction,
	TxValuesArray,
	AccessListEIP2930ValuesArray,
	FeeMarketEIP1559ValuesArray,
	JsonTx,
} from 'web3-eth-accounts';

export class CustomTransactionType extends BaseTransaction<unknown> {
	// eslint-disable-next-line class-methods-use-this
	public getUpfrontCost(): bigint {
		throw new Error('Method not implemented.');
	}
	// eslint-disable-next-line class-methods-use-this
	public raw(): TxValuesArray | AccessListEIP2930ValuesArray | FeeMarketEIP1559ValuesArray {
		throw new Error('Method not implemented.');
	}
	// eslint-disable-next-line class-methods-use-this
	public serialize(): Uint8Array {
		throw new Error('Method not implemented.');
	}
	public getMessageToSign(hashMessage: false): Uint8Array | Uint8Array[];
	public getMessageToSign(hashMessage?: true | undefined): Uint8Array;
	// eslint-disable-next-line class-methods-use-this
	public getMessageToSign(): Uint8Array | Uint8Array[] {
		throw new Error('Method not implemented.');
	}
	// eslint-disable-next-line class-methods-use-this
	public hash(): Uint8Array {
		throw new Error('Method not implemented.');
	}
	// eslint-disable-next-line class-methods-use-this
	public getMessageToVerifySignature(): Uint8Array {
		throw new Error('Method not implemented.');
	}
	// eslint-disable-next-line class-methods-use-this
	public getSenderPublicKey(): Uint8Array {
		throw new Error('Method not implemented.');
	}
	// eslint-disable-next-line class-methods-use-this
	public toJSON(): JsonTx {
		throw new Error('Method not implemented.');
	}
	// eslint-disable-next-line class-methods-use-this
	protected _processSignature(): unknown {
		throw new Error('Method not implemented.');
	}
	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, class-methods-use-this
	public errorStr(): string {
		throw new Error('Method not implemented.');
	}
	// eslint-disable-next-line class-methods-use-this
	protected _errorMsg(): string {
		throw new Error('Method not implemented.');
	}
}
