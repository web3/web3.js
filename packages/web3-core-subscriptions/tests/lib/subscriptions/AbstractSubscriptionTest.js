import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import AbstractSubscription from '../../../lib/subscriptions/AbstractSubscription';
import AbstractWeb3Module from '../../__mocks__/AbstractWeb3Module';

// Mocks
jest.mock('Utils');
jest.mock('formatters');

/**
 * AbstractSubscription test
 */
describe('AbstractSubscriptionTest', () => {
    let abstractSubscription,
        moduleInstanceMock;

    beforeEach(() => {
        moduleInstanceMock = new AbstractWeb3Module();
        moduleInstanceMock.currentProvider.subscribe = jest.fn((type, method, parameters) => {
            expect(type)
                .toEqual(abstractSubscription.type);

            expect(method)
                .toEqual(abstractSubscription.method);

            expect(parameters)
                .toEqual([abstractSubscription.options]);

            return Promise.resolve('MY_ID');
        });

        abstractSubscription = new AbstractSubscription('type', 'method', {}, Utils, formatters, moduleInstanceMock);
    });

    it('constructor check', () => {
        expect(abstractSubscription.type)
            .toEqual('type');

        expect(abstractSubscription.method)
            .toEqual('method');

        expect(abstractSubscription.options)
            .toEqual({});

        expect(abstractSubscription.utils)
            .toEqual(Utils);

        expect(abstractSubscription.formatters)
            .toEqual(formatters);

        expect(abstractSubscription.moduleInstance)
            .toEqual(moduleInstanceMock);

        expect(abstractSubscription.id)
            .toEqual(null);

        expect(abstractSubscription.beforeSubscription)
            .toBeInstanceOf(Function);
    });

    it('calls onNewSubscriptionItem and returns just the given value', () => {
        expect(abstractSubscription.onNewSubscriptionItem('string'))
            .toEqual('string');
    });

    it('calls subscribe and returns a Subscription object', done => {
        moduleInstanceMock.currentProvider.on = jest.fn((id, callback) => {
            expect(id)
                .toEqual('MY_ID');
            callback(false, 'SUBSCRIPTION_ITEM');
        });

        const callback = jest.fn((error, response) => {
            expect(abstractSubscription.id)
                .toEqual('MY_ID');

            expect(error)
                .toEqual(false);

            expect(response)
                .toEqual('SUBSCRIPTION_ITEM');

            done();
        });

        const subscription = abstractSubscription.subscribe(callback);

        subscription.on('data', error => {
            expect(error)
                .toEqual('SUBSCRIPTION_ITEM');
        });
    });

    it('calls subscribe and executes with this reconnect but fails on unsubscribing', done => {
        moduleInstanceMock.currentProvider.on = jest.fn((id, callback) => {
            expect(id)
                .toEqual('MY_ID');
            callback('ERROR', null);
        });

        moduleInstanceMock.currentProvider.once = jest.fn((eventType, callback) => {
            expect(eventType)
                .toEqual('connect');

            callback();
        });

        moduleInstanceMock.currentProvider.unsubscribe = jest.fn((id, type) => {
            expect(id)
                .toEqual(id);

            expect(type)
                .toEqual(type);

            return Promise.reject('ERROR');
        });

        const callback = jest.fn((error, response) => {
            expect(abstractSubscription.id)
                .toEqual('MY_ID');

            expect(error)
                .toEqual('ERROR');

            expect(response)
                .toEqual(null);

            done();
        });

        const subscription = abstractSubscription.subscribe(callback);

        subscription.on('error', error => {
            expect(error)
                .toEqual('ERROR');
        });
    });

    it('calls subscribe and executes with this reconnect but gets an error from the node on unsubscribe', done => {
        moduleInstanceMock.currentProvider.on = jest.fn((id, callback) => {
            expect(id)
                .toEqual('MY_ID');

            callback('ERROR', null);
        });

        moduleInstanceMock.currentProvider.once = jest.fn((eventType, callback) => {
            expect(eventType)
                .toEqual('connect');

            callback();
        });

        moduleInstanceMock.currentProvider.unsubscribe = jest.fn((id, type) => {
            expect(id)
                .toEqual(id);

            expect(type)
                .toEqual(type);

            return Promise.resolve(false);
        });

        let second = false;
        const callback = jest.fn((error, response) => {
            if (second) {
                expect(error.message)
                    .toEqual('Error on unsubscribe!');
            } else {
                expect(error)
                    .toEqual('ERROR');
            }

            expect(response)
                .toEqual(null);

            if (second) {
                done();
            }

            second = true;
        });

        const subscription = abstractSubscription.subscribe(callback);

        let counter = 0;
        subscription.on('error', error => {
            if (counter === 1) {
                expect(error.message)
                    .toEqual('Error on unsubscribe!');
            } else {
                expect(error)
                    .toEqual('ERROR');
            }

            counter++;
        });
    });

    it('calls subscribe and executes with this reconnect and can reconnect', done => {
        moduleInstanceMock.currentProvider.on = jest.fn((id, callback) => {
            expect(id)
                .toEqual('MY_ID');

            callback('ERROR', null);
        });

        moduleInstanceMock.currentProvider.once = jest.fn((eventType, callback) => {
            expect(eventType)
                .toEqual('connect');

            callback();
        });

        moduleInstanceMock.currentProvider.unsubscribe = jest.fn((id, type) => {
            expect(id)
                .toEqual(id);

            expect(type)
                .toEqual(type);

            return Promise.resolve(true);
        });

        let second = false;
        const callback = jest.fn((error, response) => {
            if (second) {
                expect(error)
                    .toEqual(false);

                expect(response)
                    .toEqual(true);
            } else {
                expect(error)
                    .toEqual('ERROR');

                expect(response)
                    .toEqual(null);
            }

            if (second) {
                done();
            }

            second = true;
        });

        const subscription = abstractSubscription.subscribe(callback);

        let counter = 0;
        subscription.on('error', error => {
            if (counter === 1) {
                expect(error)
                    .toEqual(true);
            } else {
                expect(error)
                    .toEqual('ERROR');
            }

            counter++;
        });
    });
});

