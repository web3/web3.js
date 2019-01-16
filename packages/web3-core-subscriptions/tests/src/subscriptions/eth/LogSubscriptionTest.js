import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import LogSubscription from '../../../../src/subscriptions/eth/LogSubscription';
import AbstractWeb3Module from '../../../__mocks__/AbstractWeb3Module';
import GetPastLogsMethod from '../../../__mocks__/GetPastLogsMethod';
import SocketProviderAdapter from '../../../__mocks__/SocketProviderAdapter';

// Mocks
jest.mock('Utils');
jest.mock('formatters');

/**
 * LogSubscription test
 */
describe('LogSubscriptionTest', () => {
    let logSubscription, moduleInstanceMock, getPastLogsMethodMock, socketProviderAdapterMock;

    beforeEach(() => {
        moduleInstanceMock = new AbstractWeb3Module();
        socketProviderAdapterMock = new SocketProviderAdapter();
        getPastLogsMethodMock = new GetPastLogsMethod();

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

        formatters.outputLogFormatter.mockReturnValueOnce('ITEM');

        getPastLogsMethodMock.execute = jest.fn((moduleInstance) => {
            expect(moduleInstance).toEqual(moduleInstanceMock);

            return Promise.resolve([0]);
        });

        socketProviderAdapterMock.subscribe = jest.fn((type, method, parameters) => {
            expect(type).toEqual('eth_subscribe');

            expect(method).toEqual('logs');

            expect(parameters).toEqual([{}]);

            return Promise.resolve('MY_ID');
        });

        socketProviderAdapterMock.on = jest.fn((subscriptionId, callback) => {
            expect(subscriptionId).toEqual('MY_ID');

            callback(false, 'SUBSCRIPTION_ITEM');
        });

        moduleInstanceMock.currentProvider = socketProviderAdapterMock;

        let second = false;
        logSubscription.options.fromBlock = 0;
        const subscription = logSubscription.subscribe((error, response) => {
            let expectedResponse = 0;
            let expectedId = null;

            if (second) {
                expectedResponse = 'ITEM';
                expectedId = 'MY_ID';
            }

            expect(error).toEqual(false);

            expect(response).toEqual(expectedResponse);

            expect(formatters.inputLogFormatter).toHaveBeenCalledWith(logSubscription.options);

            expect(getPastLogsMethodMock.parameters).toEqual([{}]);

            expect(getPastLogsMethodMock.execute).toHaveBeenCalledWith(moduleInstanceMock);

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

        getPastLogsMethodMock.execute = jest.fn((moduleInstance) => {
            expect(moduleInstance).toEqual(moduleInstanceMock);

            return Promise.reject(new Error('ERROR'));
        });

        logSubscription.options.fromBlock = 0;
        expect(
            logSubscription.subscribe((error, response) => {
                expect(error).toEqual(new Error('ERROR'));

                expect(response).toEqual(null);

                expect(formatters.inputLogFormatter).toHaveBeenCalledWith(logSubscription.options);

                expect(getPastLogsMethodMock.parameters).toEqual([{}]);

                expect(getPastLogsMethodMock.execute).toHaveBeenCalledWith(moduleInstanceMock);

                done();
            })
        ).toBeInstanceOf(LogSubscription);
    });

    it('calls subscribe and calls the callback once', (done) => {
        formatters.outputLogFormatter.mockReturnValueOnce('ITEM');

        socketProviderAdapterMock.subscribe = jest.fn((type, method, parameters) => {
            expect(type).toEqual('eth_subscribe');

            expect(method).toEqual('logs');

            expect(parameters).toEqual([logSubscription.options]);

            return Promise.resolve('MY_ID');
        });

        socketProviderAdapterMock.on = jest.fn((subscriptionId, callback) => {
            expect(subscriptionId).toEqual('MY_ID');

            callback(false, 'SUBSCRIPTION_ITEM');
        });

        moduleInstanceMock.currentProvider = socketProviderAdapterMock;

        const subscription = logSubscription.subscribe((error, response) => {
            expect(error).toEqual(false);

            expect(response).toEqual('ITEM');

            expect(logSubscription.id).toEqual('MY_ID');

            done();
        });

        expect(subscription).toBeInstanceOf(LogSubscription);
    });

    it('calls subscribe and it returns with an Subscription object that calls the callback with an error', (done) => {
        formatters.inputLogFormatter.mockReturnValueOnce({});

        socketProviderAdapterMock.subscribe = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
        });

        moduleInstanceMock.currentProvider = socketProviderAdapterMock;

        expect(
            logSubscription.subscribe((error, response) => {
                expect(error).toEqual(new Error('ERROR'));

                expect(response).toEqual(null);

                done();
            })
        ).toBeInstanceOf(LogSubscription);
    });
});
