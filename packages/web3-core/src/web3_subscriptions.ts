// eslint-disable-next-line max-classes-per-file
import {
	BlockOutput,
	SyncOutput,
	Web3BaseProvider,
	Web3EventEmitter,
	Web3EventMap,
	EthExecutionAPI,
} from 'web3-common';
import { HexString } from 'web3-utils';
import { Web3RequestManager } from './web3_request_manager';

type CommonSubscriptionEvents = {
	error: Error;
	connected: number;
};

interface SubscriptionMessageResponse {
	data: {
		method: string;
		params: { result: unknown };
		subscription: string;
	};
}

export abstract class Web3Subscription<
	EventMap extends Web3EventMap = Record<string, unknown>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	ArgsType = any,
> extends Web3EventEmitter<EventMap> {
	private readonly _requestManager: Web3RequestManager;
	private readonly _lastBlock?: BlockOutput;
	private _id?: HexString;
	private _messageListener?: (e: Error | null, data?: SubscriptionMessageResponse) => void;

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
		const result = await this._requestManager.send({
			method: 'eth_subscribe',
			params: this._buildSubscriptionParams(),
		});
		this._id = result;

		const messageListener = (_: Error | null, data?: SubscriptionMessageResponse) => {
			if (data?.data.method === 'eth_subscription' && data?.data.subscription === this._id) {
				this._processSubscriptionResult(data?.data.params.result);
			}
		};

		(this._requestManager.provider as Web3BaseProvider).on<{
			method: string;
			params: { result: unknown };
			subscription: string;
		}>('message', messageListener);

		this._messageListener = messageListener;
	}

	public async resubscribe() {
		await this.unsubscribe();
		await this.subscribe();
	}

	public async unsubscribe() {
		if (!this.id) {
			return;
		}

		await this._requestManager.send({
			method: 'eth_unsubscribe',
			params: [this.id],
		});

		this._id = undefined;
		(this._requestManager.provider as Web3BaseProvider).removeListener(
			'message',
			this._messageListener as never,
		);
	}

	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
	protected _processSubscriptionResult(_data: unknown) {
		// Do nothing - This should be overridden in subclass.
	}

	// eslint-disable-next-line class-methods-use-this
	protected _buildSubscriptionParams(): Parameters<EthExecutionAPI['eth_subscribe']> {
		// This should be overridden in the subclass
		throw new Error('Implement in the child class');
	}
}

export type Web3SubscriptionConstructor<T extends Web3Subscription> = new (
	// We accept any type of arguments here and don't deal with this type internally
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	args: any,
	options: { requestManager: Web3RequestManager },
) => T;

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
> {}

// TODO: This class to be moved `web3-eth` package.
export class PendingTransactionsSubscription extends Web3Subscription<
	CommonSubscriptionEvents & {
		data: HexString;
	}
> {}

// TODO: This class to be moved `web3-eth` package.
export class NewBlockHeadersSubscription extends Web3Subscription<
	CommonSubscriptionEvents & {
		data: BlockOutput;
	}
> {}

// TODO: This class to be moved `web3-eth` package.
export class SyncingSubscription extends Web3Subscription<
	CommonSubscriptionEvents & {
		data: SyncOutput;
		changed: boolean;
	}
> {}
