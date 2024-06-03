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

import { Web3DeferredPromise } from '../../src/web3_deferred_promise';

describe('Web3DeferredPromise', () => {
	describe('getState Web3DeferredPromise', () => {
		it('%s', () => {
			const promise = new Web3DeferredPromise();
			expect(promise.state).toBe('pending');
		});
	});
	describe('Web3DeferredPromise resolves promise', () => {
		it('%s', () => {
			const promise = new Web3DeferredPromise();
			promise.resolve('mockValue');
			expect(promise.state).toBe('fulfilled');
		});
	});
	describe('Web3DeferredPromise reject promise', () => {
		it('%s', async () => {
			const promise = new Web3DeferredPromise();
			promise.reject(new Error('fail'));
			// eslint-disable-next-line jest/no-conditional-expect
			await promise.catch(val => expect(val).toEqual(new Error('fail')));
			expect(promise.state).toBe('rejected');
		});
	});

	describe('Web3DeferredPromise timeout', () => {
		it('%s', async () => {
			const promise = new Web3DeferredPromise({
				timeout: 100,
				eagerStart: true,
				timeoutMessage: 'DeferredPromise timed out',
			});
			// eslint-disable-next-line jest/no-conditional-expect
			await promise.catch(val => expect(val).toEqual(new Error('DeferredPromise timed out')));
			expect(promise.state).toBe('rejected');
		});
	});

	describe('Web3DeferredPromise finally', () => {
		it('should execute the callback when the promise is settled', async () => {
			const promise = new Web3DeferredPromise<number>();
			let callbackExecuted = false;
			promise.resolve(1);
			await promise.finally(() => {
				callbackExecuted = true;
			});

			expect(callbackExecuted).toBe(true);
		});
	});
});
