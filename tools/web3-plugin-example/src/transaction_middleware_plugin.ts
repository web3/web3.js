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
import { Web3PluginBase } from 'web3-core';
// eslint-disable-next-line require-extensions/require-extensions
import { Web3Context } from './reexported_web3_context';
// eslint-disable-next-line require-extensions/require-extensions
import { Web3TransactionMiddleware } from './transaction_middleware';

// Sample Transaction middleware plugin
export class TransactionMiddlewarePlugin extends Web3PluginBase {
	public pluginNamespace = 'TransactionsPlugIn';
	public txMiddleware: Web3TransactionMiddleware;

	public constructor() {
		super();
		this.txMiddleware = new Web3TransactionMiddleware();
	}

	public link(parentContext: Web3Context): void {
		if (this.txMiddleware) {
			// Following can modify Web3-Eth and also Web3-Eth-Contract packages transactions

			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			(parentContext as any).Web3Eth.setTransactionMiddleware(this.txMiddleware);
		}

		super.link(parentContext);
	}
}
