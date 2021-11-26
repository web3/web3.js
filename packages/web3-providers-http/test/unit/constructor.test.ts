import { HttpProvider } from '../../src/index';
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
