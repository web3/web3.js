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

import { OperationTimeoutError } from 'web3-errors';

export const promiseTimeout = async <T = void>(ms: number, message: string): Promise<T> =>
	new Promise((_, reject) => {
		const id = setTimeout(() => {
			clearTimeout(id);
			reject(new OperationTimeoutError(message ?? `Timed out in ${ms}ms.`));
		}, ms);
	});

export class DeferredPromise<T> implements Promise<T> {
	// public tag to treat object as promise by different libs
	public [Symbol.toStringTag]: 'Promise';

	private readonly _promise: Promise<T>;
	private _resolve!: (value: T | PromiseLike<T>) => void;
	private _reject!: (reason?: unknown) => void;
	private _state: 'pending' | 'fulfilled' | 'rejected' = 'pending';

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
		if (eagerStart) {
			this._promise = Promise.race([
				new Promise<T>((resolve, reject) => {
					this._resolve = resolve;
					this._reject = reject;
				}),
				promiseTimeout(timeout, timeoutMessage),
			]) as Promise<T>;
		} else {
			this._promise = new Promise<T>((resolve, reject) => {
				this._resolve = resolve;
				this._reject = reject;
			});
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
		this._state = 'fulfilled';
		this._resolve(value);
	}

	public reject(reason?: unknown): void {
		this._state = 'rejected';
		this._reject(reason);
	}
}
