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
    let logSubscription,
        moduleInstanceMock,
        getPastLogsMethodMock,
        socketProviderAdapterMock;

    beforeEach(() => {
        socketProviderAdapterMock = new SocketProviderAdapter();
        moduleInstanceMock = new AbstractWeb3Module();
        getPastLogsMethodMock = new GetPastLogsMethod();

        logSubscription = new LogSubscription({}, Utils, formatters, moduleInstanceMock, getPastLogsMethodMock);
    });

    it('constructor check', () => {
        expect(logSubscription.method)
            .toEqual('logs');

        expect(logSubscription.type)
            .toEqual('eth_subscribe');

        expect(logSubscription.options)
            .toEqual({});

        expect(logSubscription.utils)
            .toEqual(Utils);

        expect(logSubscription.moduleInstance)
            .toEqual(moduleInstanceMock);

        expect(logSubscription.getPastLogsMethod)
            .toEqual(getPastLogsMethodMock);
    });

    it('calls subscribe and gets the Subscription object returned', done => {
        formatters.inputLogFormatter
            .mockReturnValueOnce({});

        formatters.outputLogFormatter
            .mockReturnValueOnce('ITEM');

        getPastLogsMethodMock.execute = jest.fn(moduleInstance => {
            expect(moduleInstance)
                .toEqual(moduleInstanceMock);

            return Promise.resolve([0]);
        });

        socketProviderAdapterMock.subscribe = jest.fn((type, method, parameters) => {
            expect(type)
                .toBe('eth_subscribe');

            expect(method)
                .toBe('logs');

            expect(parameters)
                .toEqual([logSubscription.options]);

            return Promise.resolve('MY_ID');
        });

        socketProviderAdapterMock.on = jest.fn((subscriptionId, callback) => {
            expect(subscriptionId)
                .toBe('MY_ID');

            callback(false, 'SUBSCRIPTION_ITEM');
        });

        moduleInstanceMock.currentProvider = socketProviderAdapterMock;

        let second = false;
        const subscription = logSubscription.subscribe((error, response) => {
            let expectedResponse = 0,
                expectedId = null;

                if (second) {
                    expectedResponse = 'ITEM';
                    expectedId = 'MY_ID';
                }

                expect(error)
                    .toBeFalsy();

                expect(response)
                    .toBe(expectedResponse);

                expect(formatters.inputLogFormatter)
                    .toHaveBeenCalledWith(logSubscription.options);

                expect(getPastLogsMethodMock.parameters)
                    .toEqual([logSubscription.options]);

                expect(getPastLogsMethodMock.execute)
                    .toHaveBeenCalledWith(moduleInstanceMock);

                expect(logSubscription.id)
                    .toBe(expectedId);

                if(second) {
                    done();
                }

                second = true;
            });

        expect(subscription)
            .toBeInstanceOf(LogSubscription);
    });

    it('calls subscribe and it returns with an Subscription object that calls the callback with an error', done => {
        formatters.inputLogFormatter
            .mockReturnValueOnce({});

        getPastLogsMethodMock.execute = jest.fn(moduleInstance => {
            expect(moduleInstance)
                .toEqual(moduleInstanceMock);

            return Promise.reject('ERROR');
        });

        const subscription = logSubscription.subscribe((error, response) => {
                expect(error)
                    .toBe('ERROR');

                expect(response)
                    .toBe(null);

                expect(formatters.inputLogFormatter)
                    .toHaveBeenCalledWith(logSubscription.options);

                expect(getPastLogsMethodMock.parameters)
                    .toEqual([logSubscription.options]);

                expect(getPastLogsMethodMock.execute)
                    .toHaveBeenCalledWith(moduleInstanceMock);

                done();
            });

        expect(subscription)
            .toBeInstanceOf(LogSubscription);
    });
});
