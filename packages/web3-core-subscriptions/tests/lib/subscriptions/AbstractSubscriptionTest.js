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
});

