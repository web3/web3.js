export class DeferredPromise<T> {
	public realPromise: Promise<T>;

	private _resolveFunction!: (value: T | PromiseLike<T>) => void;
	private _rejectFunction!: (reason?: unknown) => void;

	private _fate: 'resolved' | 'unresolved';

	public constructor() {
		this._fate = 'unresolved';

		this.realPromise = new Promise((resolve, reject) => {
			this._resolveFunction = resolve;
			this._rejectFunction = reject;
		});
	}

	public resolve(value: T | PromiseLike<T>) {
		if (this._fate === 'resolved') {
			throw new Error('Deferred promise cannot be resolved twice');
		}

		this._fate = 'resolved';
		this._resolveFunction(value);
	}

	public reject(reason: unknown) {
		if (this._fate === 'resolved') {
			throw new Error('Deferred promise cannot be resolved twice');
		}

		this._fate = 'resolved';
		this._rejectFunction(reason);
	}
}
