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
export class Lock {
	private permits = 1;
	private readonly promiseResolverQueue: Array<(v: boolean) => void> = [];

	/**
	 * Returns a promise used to wait for a permit to become available. This method should be awaited on.
	 * @returns  A promise that gets resolved when execution is allowed to proceed.
	 */
	public async acquire(): Promise<boolean> {
		if (this.permits > 0) {
			this.permits -= 1;
			return Promise.resolve(true);
		}

		// If there is no permit available, we return a promise that resolves once the semaphore gets
		// signaled enough times that permits is equal to one.
		// eslint-disable-next-line no-promise-executor-return
		return new Promise<boolean>(resolver => this.promiseResolverQueue.push(resolver));
	}

	/**
	 * Increases the number of permits by one. If there are other functions waiting, one of them will
	 * continue to execute in a future iteration of the event loop.
	 */
	public release(): void {
		this.permits += 1;

		if (this.permits > 1 && this.promiseResolverQueue.length > 0) {
			// eslint-disable-next-line no-console
			console.warn('Lock.permits should never be > 0 when there is someone waiting.');
		} else if (this.permits === 1 && this.promiseResolverQueue.length > 0) {
			// If there is someone else waiting, immediately consume the permit that was released
			// at the beginning of this function and let the waiting function resume.
			this.permits -= 1;

			const nextResolver = this.promiseResolverQueue.shift();
			if (nextResolver) {
				nextResolver(true);
			}
		}
	}
}
