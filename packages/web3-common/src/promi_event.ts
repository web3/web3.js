import { Web3EventEmitter, Web3EventMap } from './web3_event_emitter';

export type PromiseExecutor<T> = (
	resolve: (data: T) => void,
	reject: (reason: unknown) => void,
) => void;

export class PromiEvent<ResolveType, EventMap extends Web3EventMap>
	extends Web3EventEmitter<EventMap>
	implements Promise<ResolveType>
{
	private readonly _promise: Promise<ResolveType>;

	public constructor(executor: PromiseExecutor<ResolveType>) {
		super();
		this._promise = new Promise<ResolveType>(executor);
	}

	// public tag to treat object as promise by different libs
	public [Symbol.toStringTag]: 'Promise';

	public async then<TResult1 = ResolveType, TResult2 = never>(
		onfulfilled?: ((value: ResolveType) => TResult1 | PromiseLike<TResult1>) | null,
		onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
	): Promise<TResult1 | TResult2> {
		return this._promise.then(onfulfilled, onrejected);
	}

	public async catch<TResult = never>(
		onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
	): Promise<ResolveType | TResult> {
		return this._promise.catch(onrejected);
	}

	public async finally(onfinally?: (() => void) | null): Promise<ResolveType> {
		return this._promise.finally(onfinally);
	}
}
