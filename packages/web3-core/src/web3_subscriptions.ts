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
import { DataFormat, DEFAULT_RETURN_FORMAT } from 'web3-utils';
import {
	HexString,
	BlockOutput,
	Web3BaseProvider,
	Web3APISpec,
	Web3APIParams,
	EthExecutionAPI,
	Log,
	JsonRpcNotification,
	JsonRpcSubscriptionResult,
} from 'web3-types';
import { jsonRpc } from 'web3-utils';
import { Web3EventEmitter, Web3EventMap } from './web3_event_emitter';

import { Web3RequestManager } from './web3_request_manager';

export abstract class Web3Subscription<
	EventMap extends Web3EventMap,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	ArgsType = any,
	API extends Web3APISpec = EthExecutionAPI,
> extends Web3EventEmitter<EventMap> {
	private readonly _requestManager: Web3RequestManager<API>;
	private readonly _lastBlock?: BlockOutput;
	private readonly _returnFormat: DataFormat;
	private _id?: HexString;
	private _messageListener?: (e: Error | undefined, data?: JsonRpcNotification<Log>) => void;

	public constructor(
		public readonly args: ArgsType,

		options: { requestManager: Web3RequestManager<API>; returnFormat?: DataFormat },
	) {
		super();
		this._requestManager = options.requestManager;
		this._returnFormat = options.returnFormat ?? (DEFAULT_RETURN_FORMAT as DataFormat);
	}

	public get id() {
		return this._id;
	}

	public get lastBlock() {
		return this._lastBlock;
	}

	public async subscribe() {
		this._id = await this._requestManager.send({
			method: 'eth_subscribe',
			params: this._buildSubscriptionParams(),
		});

		const messageListener = (
			err: Error | undefined,
			data?: JsonRpcSubscriptionResult | JsonRpcNotification<Log>,
		) => {
			if (data && jsonRpc.isResponseWithNotification(data)) {
				this._processSubscriptionResult(data?.params.result);
			}
			if (err) {
				this._processSubscriptionError(err);
			}
		};

		(this._requestManager.provider as Web3BaseProvider).on<Log>('message', messageListener);

		this._messageListener = messageListener;
	}
	protected get returnFormat() {
		return this._returnFormat;
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
			params: [this.id] as Web3APIParams<API, 'eth_unsubscribe'>,
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

	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
	protected _processSubscriptionError(_err: Error) {
		// Do nothing - This should be overridden in subclass.
	}

	// eslint-disable-next-line class-methods-use-this
	protected _buildSubscriptionParams(): Web3APIParams<API, 'eth_subscribe'> {
		// This should be overridden in the subclass
		throw new Error('Implement in the child class');
	}
}

export type Web3SubscriptionConstructor<
	API extends Web3APISpec,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	SubscriptionType extends Web3Subscription<any, any, API> = Web3Subscription<any, any, API>,
> = new (
	// We accept any type of arguments here and don't deal with this type internally
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	args: any,
	options: { requestManager: Web3RequestManager<API>; returnFormat?: DataFormat },
) => SubscriptionType;
