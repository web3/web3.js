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

import { LogsInput } from 'web3-common';
import { Web3RequestManager, Web3Subscription } from 'web3-core';
import { AbiEventFragment, encodeEventSignature, jsonInterfaceMethodToString } from 'web3-eth-abi';
import { HexString } from 'web3-utils';
import { decodeEventABI } from './encoding';

export class LogsSubscription extends Web3Subscription<
	{
		error: Error;
		connected: number;
		data: ReturnType<typeof decodeEventABI>;
		changed: ReturnType<typeof decodeEventABI> & { removed: true };
	},
	{ address?: HexString; topics?: HexString[]; abi: AbiEventFragment }
> {
	public readonly address?: HexString;
	public readonly topics?: HexString[];
	public readonly abi: AbiEventFragment;

	public constructor(
		args: { address?: HexString; topics?: HexString[]; abi: AbiEventFragment },
		options: { requestManager: Web3RequestManager },
	) {
		super(args, options);

		this.address = args.address;
		this.topics = args.topics;
		this.abi = args.abi;
	}

	protected _buildSubscriptionParams() {
		return ['logs', { address: this.address, topics: this.topics }] as [
			'logs',
			{ address?: string; topics?: string[] },
		];
	}

	protected _processSubscriptionResult(data: LogsInput): void {
		const decoded = decodeEventABI(
			{ ...this.abi, signature: encodeEventSignature(jsonInterfaceMethodToString(this.abi)) },
			data,
		);
		this.emit('data', decoded);
	}
}
