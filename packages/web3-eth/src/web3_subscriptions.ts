// eslint-disable-next-line max-classes-per-file
import { BlockOutput, SyncOutput } from 'web3-common';
import { HexString } from 'web3-utils';
import { Web3Subscription } from 'web3-core';

type CommonSubscriptionEvents = {
	error: Error;
	connected: number;
};

export class LogsSubscription extends Web3Subscription<
	CommonSubscriptionEvents & {
		data: { fromBlock: number; address: HexString | HexString[]; topics: (HexString | null)[] };
		changed: {
			fromBlock: number;
			address: HexString | HexString[];
			topics: (HexString | null)[];
			removed: true;
		};
	},
	{ address?: HexString; topics?: HexString[] }
> {}

export class NewPendingTransactionsSubscription extends Web3Subscription<
	CommonSubscriptionEvents & {
		data: HexString;
	}
> {}

export class NewHeadsSubscription extends Web3Subscription<
	CommonSubscriptionEvents & {
		data: BlockOutput;
	}
> {}

export class SyncingSubscription extends Web3Subscription<
	CommonSubscriptionEvents & {
		data: SyncOutput;
		changed: boolean;
	}
> {}
