import {AbstractWeb3Module} from 'web3-core';
import {NewHeadsSubscription} from 'web3-core-subscriptions';
import AbstractMethod from '../../../lib/methods/AbstractMethod';
import AbstractMethodFactory from '../../../lib/factories/AbstractMethodFactory';
import AbstractObservedTransactionMethod from '../../../lib/methods/transaction/AbstractObservedTransactionMethod';
import EthSendTransactionMethod from '../../../src/methods/transaction/EthSendTransactionMethod';
import TransactionObserver from '../../../src/observers/TransactionObserver';
import GetTransactionReceiptMethod from '../../../src/methods/transaction/GetTransactionReceiptMethod';
import GetBlockByNumberMethod from '../../../src/methods/block/GetBlockByNumberMethod';
import ChainIdMethod from '../../../src/methods/network/ChainIdMethod';
import GetTransactionCountMethod from '../../../src/methods/account/GetTransactionCountMethod';

// Mocks
jest.mock('web3-core');
jest.mock('web3-core-subscriptions');
jest.mock('../../../lib/methods/AbstractMethod');
jest.mock('../../../src/methods/block/GetBlockByNumberMethod');
jest.mock('../../../src/methods/transaction/GetTransactionReceiptMethod');
jest.mock('../../../src/observers/TransactionObserver');
jest.mock('../../../src/methods/network/ChainIdMethod');
jest.mock('../../../src/methods/account/GetTransactionCountMethod');

/**
 * AbstractMethodFactory test
 */
describe('AbstractMethodFactoryTest', () => {
    let abstractMethodFactory;

    beforeEach(() => {
        abstractMethodFactory = new AbstractMethodFactory({}, {});

        abstractMethodFactory.methods = {
            send: AbstractMethod,
            sendObserved: AbstractObservedTransactionMethod,
            sendEthObserved: EthSendTransactionMethod
        };
    });

    it('constructor check', () => {
        expect(abstractMethodFactory.utils).toEqual({});

        expect(abstractMethodFactory.formatters).toEqual({});
    });

    it('throws an error on calling the methods property if now methods are defined', () => {
        abstractMethodFactory.methods = null;

        expect(() => {
            // eslint-disable-next-line no-unused-vars
            const methods = abstractMethodFactory.methods;
        }).toThrow('No methods defined for MethodFactory!');
    });

    it('calls hasMethod and returns true', () => {
        abstractMethodFactory = new AbstractMethodFactory({}, {});
        abstractMethodFactory.methods = {call: true};

        expect(abstractMethodFactory.hasMethod('call')).toEqual(true);
    });

    it('calls hasMethod and returns false', () => {
        abstractMethodFactory = new AbstractMethodFactory({}, {});
        abstractMethodFactory.methods = {};

        expect(abstractMethodFactory.hasMethod('call')).toEqual(false);
    });

    it('calls createMethod and returns a object of type AbstractMethod', () => {
        new AbstractWeb3Module();
        const moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        expect(abstractMethodFactory.hasMethod('send')).toEqual(true);

        expect(abstractMethodFactory.createMethod('send', moduleInstanceMock)).toBeInstanceOf(AbstractMethod);

        expect(AbstractMethod).toHaveBeenCalledWith({}, {}, moduleInstanceMock);
    });

    it('calls createMethod and returns a object of type AbstractObservedTransactionMethod', () => {
        new AbstractWeb3Module();
        const moduleInstanceMock = AbstractWeb3Module.mock.instances[0];
        moduleInstanceMock.currentProvider = {supportsSubscriptions: jest.fn()};
        moduleInstanceMock.currentProvider.supportsSubscriptions.mockReturnValueOnce(false);

        expect(abstractMethodFactory.hasMethod('sendObserved')).toEqual(true);

        const observedMethod = abstractMethodFactory.createMethod('sendObserved', moduleInstanceMock);

        expect(observedMethod).toBeInstanceOf(AbstractObservedTransactionMethod);

        expect(moduleInstanceMock.currentProvider.supportsSubscriptions).toHaveBeenCalled();

        expect(GetTransactionReceiptMethod).toHaveBeenCalledTimes(1);

        expect(AbstractObservedTransactionMethod).toHaveBeenCalledTimes(1);

        expect(GetBlockByNumberMethod).toHaveBeenCalledTimes(1);

        expect(NewHeadsSubscription).toHaveBeenCalledTimes(1);

        expect(TransactionObserver).toHaveBeenCalledTimes(1);
    });

    it('calls createMethod and returns a object of type EthSendTransactionMethod', () => {
        new AbstractWeb3Module();
        const moduleInstanceMock = AbstractWeb3Module.mock.instances[0];
        moduleInstanceMock.currentProvider = {supportsSubscriptions: jest.fn()};
        moduleInstanceMock.currentProvider.supportsSubscriptions.mockReturnValueOnce(false);

        expect(abstractMethodFactory.hasMethod('sendEthObserved')).toEqual(true);

        const observedMethod = abstractMethodFactory.createMethod('sendEthObserved', moduleInstanceMock);

        expect(observedMethod).toBeInstanceOf(EthSendTransactionMethod);

        expect(moduleInstanceMock.currentProvider.supportsSubscriptions).toHaveBeenCalled();

        expect(GetTransactionReceiptMethod).toHaveBeenCalledTimes(1);

        expect(GetBlockByNumberMethod).toHaveBeenCalledTimes(1);

        expect(NewHeadsSubscription).toHaveBeenCalledTimes(1);

        expect(TransactionObserver).toHaveBeenCalledTimes(1);

        expect(ChainIdMethod).toHaveBeenCalledTimes(1);

        expect(GetTransactionCountMethod).toHaveBeenCalledTimes(1);
    });

    it('calls createMethod with a socket provider and returns a object of type AbstractObservedTransactionMethod', () => {
        new AbstractWeb3Module();
        const moduleInstanceMock = AbstractWeb3Module.mock.instances[0];
        moduleInstanceMock.currentProvider = {supportsSubscriptions: jest.fn()};
        moduleInstanceMock.currentProvider.supportsSubscriptions.mockReturnValueOnce(true);

        expect(abstractMethodFactory.hasMethod('sendObserved')).toEqual(true);

        const observedMethod = abstractMethodFactory.createMethod('sendObserved', moduleInstanceMock);

        expect(observedMethod).toBeInstanceOf(AbstractObservedTransactionMethod);

        expect(moduleInstanceMock.currentProvider.supportsSubscriptions).toHaveBeenCalled();

        expect(GetTransactionReceiptMethod).toHaveBeenCalledTimes(1);

        expect(AbstractObservedTransactionMethod).toHaveBeenCalledTimes(1);

        expect(GetBlockByNumberMethod).toHaveBeenCalledTimes(1);

        expect(NewHeadsSubscription).toHaveBeenCalledTimes(1);

        expect(TransactionObserver).toHaveBeenCalledTimes(1);
    });
});
