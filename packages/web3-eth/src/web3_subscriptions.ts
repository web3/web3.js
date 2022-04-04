// eslint-disable-next-line max-classes-per-file
import { BlockOutput, SyncOutput } from 'web3-common';
import { HexString } from 'web3-utils';
import { Web3Subscription } from 'web3-core';

type CommonSubscriptionEvents = {
	error: Error;
	connected: number;
};

export type LogArguments = {
	fromBlock?: number;
	address?: HexString | HexString[];
	topics?: (HexString | null)[];
	cb?: (error: Error | null, data: any) => void;
};
export type LogParams = CommonSubscriptionEvents & {
	data: LogArguments;
	changed: {
		fromBlock: number;
		address: HexString | HexString[];
		topics: (HexString | null)[];
		removed: true;
	};
};

export class LogsSubscription extends Web3Subscription<CommonSubscriptionEvents & LogArguments> {
	protected _buildSubscriptionParams() {
		return ['logs', this.args] as ['logs', any];
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
}

export class NewHeadsSubscription extends Web3Subscription<
	CommonSubscriptionEvents & {
		data: BlockOutput;
	}
> {
	// eslint-disable-next-line
	protected _buildSubscriptionParams() {
		return ['newHeads'] as ['newHeads'];
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
}
