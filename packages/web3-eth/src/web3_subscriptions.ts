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
/* eslint-disable-next-line max-classes-per-file */
import { format } from 'web3-utils';

import {
	SyncOutput,
	Address,
	BlockNumberOrTag,
	HexString,
	Topic,
	BlockHeaderOutput,
	LogsOutput,
} from 'web3-types';
import { Web3Subscription } from 'web3-core';
import { blockHeaderSchema, logSchema, syncSchema } from './schemas';

type CommonSubscriptionEvents = {
	error: Error;
	connected: number;
};

export class LogsSubscription extends Web3Subscription<
	CommonSubscriptionEvents & {
		data: LogsOutput;
	},
	{
		readonly fromBlock?: BlockNumberOrTag;
		readonly address?: Address | Address[];
		readonly topics?: Topic[];
	}
> {
	protected _buildSubscriptionParams() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return ['logs', this.args] as ['logs', any];
	}

	public _processSubscriptionResult(data: LogsOutput) {
		this.emit('data', format(logSchema, data, super.returnFormat));
	}

	public _processSubscriptionError(error: Error) {
		this.emit('error', error);
	}
}

export class NewPendingTransactionsSubscription extends Web3Subscription<
	CommonSubscriptionEvents & {
		data: HexString;
	}
> {
	// eslint-disable-next-line
	protected _buildSubscriptionParams() {
		return ['newPendingTransactions'] as ['newPendingTransactions'];
	}

	protected _processSubscriptionResult(data: string) {
		this.emit('data', format({ eth: 'string' }, data, super.returnFormat));
	}

	protected _processSubscriptionError(error: Error) {
		this.emit('error', error);
	}
}

export class NewHeadsSubscription extends Web3Subscription<
	CommonSubscriptionEvents & {
		data: BlockHeaderOutput;
	}
> {
	// eslint-disable-next-line
	protected _buildSubscriptionParams() {
		return ['newHeads'] as ['newHeads'];
	}

	protected _processSubscriptionResult(data: BlockHeaderOutput) {
		this.emit('data', format(blockHeaderSchema, data, super.returnFormat));
	}

	protected _processSubscriptionError(error: Error) {
		this.emit('error', error);
	}
}

export class SyncingSubscription extends Web3Subscription<
	CommonSubscriptionEvents & {
		data: SyncOutput;
		changed: boolean;
	}
> {
	// eslint-disable-next-line
	protected _buildSubscriptionParams() {
		return ['syncing'] as ['syncing'];
	}

	protected _processSubscriptionResult(
		data:
			| {
					syncing: boolean;
					status: SyncOutput;
			  }
			| boolean,
	) {
		if (typeof data === 'boolean') {
			this.emit('changed', data);
		} else {
			const mappedData: SyncOutput = Object.fromEntries(
				Object.entries(data.status).map(([key, value]) => [
					key.charAt(0).toLowerCase() + key.substring(1),
					value,
				]),
			) as SyncOutput;

			this.emit('changed', data.syncing);
			this.emit('data', format(syncSchema, mappedData, super.returnFormat));
		}
	}

	protected _processSubscriptionError(error: Error) {
		this.emit('error', error);
	}
}
