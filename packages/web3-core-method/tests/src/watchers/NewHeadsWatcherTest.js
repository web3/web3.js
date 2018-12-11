import {AbstractSubscription, SubscriptionsFactory} from 'web3-core-subscriptions';
import {AbstractWeb3Module} from 'web3-core';
import {HttpProviderAdapter, SocketProviderAdapter} from 'web3-providers';
import NewHeadsWatcher from '../../../src/watchers/NewHeadsWatcher';

// Mocks
jest.mock('HttpProviderAdapter');
jest.mock('SocketProviderAdapter');
jest.mock('AbstractWeb3Module');
jest.mock('Subscription');
jest.mock('SubscriptionsFactory');
jest.mock('AbstractSubscription');

/**
 * NewHeadsWatcher test
 */
describe('NewHeadsWatcherTest', () => {
    let newHeadsWatcher,
        providerAdapter,
        providerAdapterMock,
        moduleInstance,
        moduleInstanceMock,
        subscriptionsFactoryMock,
        subscription,
        subscriptionMock;

    it('constructor check', () => {
        subscriptionsFactoryMock = new SubscriptionsFactory();
        subscriptionsFactoryMock.createNewHeadsSubscription = jest.fn();

        newHeadsWatcher = new NewHeadsWatcher(subscriptionsFactoryMock);

        expect(newHeadsWatcher.subscriptionsFactory)
            .toEqual(subscriptionsFactoryMock);

        expect(newHeadsWatcher.confirmationSubscription)
            .toBeNull();

        expect(newHeadsWatcher.isPolling)
            .toBeFalsy();

        expect(newHeadsWatcher.confirmationInterval)
            .toBeNull();
    });

    it('calls watch and stop with HttpProviderAdapter', () => {
        jest.useFakeTimers();

        subscriptionsFactoryMock = new SubscriptionsFactory();
        subscriptionsFactoryMock.createNewHeadsSubscription = jest.fn();

        newHeadsWatcher = new NewHeadsWatcher(subscriptionsFactoryMock);

        providerAdapter = new HttpProviderAdapter({});
        providerAdapterMock = HttpProviderAdapter.mock.instances[0];

        moduleInstance = new AbstractWeb3Module(providerAdapterMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        const newHeadsWatcherObject = newHeadsWatcher.watch(moduleInstanceMock);

        expect(newHeadsWatcherObject.isPolling)
            .toBeTruthy();

        expect(newHeadsWatcherObject.confirmationInterval)
            .toEqual(1);

        expect(setInterval)
            .toHaveBeenCalledTimes(1);

        expect(setInterval)
            .toHaveBeenLastCalledWith(expect.any(Function), 1000);

        newHeadsWatcher.stop();

        expect(newHeadsWatcher.listeners('newHead'))
            .toHaveLength(0);
    });

    it('calls watch and stop with SocketProviderAdapter', () => {
        providerAdapter = new SocketProviderAdapter({});
        providerAdapterMock = SocketProviderAdapter.mock.instances[0];

        moduleInstance = new AbstractWeb3Module(providerAdapterMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];
        moduleInstance.currentProvider = providerAdapterMock;

        subscription = new AbstractSubscription({}, moduleInstanceMock);
        subscriptionMock = AbstractSubscription.mock.instances[0];
        subscriptionMock.subscribe
            .mockReturnValueOnce(subscriptionMock);

        subscriptionsFactoryMock = new SubscriptionsFactory();
        subscriptionsFactoryMock.createNewHeadsSubscription = jest.fn(() => {
            return subscriptionMock;
        });

        newHeadsWatcher = new NewHeadsWatcher(subscriptionsFactoryMock);

        newHeadsWatcher.watch(moduleInstance);
        newHeadsWatcher.stop();

        expect(newHeadsWatcher.listeners('newHead')).toHaveLength(0);

        expect(subscriptionsFactoryMock.createNewHeadsSubscription)
            .toHaveBeenCalledWith(moduleInstanceMock);

        expect(subscriptionMock.subscribe)
            .toHaveBeenCalledWith(expect.any(Function));

        expect(subscriptionMock.unsubscribe)
            .toHaveBeenCalled();
    });
});
