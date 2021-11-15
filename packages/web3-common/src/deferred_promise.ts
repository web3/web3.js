import { OperationTimeoutError } from './errors';

export class DeferredPromise<T> implements Promise<T> {
	// public tag to treat object as promise by different libs
	public [Symbol.toStringTag]: 'Promise';

	private readonly _promise: Promise<T>;
	private _resolve!: (value: T | PromiseLike<T>) => void;
	private _reject!: (reason?: unknown) => void;
	private _state: 'pending' | 'fulfilled' | 'rejected' = 'pending';
	private _timeoutId?: NodeJS.Timeout;
	private readonly _timeoutInterval?: number;
	private readonly _timeoutMessage: string;

	public constructor(
		{
			timeout,
			eagerStart,
			timeoutMessage,
		}: { timeout: number; eagerStart: boolean; timeoutMessage: string } = {
			timeout: 0,
			eagerStart: false,
			timeoutMessage: 'DeferredPromise timed out',
		},
	) {
		this._promise = new Promise<T>((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});

		this._timeoutMessage = timeoutMessage;
		this._timeoutInterval = timeout;

		if (eagerStart) {
			this.startTimer();
		}
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onrejected?: (reason: any) => TResult | PromiseLike<TResult>,
	): Promise<T | TResult> {
		return this._promise.catch(onrejected);
	}

	public async finally(onfinally?: (() => void) | null): Promise<T> {
		return this._promise.finally(onfinally);
	}

	public resolve(value: T | PromiseLike<T>): void {
		this._resolve(value);
		this._state = 'fulfilled';
		this._clearTimeout();
	}

	public reject(reason?: unknown): void {
		this._reject(reason);
		this._state = 'rejected';
		this._clearTimeout();
	}

	public startTimer() {
		if (this._timeoutInterval && this._timeoutInterval > 0) {
			this._timeoutId = setTimeout(this._checkTimeout.bind(this), this._timeoutInterval);
		}
	}

	private _checkTimeout() {
		if (this._state === 'pending' && this._timeoutId) {
			this.reject(new OperationTimeoutError(this._timeoutMessage));
		}
	}

	private _clearTimeout() {
		if (this._timeoutId) {
			clearTimeout(this._timeoutId);
		}
	}
}
