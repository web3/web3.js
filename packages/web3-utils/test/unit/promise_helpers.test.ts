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

import { waitWithTimeout, rejectIfTimeout } from '../../src/promise_helpers';

describe('promise helpers', () => {
	describe('waitWithTimeout resolve', () => {
		it('%s', async () => {
			await waitWithTimeout(
				new Promise(resolve => {
					resolve('resolved');
				}),
				1000,
			).then(val => expect(val).toBe('resolved'));
		});
	});
	describe('waitWithTimeout timeout', () => {
		it('%s', async () => {
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
	});
	describe('rejectIfTimeout timeout', () => {
		it('%s', async () => {
			const [timerId, promise] = rejectIfTimeout(100, new Error('time out'));
			// eslint-disable-next-line jest/no-conditional-expect
			await promise.catch(value => expect(value).toEqual(new Error('time out')));
			clearTimeout(timerId);
		});
	});
});
