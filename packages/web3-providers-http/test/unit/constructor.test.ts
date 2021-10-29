import { HttpProvider } from '../../src/index';
import { httpProviderOptions, validClients, invalidClients } from '../fixtures/test_data';

describe('HttpProvider', () => {
	it('should construct with expected methods', () => {
		const httpProvider = new HttpProvider('http://localhost:8545');

		expect(httpProvider.request).not.toBeUndefined();
		expect(httpProvider.getStatus).not.toBeUndefined();
		expect(httpProvider.supportsSubscriptions).not.toBeUndefined();
		expect(httpProvider.request).not.toBeUndefined();
		expect(httpProvider.on).not.toBeUndefined();
		expect(httpProvider.removeListener).not.toBeUndefined();
		expect(httpProvider.once).not.toBeUndefined();
		expect(httpProvider.removeAllListeners).not.toBeUndefined();
		expect(httpProvider.connect).not.toBeUndefined();
		expect(httpProvider.disconnect).not.toBeUndefined();
		expect(httpProvider.reset).not.toBeUndefined();
		expect(httpProvider.reconnect).not.toBeUndefined();
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
