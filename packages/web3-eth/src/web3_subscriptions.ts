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

// eslint-disable-next-line max-classes-per-file
import {
	BlockHeaderOutput,
	LogsInput,
	LogsOutput,
	outputLogFormatter,
	outputSyncingFormatter,
	SyncInput,
	SyncOutput,
} from 'web3-common';
import { Address, BlockNumberOrTag, HexString, Topic } from 'web3-utils';
import { Web3Subscription } from 'web3-core';

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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public _processSubscriptionResult(data: LogsInput) {
		this.emit('data', outputLogFormatter(data));
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
		this.emit('data', data);
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
		this.emit('data', data);
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

	protected _processSubscriptionResult(data: SyncInput) {
		this.emit('data', outputSyncingFormatter(data));
	}

	protected _processSubscriptionError(error: Error) {
		this.emit('error', error);
	}
}
