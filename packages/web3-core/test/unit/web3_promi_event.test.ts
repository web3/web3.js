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

import { Web3PromiEvent } from '../../src/web3_promi_event';

describe('Web3PromiEvent', () => {
	it('should initialize and resolve promise', async () => {
		const p = new Web3PromiEvent(resolve => {
			resolve('Resolved Value');
		});

		await expect(p).resolves.toBe('Resolved Value');
		expect(() => p.removeAllListeners()).not.toThrow();
	});

	it('should initialize and reject promise', async () => {
		const p = new Web3PromiEvent((_, reject) => {
			reject(new Error('My Error'));
		});

		await expect(p).rejects.toThrow('My Error');
	});

	it('should initialize and emit event', async () => {
		return new Promise(done => {
			const p = new Web3PromiEvent<string, { data: string }>(resolve => {
				resolve('resolved value');
			});

			p.on('data', data => {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(data).toBe('resolved value');
				done(undefined);
			})
				.then(data => {
					p.emit('data', data);
				})
				.catch(e => done(e));

			expect.assertions(1);
		});
	});

	it('should initialize and emit later', async () => {
		return new Promise(done => {
			const func = () => {
				const p = new Web3PromiEvent<string, { data: string }>(resolve => {
					resolve('resolved value');
				});

				setImmediate(() => {
					p.emit('data', 'emitted data');
				});

				return p;
			};

			const p = func();
			const eventFunc = (data: string) => {
				expect(data).toBe('emitted data');
				done(undefined);
				expect(() => p.off('data', eventFunc)).not.toThrow();
			};
			// eslint-disable-next-line no-void
			void p.on('data', eventFunc);
			expect(p.listenerCount('data')).toBe(1);
			expect(p.listeners('data')).toHaveLength(1);
			expect(p.eventNames()).toEqual(['data']);
		});
	});

	it('should return the promi-event object from "on" handler', async () => {
		const p = new Web3PromiEvent<string, { event1: string; event2: number }>(resolve => {
			resolve('resolved value');
		})
			.on('event1', data => {
				expect(data).toBe('string value');
			})
			.on('event2', data => {
				expect(data).toBe(3);
			});

		p.emit('event1', 'string value');
		p.emit('event2', 3);

		await expect(p).resolves.toBe('resolved value');
		expect.assertions(3);
	});

	it('should return the promi-event object from "once" handler', async () => {
		const p = new Web3PromiEvent<string, { event1: string; event2: number }>(resolve => {
			resolve('resolved value');
		})
			.once('event1', data => {
				expect(data).toBe('string value');
			})
			.once('event2', data => {
				expect(data).toBe(3);
			});

		p.emit('event1', 'string value');
		p.emit('event2', 3);

		await expect(p).resolves.toBe('resolved value');
		expect.assertions(3);
	});

	it('set and get maxListeners', () => {
		const p = new Web3PromiEvent<string, Record<string, never>>(resolve => {
			resolve('resolved value');
		});
		p.setMaxListenerWarningThreshold(3);

		expect(p.getMaxListeners()).toBe(3);
	});

	it('finally', async () => {
		const p = new Web3PromiEvent(resolve => {
			return resolve('reason');
		});

		const f = jest.fn();
		p.finally(f);
		await p;
		expect(f).toHaveBeenCalled();
	});
	it('catch', async () => {
		const f = jest.fn();
		const p = new Web3PromiEvent((_, reject) => {
			return reject(new Error('reason'));
		});

		p.catch(f);

		await expect(p).rejects.toThrow('reason');

		expect(f).toHaveBeenCalledWith(new Error('reason'));
	});
});
