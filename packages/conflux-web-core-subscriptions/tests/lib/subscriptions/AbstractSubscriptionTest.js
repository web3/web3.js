import * as Utils from 'conflux-web-utils';
import {formatters} from 'conflux-web-core-helpers';
import AbstractSubscription from '../../../lib/subscriptions/AbstractSubscription';
import AbstractConfluxModule from '../../__mocks__/AbstractConfluxWebModule';

// Mocks
jest.mock('conflux-web-utils');
jest.mock('conflux-web-core-helpers');

/**
 * AbstractSubscription test
 */
describe('AbstractSubscriptionTest', () => {
    let abstractSubscription, moduleInstanceMock;

    beforeEach(() => {
        moduleInstanceMock = new AbstractConfluxModule();
        moduleInstanceMock.currentProvider.subscribe = jest.fn((type, method, parameters) => {
            expect(type).toEqual(abstractSubscription.type);

            expect(method).toEqual(abstractSubscription.method);

            if (abstractSubscription.options !== null) {
                expect(parameters).toEqual([abstractSubscription.options]);
            } else {
                expect(parameters).toEqual([]);
            }

            return Promise.resolve('MY_ID');
        });

        abstractSubscription = new AbstractSubscription(
            'eth_subscribe',
            'rpc_method',
            {},
            Utils,
            formatters,
            moduleInstanceMock
        );
    });

    it('constructor check', () => {
        expect(abstractSubscription.type).toEqual('eth_subscribe');

        expect(abstractSubscription.method).toEqual('rpc_method');

        expect(abstractSubscription.options).toEqual({});

        expect(abstractSubscription.utils).toEqual(Utils);

        expect(abstractSubscription.formatters).toEqual(formatters);

        expect(abstractSubscription.moduleInstance).toEqual(moduleInstanceMock);

        expect(abstractSubscription.id).toEqual(null);

        expect(abstractSubscription.beforeSubscription).toBeInstanceOf(Function);
    });

    it('calls onNewSubscriptionItem and returns just the given value', () => {
        expect(abstractSubscription.onNewSubscriptionItem('string')).toEqual('string');
    });

    it('calls subscribe and returns a Subscription object', (done) => {
        moduleInstanceMock.currentProvider.on = jest.fn((id, callback) => {
            expect(id).toEqual('MY_ID');

            callback({result: 'SUBSCRIPTION_ITEM'});
        });

        const callback = jest.fn((error, response) => {
            expect(abstractSubscription.id).toEqual('MY_ID');

            expect(error).toEqual(false);

            expect(response).toEqual('SUBSCRIPTION_ITEM');

            done();
        });

        const subscription = abstractSubscription.subscribe(callback);

        subscription.on('data', (data) => {
            expect(data).toEqual('SUBSCRIPTION_ITEM');
        });
    });

    it('calls subscribe with options set to null and returns a Subscription object', (done) => {
        moduleInstanceMock.currentProvider.on = jest.fn((id, callback) => {
            expect(id).toEqual('MY_ID');

            callback({result: 'SUBSCRIPTION_ITEM'});
        });

        const callback = jest.fn((error, response) => {
            expect(abstractSubscription.id).toEqual('MY_ID');

            expect(error).toEqual(false);

            expect(response).toEqual('SUBSCRIPTION_ITEM');

            done();
        });

        abstractSubscription.options = null;

        const subscription = abstractSubscription.subscribe(callback);

        subscription.on('data', (data) => {
            expect(data).toEqual('SUBSCRIPTION_ITEM');
        });
    });

    it('calls unsubscribe and returns with a resolved promise', async () => {
        moduleInstanceMock.currentProvider.unsubscribe = jest.fn((id, type) => {
            expect(id).toEqual('ID');

            expect(type).toEqual('eth_unsubscribe');

            return Promise.resolve(true);
        });

        abstractSubscription.id = 'ID';
        abstractSubscription.on('data', () => {});

        const callback = jest.fn();

        const response = await abstractSubscription.unsubscribe(callback);

        expect(response).toEqual(true);

        expect(callback).toHaveBeenCalledWith(false, true);

        expect(abstractSubscription.listenerCount('data')).toEqual(0);

        expect(abstractSubscription.id).toEqual(null);
    });

    it('calls unsubscribe and returns with a rejected promise', async () => {
        moduleInstanceMock.currentProvider.unsubscribe = jest.fn((id, type) => {
            expect(id).toEqual('ID');

            expect(type).toEqual('eth_unsubscribe');

            return Promise.resolve(false);
        });

        const callback = jest.fn();
        abstractSubscription.id = 'ID';
        abstractSubscription.type = 'eth_s';

        await expect(abstractSubscription.unsubscribe(callback)).rejects.toThrow('Error on unsubscribe!');

        expect(callback).toHaveBeenCalledWith(new Error('Error on unsubscribe!'), null);
    });
});
