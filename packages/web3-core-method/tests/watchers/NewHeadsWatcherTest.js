var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;

var SubscriptionsPackage = require('web3-core-subscriptions');
var AbstractWeb3Object = require('web3-core-package').AbstractWeb3Object;
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
        web3Package,
        web3PackageMock,
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

        web3Package = new AbstractWeb3Object(providerAdapter, ProvidersPackage, null, null);
        web3PackageMock = sinon.mock(web3Package);

        var newHeadsWatcherObject = newHeadsWatcher.watch(web3Package);

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

        web3Package = new AbstractWeb3Object(providerAdapter, ProvidersPackage, null, null);
        web3PackageMock = sinon.mock(web3Package);

        subscription = new SubscriptionsPackage.Subscription({}, web3Package);
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
            .withArgs(web3Package)
            .returns(subscription)
            .once();

        newHeadsWatcher.watch(web3Package);
        newHeadsWatcher.stop();

        expect(newHeadsWatcher.listeners('newHead').length).equal(0);

        subscriptionMock.verify();
        subscriptionsFactoryMock.verify();
    });
});
