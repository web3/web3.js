import AbstractWeb3Module from '../../__mocks__/AbstractWeb3Module';
import SocketProvider from '../../__mocks__/SocketProvider';
import AbstractProviderSubscription from '../../../lib/subscriptions/AbstractProviderSubscription';

// Mocks
jest.mock('../../__mocks__/SocketProvider');

/**
 * AbstractProviderSubscription test
 */
describe('AbstractProviderSubscriptionTest', () => {
    let abstractProviderSubscription, moduleInstanceMock;

    beforeEach(() => {
        moduleInstanceMock = new AbstractWeb3Module();
        moduleInstanceMock.currentProvider = new SocketProvider();
        moduleInstanceMock.currentProvider.on = jest.fn();

        abstractProviderSubscription = new AbstractProviderSubscription('eventName', {}, {}, moduleInstanceMock);
    });

    it('constructor check', () => {
        expect(abstractProviderSubscription.method).toEqual('eventName');

        expect(abstractProviderSubscription.utils).toEqual({});

        expect(abstractProviderSubscription.formatters).toEqual({});

        expect(abstractProviderSubscription.moduleInstance).toEqual(moduleInstanceMock);

        expect(abstractProviderSubscription.id).toEqual(null);

        expect(abstractProviderSubscription.beforeSubscription).toBeInstanceOf(Function);
    });

    it('calls onNewSubscriptionItem and calls the callback with the given value', (done) => {
        abstractProviderSubscription.callback = jest.fn((error, value) => {
            expect(error).toEqual(false);

            expect(value).toEqual('string');

            done();
        });

        abstractProviderSubscription.onNewSubscriptionItem('string');
    });

    it('calls onNewSubscriptionItem and emits the data event with the given value', (done) => {
        abstractProviderSubscription.on('data', (value) => {
            expect(value).toEqual('string');

            done();
        });

        abstractProviderSubscription.onNewSubscriptionItem('string');
    });

    it('calls subscribe and emits a error from the provider error listener', (done) => {
        moduleInstanceMock.currentProvider.on = jest.fn((event, callback) => {
            if (event === 'error') {
                expect(event).toEqual('error');

                callback(new Error('ERROR'));
            }
        });

        const callback = jest.fn();

        abstractProviderSubscription.on('error', (error) => {
            expect(error).toEqual(new Error('ERROR'));

            expect(moduleInstanceMock.currentProvider.on).toHaveBeenCalledTimes(2);

            expect(callback).toHaveBeenCalledWith(new Error('ERROR'), null);

            done();
        });

        abstractProviderSubscription.subscribe(callback);
    });

    it('calls subscribe with a callback and it returns the expected value', (done) => {
        moduleInstanceMock.currentProvider.on = jest.fn((event, callback) => {
            if (event === 'eventName') {
                expect(event).toEqual('eventName');

                callback('string');
            }
        });

        const callback = jest.fn((error, response) => {
            expect(error).toEqual(false);

            expect(response).toEqual('string');

            expect(moduleInstanceMock.currentProvider.on).toHaveBeenCalledTimes(1);

            done();
        });

        abstractProviderSubscription.subscribe(callback);
    });

    it('calls subscribe and emits the data event', (done) => {
        moduleInstanceMock.currentProvider.on = jest.fn((event, callback) => {
            if (event === 'eventName') {
                expect(event).toEqual('eventName');

                callback('string');
            }
        });

        abstractProviderSubscription.on('data', (data) => {
            expect(data).toEqual('string');

            expect(moduleInstanceMock.currentProvider.on).toHaveBeenCalledTimes(1);

            done();
        });

        abstractProviderSubscription.subscribe();
    });

    it('calls unsubscribe and returns with a resolved promise', async () => {
        moduleInstanceMock.currentProvider.removeListener = jest.fn();
        abstractProviderSubscription.on('data', () => {});

        const callback = jest.fn();
        const response = await abstractProviderSubscription.unsubscribe(callback);

        expect(response).toEqual(true);

        expect(callback).toHaveBeenCalledWith(false, true);

        expect(abstractProviderSubscription.listenerCount('data')).toEqual(0);

        expect(moduleInstanceMock.currentProvider.removeListener).toHaveBeenNthCalledWith(
            1,
            'eventName',
            abstractProviderSubscription.onNewSubscriptionItem
        );

        expect(moduleInstanceMock.currentProvider.removeListener).toHaveBeenNthCalledWith(
            2,
            'error',
            abstractProviderSubscription.onError
        );
    });

    it('calls unsubscribe and returns with a rejected promise', async () => {
        moduleInstanceMock.currentProvider.removeListener = jest.fn((event, callback) => {
            expect(event).toEqual('eventName');

            throw new Error('ERROR');
        });

        await expect(abstractProviderSubscription.unsubscribe(jest.fn())).rejects.toThrow('ERROR');
    });
});
