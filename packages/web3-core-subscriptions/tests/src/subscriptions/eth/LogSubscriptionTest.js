import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import LogSubscription from '../../../../src/subscriptions/eth/LogSubscription';
import AbstractWeb3Module from '../../../__mocks__/AbstractWeb3Module';
import GetPastLogsMethod from '../../../__mocks__/GetPastLogsMethod';
import SocketProvider from '../../../__mocks__/SocketProvider';

// Mocks
jest.mock('web3-utils');
jest.mock('web3-core-helpers');

/**
 * LogSubscription test
 */
describe('LogSubscriptionTest', () => {
    let logSubscription, moduleInstanceMock, getPastLogsMethodMock, socketProviderMock;

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

        expect(logSubscription.utils).toEqual(Utils);

        expect(logSubscription.moduleInstance).toEqual(moduleInstanceMock);

        expect(logSubscription.getPastLogsMethod).toEqual(getPastLogsMethodMock);
    });

    it('calls subscribe executes GetPastLogsMethod and calls the callback twice because of the past logs', (done) => {
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
        logSubscription.options.toBlock = 0;

        const subscription = logSubscription.subscribe((error, response) => {
            let expectedResponse = 0;
            let expectedId = null;

            if (second) {
                expectedResponse = 'ITEM';
                expectedId = 'MY_ID';

                expect(logSubscription.options.toBlock).toBeUndefined();

                expect(logSubscription.options.fromBlock).toBeUndefined();
            }

            expect(error).toEqual(false);

            expect(response).toEqual(expectedResponse);

            expect(formatters.inputLogFormatter).toHaveBeenCalledWith(logSubscription.options);

            expect(getPastLogsMethodMock.parameters).toEqual([{}]);

            expect(getPastLogsMethodMock.execute).toHaveBeenCalled();

            expect(logSubscription.id).toEqual(expectedId);

            if (second) {
                done();
            }

            second = true;
        });

        expect(subscription).toBeInstanceOf(LogSubscription);
    });

    it('calls subscribe executes GetPastLogsMethod and the method throws an error', (done) => {
        formatters.inputLogFormatter.mockReturnValueOnce({});

        getPastLogsMethodMock.execute = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
        });

        logSubscription.options.fromBlock = 0;
        expect(
            logSubscription.subscribe((error, response) => {
                expect(error).toEqual(new Error('ERROR'));

                expect(response).toEqual(null);

                expect(formatters.inputLogFormatter).toHaveBeenCalledWith(logSubscription.options);

                expect(getPastLogsMethodMock.parameters).toEqual([{}]);

                expect(getPastLogsMethodMock.execute).toHaveBeenCalled();

                done();
            })
        ).toBeInstanceOf(LogSubscription);
    });

    it('calls subscribe executes GetPastLogsMethod and emits the error event', (done) => {
        formatters.inputLogFormatter.mockReturnValueOnce({});

        getPastLogsMethodMock.execute = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
        });

        logSubscription.options.fromBlock = 0;

        const subscription = logSubscription.subscribe();

        subscription.on('error', (error) => {
            expect(error).toEqual(new Error('ERROR'));

            expect(formatters.inputLogFormatter).toHaveBeenCalledWith(logSubscription.options);

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
        formatters.outputLogFormatter.mockReturnValueOnce({removed: true});

        logSubscription.on('changed', (response) => {
            expect(response).toEqual({removed: true});

            expect(formatters.outputLogFormatter).toHaveBeenCalledWith({removed: false});

            done();
        });

        expect(logSubscription.onNewSubscriptionItem({removed: false})).toEqual({removed: true});
    });

    it('calls onNewSubscriptionItem with removed set to false', () => {
        formatters.outputLogFormatter.mockReturnValueOnce({removed: true});

        expect(logSubscription.onNewSubscriptionItem({removed: false})).toEqual({removed: true});

        expect(formatters.outputLogFormatter).toHaveBeenCalledWith({removed: false});
    });
});
