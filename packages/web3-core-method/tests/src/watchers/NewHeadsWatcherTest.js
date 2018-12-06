import {Subscription, SubscriptionsFactory} from 'packages/web3-core-subscriptions/dist/web3-core-subscriptions.cjs';
import {AbstractWeb3Module} from 'packages/web3-core/dist/web3-core.cjs';
import {HttpProviderAdapter, SocketProviderAdapter} from 'packages/web3-providers/dist/web3-providers.cjs';
import NewHeadsWatcher from '../../../src/watchers/NewHeadsWatcher';

// Mocks
jest.mock('HttpProviderAdapter');
jest.mock('SocketProviderAdapter');
jest.mock('AbstractWeb3Module');
jest.mock('Subscription');
jest.mock('SubscriptionsFactory');

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
            .toBe(1);

        expect(setInterval).toHaveBeenCalledTimes(1);

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

        subscription = new Subscription({}, moduleInstanceMock);
        subscriptionMock = Subscription.mock.instances[0];
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
            .toHaveBeenCalled();

        expect(subscriptionMock.unsubscribe)
            .toHaveBeenCalled();
    });
});
