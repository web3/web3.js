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

import {
	waitWithTimeout,
	rejectIfTimeout,
	isPromise,
	pollTillDefined,
	rejectIfConditionAtInterval,
	pollTillDefinedAndReturnIntervalId,
} from '../../src/promise_helpers';

describe('promise helpers', () => {
	describe('isPromise', () => {
		it('detect Promise objects', () => {
			// eslint-disable-next-line  @typescript-eslint/no-empty-function
			expect(isPromise(new Promise(() => {}))).toBe(true);
		});
		it('detect Promise functions', () => {
			// eslint-disable-next-line  @typescript-eslint/no-empty-function
			const func = () => {};
			// eslint-disable-next-line  @typescript-eslint/no-empty-function
			func.then = () => {};
			expect(isPromise(func)).toBe(true);
		});
	});

	describe('waitWithTimeout', () => {
		it('resolve', async () => {
			await waitWithTimeout(
				new Promise(resolve => {
					resolve('resolved');
				}),
				1000,
			).then(val => expect(val).toBe('resolved'));
		});
		it('timeout', async () => {
			const asyncHelper = async () => {
				await new Promise(resolve => {
					setTimeout(() => {
						resolve('resolved');
					}, 200);
				});
			};
			await expect(waitWithTimeout(asyncHelper, 100, new Error('time out'))).rejects.toThrow(
				new Error('time out'),
			);
		});
		it('throws if result is an instance of Error', async () => {
			const dummyError = new Error('dummy error');
			const asyncHelper = async () => {
				return dummyError;
			};

			await expect(waitWithTimeout(asyncHelper(), 1000)).rejects.toThrow(dummyError);
		});
	});
	describe('rejectIfTimeout', () => {
		it('%s', async () => {
			const [timerId, promise] = rejectIfTimeout(100, new Error('value'));
			// eslint-disable-next-line jest/no-conditional-expect
			await promise.catch(value => expect(value).toEqual(new Error('value')));
			clearTimeout(timerId);
		});
	});

	describe('rejectIfTimeout throw', () => {
		it('%s', async () => {
			const dummyError = new Error('error');
			const asyncHelper = async () => {
				await new Promise((_, reject) => {
					reject(dummyError);
				});
			};
			await expect(waitWithTimeout(asyncHelper, 100, new Error('time out'))).rejects.toThrow(
				dummyError,
			);
		});
	});

	describe('pollTillDefined', () => {
		it('returns when immediately resolved', async () => {
			const asyncHelper = async () =>
				new Promise(resolve => {
					resolve('resolved');
				});
			await expect(pollTillDefined(asyncHelper, 100)).resolves.toBe('resolved');
		});
		it('returns if later resolved', async () => {
			let counter = 0;
			const asyncHelper = async () => {
				if (counter === 0) {
					counter += 1;
					return undefined;
				}
				return new Promise(resolve => {
					resolve('resolved');
				});
			};

			await expect(pollTillDefined(asyncHelper, 100)).resolves.toBe('resolved');
		});
		it('throws if later throws', async () => {
			const dummyError = new Error('error');
			let counter = 0;
			const asyncHelper = async () => {
				if (counter === 0) {
					counter += 1;
					return undefined;
				}
				return new Promise((_, reject) => {
					reject(dummyError);
				});
			};
			await expect(pollTillDefined(asyncHelper, 100)).rejects.toThrow(dummyError);
		});
	});

	describe('pollTillDefinedAndReturnIntervalId', () => {
		it('returns when immediately resolved', async () => {
			const asyncHelper = async () =>
				new Promise(resolve => {
					resolve('resolved');
				});
			const [promise] = pollTillDefinedAndReturnIntervalId(asyncHelper, 100);
			await expect(promise).resolves.toBe('resolved');
		});
		it('returns if later resolved', async () => {
			let counter = 0;
			const asyncHelper = async () => {
				if (counter === 0) {
					counter += 1;
					return undefined;
				}
				return new Promise(resolve => {
					resolve('resolved');
				});
			};
			const [promise] = pollTillDefinedAndReturnIntervalId(asyncHelper, 100);
			await expect(promise).resolves.toBe('resolved');
		});

		it('should return interval id if not resolved in specific time', async () => {
			let counter = 0;
			// eslint-disable-next-line @typescript-eslint/require-await
			const asyncHelper = async () => {
				if (counter <= 3000000) {
					counter += 1;
					return undefined;
				}
				return 'result';
			};

			const testError = new Error('Test P2 Error');

			const [neverResolvePromise, intervalId] = pollTillDefinedAndReturnIntervalId(
				asyncHelper,
				100,
			);
			const promiCheck = Promise.race([
				neverResolvePromise,
				rejectIfTimeout(500, testError)[1],
			]);

			await expect(promiCheck).rejects.toThrow(testError);
			expect(intervalId).toBeDefined();
			clearInterval(intervalId);
		});

		it('throws if later throws', async () => {
			const dummyError = new Error('error');
			let counter = 0;
			const asyncHelper = async () => {
				if (counter === 0) {
					counter += 1;
					return undefined;
				}
				return new Promise((_, reject) => {
					reject(dummyError);
				});
			};
			const [promise] = pollTillDefinedAndReturnIntervalId(asyncHelper, 100);
			await expect(promise).rejects.toThrow(dummyError);
		});
	});

	describe('rejectIfConditionAtInterval', () => {
		it('reject if later throws', async () => {
			const dummyError = new Error('error');
			let counter = 0;
			// eslint-disable-next-line @typescript-eslint/require-await
			const asyncHelper = async () => {
				if (counter === 0) {
					counter += 1;
					return undefined;
				}
				return dummyError;
			};
			const [intervalId, promiseToError] = rejectIfConditionAtInterval(asyncHelper, 100);
			await expect(promiseToError).rejects.toThrow(dummyError);

			clearInterval(intervalId);
		});
	});
});
