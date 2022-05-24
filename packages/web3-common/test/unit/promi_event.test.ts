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

import { PromiEvent } from '../../src/promi_event';

describe('PromiEvent', () => {
	it('should initialize and resolve promise', async () => {
		const p = new PromiEvent(resolve => {
			resolve('Resolved Value');
		});

		await expect(p).resolves.toBe('Resolved Value');
	});

	it('should initialize and reject promise', async () => {
		const p = new PromiEvent((_, reject) => {
			reject(new Error('My Error'));
		});

		await expect(p).rejects.toThrow('My Error');
	});

	it('should initialize and emit event', async () => {
		return new Promise(done => {
			const p = new PromiEvent<string, { data: string }>(resolve => {
				resolve('resolved value');
			});

			p.on('data', data => {
				expect(data).toBe('resolved value');
				done(null);
			});

			p.then(data => {
				p.emit('data', data);
			}).catch(e => {
				throw e;
			});
		});
	});

	it('should initialize and emit later', async () => {
		return new Promise(done => {
			const func = () => {
				const p = new PromiEvent<string, { data: string }>(resolve => {
					resolve('resolved value');
				});

				setImmediate(() => {
					p.emit('data', 'emitted data');
				});

				return p;
			};

			const p = func();

			p.on('data', data => {
				expect(data).toBe('emitted data');
				done(null);
			});
		});
	});
});
