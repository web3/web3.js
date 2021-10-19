// eslint-disable-next-line max-classes-per-file
import { BlockOutput, SyncOutput, Web3EventEmitter, Web3EventMap } from 'web3-common';
import { HexString } from 'web3-utils';
import { Web3RequestManager } from './web3_request_manager';

type CommonSubscriptionEvents = {
	error: Error;
	connected: number;
};

export abstract class Web3Subscription<
	EventMap extends Web3EventMap,
	ArgsType,
> extends Web3EventEmitter<EventMap> {
	private readonly _requestManager: Web3RequestManager;
	private readonly _lastBlock?: BlockOutput;
	private _id?: HexString;

	public constructor(
		public readonly args: ArgsType,
		options: { requestManager: Web3RequestManager },
	) {
		super();
		this._requestManager = options.requestManager;
	}

	public get id() {
		return this._id;
	}

	public get lastBlock() {
		return this._lastBlock;
	}

	public async subscribe() {
		const result = await this._requestManager.send<string>({
			method: 'eth_subscribe',
			params: this.buildSubscriptionParams(),
		});
		this._id = result;
	}

	public async resubscribe() {
		await this.unsubscribe();
		await this.subscribe();
	}

	public async unsubscribe() {
		await this._requestManager.send<string>({
			method: 'eth_unsubscribe',
			params: [this.id],
		});

		this._id = undefined;
	}

	public abstract buildSubscriptionParams(): unknown;
}

export type Web3SubscriptionConstructor<
	T extends Web3Subscription<{}, unknown>,
	A = unknown,
> = new (args: A, options: { requestManager: Web3RequestManager }) => T;

// TODO: This class to be moved `web3-eth` package.
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
> {
	// eslint-disable-next-line class-methods-use-this
	public buildSubscriptionParams() {
		return {};
	}
}

// TODO: This class to be moved `web3-eth` package.
export class PendingTransactionsSubscription extends Web3Subscription<
	CommonSubscriptionEvents & {
		data: HexString;
	},
	null
> {
	// eslint-disable-next-line class-methods-use-this
	public buildSubscriptionParams() {
		return {};
	}
}

// TODO: This class to be moved `web3-eth` package.
export class NewBlockHeadersSubscription extends Web3Subscription<
	CommonSubscriptionEvents & {
		data: BlockOutput;
	},
	null
> {
	// eslint-disable-next-line class-methods-use-this
	public buildSubscriptionParams() {
		return {};
	}
}

// TODO: This class to be moved `web3-eth` package.
export class SyncingSubscription extends Web3Subscription<
	CommonSubscriptionEvents & {
		data: SyncOutput;
		changed: boolean;
	},
	null
> {
	// eslint-disable-next-line class-methods-use-this
	public buildSubscriptionParams() {
		return {};
	}
}
