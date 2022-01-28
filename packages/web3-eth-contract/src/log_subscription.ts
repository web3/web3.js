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
