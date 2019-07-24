import * as Utils from 'web3-utils';
import {
    formatters
} from 'web3-core-helpers';
import LogSubscription from '../../../../src/subscriptions/eth/LogSubscription';
import AbstractWeb3Module from '../../../__mocks__/AbstractWeb3Module';
import GetPastLogsMethod from '../../../__mocks__/GetPastLogsMethod';
import SocketProvider from '../../../__mocks__/SocketProvider';

// Mocks
jest.mock('web3-core-helpers');

/**
 * LogSubscription test
 */
describe('LogSubscriptionTest', () => {
    let logSubscription, moduleInstanceMock, getPastLogsMethodMock, socketProviderMock;
    const logSubscriptionOptions = ['address', 'topics'];

    beforeEach(() => {
        moduleInstanceMock = new AbstractWeb3Module();
        socketProviderMock = new SocketProvider();
        getPastLogsMethodMock = new GetPastLogsMethod();
        getPastLogsMethodMock.execute = jest.fn();

        logSubscription = new LogSubscription({}, Utils, formatters, moduleInstanceMock, getPastLogsMethodMock);
    });

    it('constructor check', () => {
        expect(logSubscription.method).toEqual('logs');

        expect(logSubscription.type).toEqual('eth_subscribe');

        expect(logSubscription.options).toEqual({});

        expect(logSubscription.logSubscriptionOptions).toEqual(logSubscriptionOptions);

        expect(logSubscription.utils).toEqual(Utils);

        expect(logSubscription.moduleInstance).toEqual(moduleInstanceMock);

        expect(logSubscription.getPastLogsMethod).toEqual(getPastLogsMethodMock);
    });


    it('calls subscribe executes GetPastLogsMethod and calls the callback twice because of the past logs', (done) => {
        const filters = {
            fromBlock: 0,
            toBlock: 1
        };

        formatters.inputLogFormatter.mockReturnValueOnce({});

        formatters.outputLogFormatter.mockReturnValueOnce(0).mockReturnValueOnce('ITEM');

        getPastLogsMethodMock.execute.mockReturnValueOnce(Promise.resolve([0]));

        socketProviderMock.subscribe = jest.fn((type, method, parameters) => {
            expect(type).toEqual('eth_subscribe');

            expect(method).toEqual('logs');

            expect(parameters).toEqual([{}]);

            return Promise.resolve('MY_ID');
        });

        socketProviderMock.on = jest.fn((subscriptionId, callback) => {
            if (subscriptionId === 'MY_ID') {
                callback('SUBSCRIPTION_ITEM');
            }
        });

        moduleInstanceMock.currentProvider = socketProviderMock;

        let second = false;
        logSubscription.options.fromBlock = 0;
        logSubscription.options.toBlock = 1;

        const subscription = logSubscription.subscribe((error, response) => {
            let expectedResponse = 0;
            let expectedId = null;

            if (second) {
                expectedResponse = 'ITEM';
                expectedId = 'MY_ID';

                expect(logSubscription.options.toBlock).toBeUndefined();
                expect(logSubscription.options.fromBlock).toBeUndefined();
            } else {}

            expect(error).toEqual(false);

            expect(response).toEqual(expectedResponse);

            expect(formatters.inputLogFormatter).toHaveBeenCalledWith(filters);

            expect(getPastLogsMethodMock.parameters).toEqual([logSubscription.options]);

            expect(getPastLogsMethodMock.execute).toHaveBeenCalled();

            expect(logSubscription.id).toEqual(expectedId);

            if (second) {
                done();
            }

            second = true;
        });

        expect(subscription).toBeInstanceOf(LogSubscription);
    });

    it('reject any extra parameter not valid for subscriptions after getPastLogsMethod call', (done) => {
        const invalidOptionsForSubscriptions = {
            blockHash: '0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46',
            fromBlock: 0,
            toBlock: 10,
            address: '0x161F8f25fa8132C572b234a5e19730d579A470fa',
            topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7']
        }

        const expectedOptions = {
            address: '0x161F8f25fa8132C572b234a5e19730d579A470fa',
            topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7']
        }

        const optionsForLogs = logSubscription.rejectInvalidLogSubscriptions(invalidOptionsForSubscriptions)

        expect(optionsForLogs).toEqual(expectedOptions);
        done()
    });


    it('calling subscribe with ranges of blocks and blockHash should throws an error', (done) => {
        logSubscription.options = {
            blockHash: '0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46',
            fromBlock: 0,
            toBlock: 10,
            address: '0x161F8f25fa8132C572b234a5e19730d579A470fa',
            topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7']
        }
        const mockedResult = logSubscription.options;
        formatters.inputLogFormatter.mockReturnValueOnce(mockedResult);
        formatters.outputLogFormatter.mockReturnValueOnce('ITEM');

        socketProviderMock.subscribe = jest.fn((type, method, parameters) => {
            expect(type).toEqual('eth_subscribe');
            expect(method).toEqual('logs');
            expect(parameters).toEqual([logSubscription.options]);
            return Promise.resolve('MY_ID');
        });

        socketProviderMock.on = jest.fn((subscriptionId, callback) => {
            if (subscriptionId === 'MY_ID') {
                callback('SUBSCRIPTION_ITEM');
            }
        });

        moduleInstanceMock.currentProvider = socketProviderMock;
        const errorMessage = "Validation error: BlockHash is present in the filter criteria, then neither fromBlock or toBlock are allowed."
        const subscription = logSubscription.subscribe((error, response) => {
            expect(error).toEqual(new Error(errorMessage));
            expect(response).toEqual(null);
            done();
        });

        expect(subscription).toBeInstanceOf(LogSubscription);

    });

    it('calling subscribe with array of addresses aren\'t valid should throws an error', (done) => {
        const invalidAddresses = [
            '0x000000000000000000000000000000000000000X',
            '0x000000000000000000000000000000000000000Z'
        ]
        logSubscription.options.address = invalidAddresses
        formatters.outputLogFormatter.mockReturnValueOnce('ITEM');

        socketProviderMock.subscribe = jest.fn((type, method, parameters) => {
            expect(type).toEqual('eth_subscribe');
            expect(method).toEqual('logs');
            expect(parameters).toEqual([logSubscription.options]);
            return Promise.resolve('MY_ID');
        });

        socketProviderMock.on = jest.fn((subscriptionId, callback) => {
            if (subscriptionId === 'MY_ID') {
                callback('SUBSCRIPTION_ITEM');
            }
        });

        moduleInstanceMock.currentProvider = socketProviderMock;
        const errorMessage = `Validation error: Provided address ${invalidAddresses[0]} is invalid`
        const subscription = logSubscription.subscribe((error, response) => {
            expect(error).toEqual(new Error(errorMessage));
            expect(response).toEqual(null);
            done();
        });

        expect(subscription).toBeInstanceOf(LogSubscription);
    });


    it('calling subscribe with address invalid should throws an error', (done) => {
        const invalidAddress = "0x7b2e64486cef2670c8a123ba87ab36941bc7XXXX";
        logSubscription.options.address = invalidAddress
        formatters.outputLogFormatter.mockReturnValueOnce('ITEM');

        socketProviderMock.subscribe = jest.fn((type, method, parameters) => {
            expect(type).toEqual('eth_subscribe');
            expect(method).toEqual('logs');
            expect(parameters).toEqual([logSubscription.options]);
            return Promise.resolve('MY_ID');

        });

        socketProviderMock.on = jest.fn((subscriptionId, callback) => {
            if (subscriptionId === 'MY_ID') {
                callback('SUBSCRIPTION_ITEM');
            }
        });

        moduleInstanceMock.currentProvider = socketProviderMock;

        const errorMessage = `Validation error: Provided address ${invalidAddress} is invalid`
        const subscription = logSubscription.subscribe((error, response) => {
            expect(error).toEqual(new Error(errorMessage));
            expect(response).toEqual(null);
            done();
        });

        expect(subscription).toBeInstanceOf(LogSubscription);
    });


    it('should fail when calling subscribe with topics as string and not array', (done) => {
        formatters.outputLogFormatter.mockReturnValueOnce('ITEM');

        socketProviderMock.subscribe = jest.fn((type, method, parameters) => {
            expect(type).toEqual('eth_subscribe');
            expect(method).toEqual('logs');
            expect(parameters).toEqual([logSubscription.options]);
            return Promise.resolve('MY_ID');
        });

        socketProviderMock.on = jest.fn((subscriptionId, callback) => {
            if (subscriptionId === 'MY_ID') {
                callback('SUBSCRIPTION_ITEM');
            }
        });

        moduleInstanceMock.currentProvider = socketProviderMock;

        const topics = '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7'
        logSubscription.options = {
            topics
        }
        const subscription = logSubscription.subscribe((error, response) => {
            expect(error).toEqual(new Error('Validation error: topics need to be an array'));
            expect(response).toEqual(null);
            done();
        });

        expect(subscription).toBeInstanceOf(LogSubscription);
    });

    it('should fail when calling subscribe with topics not invalid', (done) => {
        formatters.outputLogFormatter.mockReturnValueOnce('ITEM');

        socketProviderMock.subscribe = jest.fn((type, method, parameters) => {
            expect(type).toEqual('eth_subscribe');
            expect(method).toEqual('logs');
            expect(parameters).toEqual([logSubscription.options]);
            return Promise.resolve('MY_ID');
        });

        socketProviderMock.on = jest.fn((subscriptionId, callback) => {
            if (subscriptionId === 'MY_ID') {
                callback('SUBSCRIPTION_ITEM');
            }
        });

        moduleInstanceMock.currentProvider = socketProviderMock;
        const invalidTopic = ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7XXX']
        logSubscription.options = {
            topics: invalidTopic
        }
        const errorMessage = `Validation error: Provided Topic ${invalidTopic} is invalid`
        const subscription = logSubscription.subscribe((error, response) => {
            expect(error).toEqual(new Error(errorMessage));
            expect(response).toEqual(null);
            done();
            done()
        });

        expect(subscription).toBeInstanceOf(LogSubscription);
    });

    it('calling subscribe with only toBlock filter parameter should throws an error', (done) => {
        formatters.inputLogFormatter.mockReturnValueOnce({});

        logSubscription.options.toBlock = 1;
        logSubscription.options.address = "0xb60e8dd61c5d32be8058bb8eb970870f07233155";

        formatters.outputLogFormatter.mockReturnValueOnce('ITEM');

        getPastLogsMethodMock.execute = jest.fn(() => {
            return Promise.resolve([0]);
        });

        socketProviderMock.subscribe = jest.fn((type, method, parameters) => {
            expect(type).toEqual('eth_subscribe');
            expect(method).toEqual('logs');
            expect(parameters).toEqual([logSubscription.options]);
            return Promise.resolve('MY_ID');
        });

        socketProviderMock.on = jest.fn((subscriptionId, callback) => {
            if (subscriptionId === 'MY_ID') {
                callback('SUBSCRIPTION_ITEM');
            }
        });

        moduleInstanceMock.currentProvider = socketProviderMock;
        const errorMessage = 'Validation error: This option(s) are not valid <toBlock>'
        const subscription = logSubscription.subscribe((error, response) => {
            expect(error).toEqual(new Error(errorMessage));
            expect(response).toEqual(null);
            done();
        });

        expect(subscription).toBeInstanceOf(LogSubscription);

    });

    it('calls subscribe executes getPastLogsMethod and the method throws an error', (done) => {
        const filters = {
            fromBlock: 0
        }
        formatters.inputLogFormatter.mockReturnValueOnce({});

        getPastLogsMethodMock.execute = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
        });
        logSubscription.options.fromBlock = 0;
        expect(
            logSubscription.subscribe((error, response) => {
                expect(error).toEqual(new Error('ERROR'));

                expect(response).toEqual(null);

                expect(formatters.inputLogFormatter).toHaveBeenCalledWith(filters);

                expect(getPastLogsMethodMock.parameters).toEqual([{}]);

                expect(getPastLogsMethodMock.execute).toHaveBeenCalled();

                done();
            })
        ).toBeInstanceOf(LogSubscription);
    });

    it('calls subscribe executes GetPastLogsMethod and emits the error event', (done) => {
        const filters = {
            fromBlock: 0
        }

        formatters.inputLogFormatter.mockReturnValueOnce({});

        getPastLogsMethodMock.execute = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
        });

        logSubscription.options.fromBlock = 0;

        const subscription = logSubscription.subscribe();

        subscription.on('error', (error) => {
            expect(error).toEqual(new Error('ERROR'));

            expect(formatters.inputLogFormatter).toHaveBeenCalledWith(filters);

            expect(getPastLogsMethodMock.parameters).toEqual([{}]);

            expect(getPastLogsMethodMock.execute).toHaveBeenCalled();

            expect(subscription).toBeInstanceOf(LogSubscription);

            done();
        });
    });

    it('calls subscribe and calls the callback once', (done) => {
        formatters.outputLogFormatter.mockReturnValueOnce('ITEM');

        socketProviderMock.subscribe = jest.fn((type, method, parameters) => {
            expect(type).toEqual('eth_subscribe');

            expect(method).toEqual('logs');

            expect(parameters).toEqual([logSubscription.options]);

            return Promise.resolve('MY_ID');
        });

        socketProviderMock.on = jest.fn((subscriptionId, callback) => {
            if (subscriptionId === 'MY_ID') {
                callback('SUBSCRIPTION_ITEM');
            }
        });

        moduleInstanceMock.currentProvider = socketProviderMock;

        const subscription = logSubscription.subscribe((error, response) => {
            expect(error).toEqual(false);

            expect(response).toEqual('ITEM');

            expect(logSubscription.id).toEqual('MY_ID');

            expect(socketProviderMock.on).toHaveBeenCalledTimes(2);

            done();
        });

        expect(subscription).toBeInstanceOf(LogSubscription);
    });

    it('calls subscribe and it returns with an Subscription object that calls the callback with an error', (done) => {
        formatters.inputLogFormatter.mockReturnValueOnce({});

        socketProviderMock.subscribe = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
        });

        moduleInstanceMock.currentProvider = socketProviderMock;

        expect(
            logSubscription.subscribe((error, response) => {
                expect(error).toEqual(new Error('ERROR'));

                expect(response).toEqual(null);

                done();
            })
        ).toBeInstanceOf(LogSubscription);
    });

    it('calls onNewSubscriptionItem with removed set to true', (done) => {
        formatters.outputLogFormatter.mockReturnValueOnce({
            removed: true
        });

        logSubscription.on('changed', (response) => {
            expect(response).toEqual({
                removed: true
            });

            expect(formatters.outputLogFormatter).toHaveBeenCalledWith({
                removed: false
            });

            done();
        });

        expect(logSubscription.onNewSubscriptionItem({
            removed: false
        })).toEqual({
            removed: true
        });
    });

    it('calls onNewSubscriptionItem with removed set to false', () => {
        formatters.outputLogFormatter.mockReturnValueOnce({
            removed: true
        });

        expect(logSubscription.onNewSubscriptionItem({
            removed: false
        })).toEqual({
            removed: true
        });

        expect(formatters.outputLogFormatter).toHaveBeenCalledWith({
            removed: false
        });
    });
});
