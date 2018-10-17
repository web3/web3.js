var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;

var SubscriptionsPackage = require('web3-core-subscriptions');
var AbstractWeb3Module = require('web3-core').AbstractWeb3Module;
var ProvidersPackage = require('web3-providers');
var NewHeadsWatcher = require('../../src/watchers/NewHeadsWatcher');

/**
 * NewHeadsWatcher test
 */
describe('NewHeadsWatcherTest', function () {
    var newHeadsWatcher,
        provider,
        providerMock,
        providerAdapter,
        providerAdapterMock,
        moduleInstance,
        moduleInstanceMock,
        subscriptionsFactory,
        subscriptionsFactoryMock,
        subscription,
        subscriptionMock;

    beforeEach(function () {
        subscriptionsFactory = new SubscriptionsPackage.createSubscriptionsFactory();
        subscriptionsFactoryMock = sinon.mock(subscriptionsFactory);

        newHeadsWatcher = new NewHeadsWatcher(subscriptionsFactory);
    });

    afterEach(function () {
        sinon.restore();
    });

    it('constructor check', function() {
        expect(newHeadsWatcher.subscriptionsFactory).to.be.an.instanceof(subscriptionsFactory.constructor);
        expect(newHeadsWatcher.confirmationSubscription).to.be.null;
        expect(newHeadsWatcher.isPolling).to.be.false;
        expect(newHeadsWatcher.confirmationInterval).to.be.null;
    });

    it('calls watch and stop with HttpProviderAdapter', function () {
        provider = new ProvidersPackage.HttpProvider('http://127.0.0.1', {});
        providerMock = sinon.mock(provider);

        providerAdapter = new ProvidersPackage.HttpProviderAdapter(provider);
        providerAdapterMock = sinon.mock(providerAdapter);

        moduleInstance = new AbstractWeb3Module(providerAdapter, ProvidersPackage, null, null);
        moduleInstanceMock = sinon.mock(moduleInstance);

        var newHeadsWatcherObject = newHeadsWatcher.watch(moduleInstance);

        expect(newHeadsWatcherObject.isPolling).to.be.true;
        expect(newHeadsWatcherObject.confirmationInterval).to.be.instanceof(Object);

        newHeadsWatcher.stop();

        expect(newHeadsWatcher.listeners('newHead').length).equal(0);
    });

    it('calls watch and stop with SocketProviderAdapter', function () {
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

        subscriptionMock
            .expects('unsubscribe')
            .once();

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
