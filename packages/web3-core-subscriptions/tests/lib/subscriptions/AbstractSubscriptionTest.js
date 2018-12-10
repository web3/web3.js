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

    });

    it('calls subscribe and returns with Subscription object', () => {

    });

    it('calls subscribe and returns with Subscription object which calls the callback method with an error', () => {

    });

    it('calls unsubscribe and returns a Promise that resolves with true', () => {

    });

    it('calls unsubscribe and returns a Promise that resolves with false', () => {

    });

    it('calls reconnect and can connect', () => {

    });

    it('calls reconnect and can\'t connect', () => {

    });
});
