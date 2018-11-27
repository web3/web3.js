import * as sinonLib from 'sinon';
import {Subscription, SubscriptionsFactory} from 'web3-core-subscriptions';
import {AbstractWeb3Module} from 'web3-core';
import {HttpProviderAdapter, HttpProvider, SocketProviderAdapter, WebsocketProvider} from 'web3-providers';
import NewHeadsWatcher from '../../src/watchers/NewHeadsWatcher';

const sinon = sinonLib.createSandbox();

/**
 * NewHeadsWatcher test
 */
describe('NewHeadsWatcherTest', () => {
    let newHeadsWatcher,
        provider,
        providerAdapter,
        moduleInstance,
        subscriptionsFactory,
        subscriptionsFactoryMock,
        subscription,
        subscriptionMock;

    beforeEach(() => {
        subscriptionsFactory = new SubscriptionsFactory();
        subscriptionsFactoryMock = sinon.mock(subscriptionsFactory);

        newHeadsWatcher = new NewHeadsWatcher(subscriptionsFactory);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('constructor check', () => {
        expect(newHeadsWatcher.subscriptionsFactory).toBeInstanceOf(subscriptionsFactory.constructor);
        expect(newHeadsWatcher.confirmationSubscription).toBeNull();
        expect(newHeadsWatcher.isPolling).toBeFalsy();
        expect(newHeadsWatcher.confirmationInterval).toBeNull();
    });

    it('calls watch and stop with HttpProviderAdapter', () => {
        provider = new HttpProvider('http://127.0.0.1', {});

        providerAdapter = new HttpProviderAdapter(provider);

        moduleInstance = new AbstractWeb3Module(providerAdapter, {}, {}, {});

        const newHeadsWatcherObject = newHeadsWatcher.watch(moduleInstance);

        expect(newHeadsWatcherObject.isPolling).toBeTruthy();
        expect(newHeadsWatcherObject.confirmationInterval).toBeInstanceOf(Object);

        newHeadsWatcher.stop();

        expect(newHeadsWatcher.listeners('newHead')).toHaveLength(0);
    });

    it('calls watch and stop with SocketProviderAdapter', () => {
        provider = new WebsocketProvider('ws://127.0.0.1', {});

        providerAdapter = new SocketProviderAdapter(provider);

        moduleInstance = new AbstractWeb3Module(providerAdapter, {}, {}, {});

        subscription = new Subscription({}, moduleInstance);
        subscriptionMock = sinon.mock(subscription);

        subscriptionMock
            .expects('subscribe')
            .returns(subscription)
            .once();

        subscriptionMock.expects('unsubscribe').once();

        subscriptionsFactoryMock
            .expects('createNewHeadsSubscription')
            .withArgs(moduleInstance)
            .returns(subscription)
            .once();

        newHeadsWatcher.watch(moduleInstance);
        newHeadsWatcher.stop();

        expect(newHeadsWatcher.listeners('newHead')).toHaveLength(0);

        subscriptionMock.verify();
        subscriptionsFactoryMock.verify();
    });
});
