import {AbstractSubscription, SubscriptionsFactory} from 'web3-core-subscriptions';
import {AbstractWeb3Module} from 'web3-core';
import {WebsocketProvider, HttpProvider} from 'web3-providers';
import NewHeadsWatcher from '../../../src/watchers/NewHeadsWatcher';

// Mocks
jest.mock('HttpProvider');
jest.mock('WebsocketProvider');
jest.mock('AbstractWeb3Module');
jest.mock('Subscription');
jest.mock('SubscriptionsFactory');
jest.mock('AbstractSubscription');

/**
 * NewHeadsWatcher test
 */
describe('NewHeadsWatcherTest', () => {
    let newHeadsWatcher, providerMock, moduleInstanceMock, subscriptionsFactoryMock, subscriptionMock;

    it('constructor check', () => {
        new SubscriptionsFactory();
        subscriptionsFactoryMock = SubscriptionsFactory.mock.instances[0];
        subscriptionsFactoryMock.createNewHeadsSubscription = jest.fn();

        newHeadsWatcher = new NewHeadsWatcher(subscriptionsFactoryMock);

        expect(newHeadsWatcher.subscriptionsFactory).toEqual(subscriptionsFactoryMock);

        expect(newHeadsWatcher.confirmationSubscription).toBeNull();

        expect(newHeadsWatcher.isPolling).toEqual(false);

        expect(newHeadsWatcher.confirmationInterval).toBeNull();
    });

    it('calls watch and stops with HttpProvider', () => {
        jest.useFakeTimers();

        new SubscriptionsFactory();
        subscriptionsFactoryMock.createNewHeadsSubscription = jest.fn();

        newHeadsWatcher = new NewHeadsWatcher(subscriptionsFactoryMock);

        new HttpProvider({});
        providerMock = HttpProvider.mock.instances[0];

        new AbstractWeb3Module(providerMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];
        moduleInstanceMock.currentProvider = providerMock;

        const newHeadsWatcherObject = newHeadsWatcher.watch(moduleInstanceMock);

        expect(newHeadsWatcherObject.isPolling).toEqual(true);

        expect(newHeadsWatcherObject.confirmationInterval).toEqual(1);

        expect(setInterval).toHaveBeenCalledTimes(1);

        expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);

        newHeadsWatcher.stop();

        expect(newHeadsWatcher.listeners('newHead')).toHaveLength(0);
    });

    it('calls watch and stops with WebsocketProvider', () => {
        new WebsocketProvider({});
        providerMock = WebsocketProvider.mock.instances[0];

        new AbstractWeb3Module(providerMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];
        moduleInstanceMock.currentProvider = providerMock;

        new AbstractSubscription({}, moduleInstanceMock);
        subscriptionMock = AbstractSubscription.mock.instances[0];
        subscriptionMock.subscribe.mockReturnValueOnce(subscriptionMock);

        new SubscriptionsFactory();
        subscriptionsFactoryMock.createNewHeadsSubscription = jest.fn(() => {
            return subscriptionMock;
        });

        newHeadsWatcher = new NewHeadsWatcher(subscriptionsFactoryMock);

        newHeadsWatcher.watch(moduleInstanceMock);
        newHeadsWatcher.stop();

        expect(newHeadsWatcher.listeners('newHead')).toHaveLength(0);

        expect(subscriptionsFactoryMock.createNewHeadsSubscription).toHaveBeenCalledWith(moduleInstanceMock);

        expect(subscriptionMock.subscribe).toHaveBeenCalledWith(expect.any(Function));

        expect(subscriptionMock.unsubscribe).toHaveBeenCalled();
    });
});
