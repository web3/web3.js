const chai = require('chai');
const sinon = require('sinon').createSandbox();
const expect = chai.expect;

const SubscriptionsPackage = require('web3-core-subscriptions');
const AbstractWeb3Module = require('web3-core').AbstractWeb3Module;
const ProvidersPackage = require('web3-providers');
const NewHeadsWatcher = require('../../src/watchers/NewHeadsWatcher');

/**
 * NewHeadsWatcher test
 */
describe('NewHeadsWatcherTest', () => {
    let newHeadsWatcher;
    let provider;
    let providerMock;
    let providerAdapter;
    let providerAdapterMock;
    let moduleInstance;
    let moduleInstanceMock;
    let subscriptionsFactory;
    let subscriptionsFactoryMock;
    let subscription;
    let subscriptionMock;

    beforeEach(() => {
        subscriptionsFactory = new SubscriptionsPackage.createSubscriptionsFactory();
        subscriptionsFactoryMock = sinon.mock(subscriptionsFactory);

        newHeadsWatcher = new NewHeadsWatcher(subscriptionsFactory);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('constructor check', () => {
        expect(newHeadsWatcher.subscriptionsFactory).to.be.an.instanceof(subscriptionsFactory.constructor);
        expect(newHeadsWatcher.confirmationSubscription).to.be.null;
        expect(newHeadsWatcher.isPolling).to.be.false;
        expect(newHeadsWatcher.confirmationInterval).to.be.null;
    });

    it('calls watch and stop with HttpProviderAdapter', () => {
        provider = new ProvidersPackage.HttpProvider('http://127.0.0.1', {});
        providerMock = sinon.mock(provider);

        providerAdapter = new ProvidersPackage.HttpProviderAdapter(provider);
        providerAdapterMock = sinon.mock(providerAdapter);

        moduleInstance = new AbstractWeb3Module(providerAdapter, ProvidersPackage, null, null);
        moduleInstanceMock = sinon.mock(moduleInstance);

        const newHeadsWatcherObject = newHeadsWatcher.watch(moduleInstance);

        expect(newHeadsWatcherObject.isPolling).to.be.true;
        expect(newHeadsWatcherObject.confirmationInterval).to.be.instanceof(Object);

        newHeadsWatcher.stop();

        expect(newHeadsWatcher.listeners('newHead').length).equal(0);
    });

    it('calls watch and stop with SocketProviderAdapter', () => {
        provider = new ProvidersPackage.WebsocketProvider('ws://127.0.0.1', {});
        providerMock = sinon.mock(provider);

        providerAdapter = new ProvidersPackage.SocketProviderAdapter(provider);
        providerAdapterMock = sinon.mock(providerAdapter);

        moduleInstance = new AbstractWeb3Module(providerAdapter, ProvidersPackage, null, null);
        moduleInstanceMock = sinon.mock(moduleInstance);

        subscription = new SubscriptionsPackage.Subscription({}, moduleInstance);
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

        expect(newHeadsWatcher.listeners('newHead').length).equal(0);

        subscriptionMock.verify();
        subscriptionsFactoryMock.verify();
    });
});
