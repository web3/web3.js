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

import HttpProvider from '../../src/index';
import { httpProviderOptions, validClients, invalidClients } from '../fixtures/test_data';

describe('HttpProvider', () => {
	it('should construct with expected methods', () => {
		const httpProvider = new HttpProvider('http://localhost:8545');

		expect(httpProvider.request).toBeDefined();
		expect(httpProvider.getStatus).toBeDefined();
		expect(httpProvider.supportsSubscriptions).toBeDefined();
		expect(httpProvider.request).toBeDefined();
		expect(httpProvider.on).toBeDefined();
		expect(httpProvider.removeListener).toBeDefined();
		expect(httpProvider.once).toBeDefined();
		expect(httpProvider.removeAllListeners).toBeDefined();
		expect(httpProvider.connect).toBeDefined();
		expect(httpProvider.disconnect).toBeDefined();
		expect(httpProvider.reset).toBeDefined();
		expect(httpProvider.reconnect).toBeDefined();
	});

	it('Allows for providerOptions to be passed upon instantiation', () => {
		expect(() => new HttpProvider('http://localhost:8545', httpProviderOptions)).not.toThrow();
	});

	for (const validClient of validClients) {
		it(`Instantiation with valid client - ${validClient}`, () => {
			expect(() => new HttpProvider(validClient)).not.toThrow();
		});
	}

	for (const invalidClient of invalidClients) {
		/* eslint-disable @typescript-eslint/restrict-template-expressions */
		it(`Instantiation with invalid client - ${invalidClient}`, () => {
			expect(
				() =>
					// @ts-expect-error - Purposefully passing invalid types to check validation
					new HttpProvider(invalidClient),
				/* eslint-disable @typescript-eslint/restrict-template-expressions */
			).toThrow(`Client URL "${invalidClient}" is invalid.`);
		});
	}
});
