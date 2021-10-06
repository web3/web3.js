import { HttpProvider } from '../../src/index';
import { validClients, invalidClients } from '../fixtures/clientUrls';

describe('constructs a HttpProvider instance with expected methods', () => {
	it('should construct with expected methods', () => {
        const httpProvider = new HttpProvider('http://localhost:8545');

        expect(httpProvider.send).not.toBe(undefined);
        expect(httpProvider.getStatus).not.toBe(undefined);
        expect(httpProvider.supportsSubscriptions).not.toBe(undefined);
        expect(httpProvider.request).not.toBe(undefined);
        expect(httpProvider.on).not.toBe(undefined);
        expect(httpProvider.removeListener).not.toBe(undefined);
        expect(httpProvider.once).not.toBe(undefined);
        expect(httpProvider.removeAllListeners).not.toBe(undefined);
        expect(httpProvider.connect).not.toBe(undefined);
        expect(httpProvider.disconnect).not.toBe(undefined);
        expect(httpProvider.reset).not.toBe(undefined);
        expect(httpProvider.reconnect).not.toBe(undefined);
	});
});

describe('Allows for providerOptions to be passed upon instantiation', () => {
	it('should construct successfully', () => {
        const httpProviderOptions = {
            providerOptions: ({
                body: null,
                cache: 'force-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                integrity: 'foo',
                keepalive: true,
                method: 'GET',
                mode: 'same-origin',
                redirect: 'error',
                referrer: 'foo',
                referrerPolicy: 'same-origin',
                signal: null,
                window: null
            } as RequestInit)
        }

        new HttpProvider('http://localhost:8545', httpProviderOptions);
	});
});

describe('Instantiation with valid clients', () => {
    for (const validClient of validClients) {
        it(`should successfully construct instance - ${validClient}`, () => {
            new HttpProvider(validClient);
        });
    }
});

describe('Instantiation with invalid clients', () => {
    for (const invalidClient of invalidClients) {
        it(`should fail with InvalidClientError - ${invalidClient}`, () => {
            expect(() => {
                // @ts-ignore - Purposefully passing invalid types to check validation
                new HttpProvider(invalidClient);
            }).toThrowError(`Client URL "${invalidClient}" is invalid.`)
        });
    }
});
