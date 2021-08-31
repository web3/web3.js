import EventEmitter from 'events';
import {
    Eip1193Provider,
    ProviderEventListener,
    Eth1RequestArguments,
    Web3ProviderEvents,
} from 'web3-core-types/src/types';
import Web3LoggerVersion from 'web3-core-logger/src/_version';

import Web3ProvidersEip1193 from '../../src/index';
import Version from '../../src/_version';

describe('constructs a Web3ProvidersEip1193 instance with expected properties', () => {
    let eip1193Provider: Eip1193Provider;
    let web3ProvidersEip1193: Web3ProvidersEip1193;

    beforeAll(() => {
        eip1193Provider = {
            request: async (args: Eth1RequestArguments) => {
                return {
                    id: 1,
                    jsonrpc: '2.0',
                    result: [],
                };
            },
            on: (
                web3ProviderEvents: Web3ProviderEvents,
                listener: ProviderEventListener
            ) => eip1193Provider,
        };

        web3ProvidersEip1193 = new Web3ProvidersEip1193(eip1193Provider);
    });

    it('Should update web3Client with valid provider', async () => {
        const expectedResponse = {
            id: 42,
            jsonrpc: '2.0',
            result: [],
        };
        web3ProvidersEip1193.setWeb3Client({
            request: async (args: Eth1RequestArguments) => {
                return expectedResponse;
            },
            on: (
                web3ProviderEvents: Web3ProviderEvents,
                listener: ProviderEventListener
            ) => eip1193Provider,
        });

        const response = await web3ProvidersEip1193.request({
            method: 'foo',
        });
        expect(response).toBe(expectedResponse);
    });

    it('should fail with invalid client error', () => {
        expect(() => {
            // @ts-ignore - Ignore invalid type
            web3ProvidersEip1193.setWeb3Client({});
        }).toThrowError(
            `{"loggerVersion":"${Web3LoggerVersion}","packageName":"web3-providers-eip1193","packageVersion":"${Version}","name":"invalidClient","msg":"Provided web3Client is an invalid EIP-1193 client","params":{"web3Client":{}}}`
        );
    });

    it('should set event listeners', () => {
        class TestEip1193Provider extends EventEmitter {
            constructor() {
                super();
            }

            async request(args: Eth1RequestArguments) {
                return {
                    id: 1,
                    jsonrpc: '2.0',
                    result: [],
                };
            }

            on(
                web3ProviderEvents: Web3ProviderEvents,
                listener: ProviderEventListener
            ) {
                return super.on(web3ProviderEvents, listener);
            }

            emit(event: string | symbol, ...args: any[]): boolean {
                return super.emit(event, args);
            }
        }

        const testEip1193Provider = new TestEip1193Provider();
        const web3ProvidersEip1193_2 = new Web3ProvidersEip1193(
            testEip1193Provider
        );

        for (const web3ProviderEvent in Web3ProviderEvents) {
            // @ts-ignore TSC doesn't seem to like looping over enum
            const providerEventName = Web3ProviderEvents[web3ProviderEvent];

            web3ProvidersEip1193_2.on(providerEventName, (eventName: any) => {
                expect(eventName).toStrictEqual([providerEventName]);
            });

            testEip1193Provider.emit(providerEventName, providerEventName);
        }
    });
});
