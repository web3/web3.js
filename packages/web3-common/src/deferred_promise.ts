import { OperationTimeoutError } from './errors';

export class DeferredPromise<T> implements Promise<T> {
	public [Symbol.toStringTag]: 'Promise';

	private readonly _promise: Promise<T>;
	private _resolve!: (value: T | PromiseLike<T>) => void;
	private _reject!: (reason?: unknown) => void;
	private _state: 'pending' | 'fulfilled' | 'rejected' = 'pending';
	private readonly _timeoutId: NodeJS.Timeout;

	public constructor(timeout: number) {
		this._promise = new Promise<T>((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});

		this._timeoutId = setTimeout(this._checkTimeout.bind(this), timeout);
	}

	public get state(): 'pending' | 'fulfilled' | 'rejected' {
		return this._state;
	}

	public async then<TResult1, TResult2>(
		onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>,
		onrejected?: (reason: unknown) => TResult2 | PromiseLike<TResult2>,
	): Promise<TResult1 | TResult2> {
		return this._promise.then(onfulfilled, onrejected);
	}

	public async catch<TResult>(
		onrejected?: (reason: unknown) => TResult | PromiseLike<TResult>,
	): Promise<T | TResult> {
		return this._promise.catch(onrejected);
	}

	public async finally(onfinally?: (() => void) | null): Promise<T> {
		return this._promise.finally(onfinally);
	}

	public resolve(value: T | PromiseLike<T>): void {
		this._resolve(value);
		this._state = 'fulfilled';
		clearTimeout(this._timeoutId);
	}

	public reject(reason?: unknown): void {
		this._reject(reason);
		this._state = 'rejected';
		clearTimeout(this._timeoutId);
	}

	private _checkTimeout() {
		if (this._state === 'pending') {
			this.reject(new OperationTimeoutError('DeferredPromise timed out'));
		}
	}
}
