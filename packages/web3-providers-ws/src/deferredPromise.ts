export class DeferredPromise<T> {
	public realPromise: Promise<T>;

	private resolveFunction!: (value: T | PromiseLike<T>) => void;
	private rejectFunction!: (reason?: unknown) => void;

	private fate: 'resolved' | 'unresolved';

	public constructor() {
		this.fate = 'unresolved';

		this.realPromise = new Promise((resolve, reject) => {
			this.resolveFunction = resolve;
			this.rejectFunction = reject;
		});
	}

	public resolve(value: T | PromiseLike<T>) {
		if (this.fate === 'resolved') {
			throw new Error('Deferred promise cannot be resolved twice');
		}

		this.fate = 'resolved';
		this.resolveFunction(value);
	}

	public reject(reason: unknown) {
		if (this.fate === 'resolved') {
			throw new Error('Deferred promise cannot be resolved twice');
		}

		this.fate = 'resolved';
		this.rejectFunction(reason);
	}
}
