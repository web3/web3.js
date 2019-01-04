import * as Utils from 'web3-utils';
import {AbstractWeb3Module} from 'web3-core';
import {formatters} from 'web3-core-helpers';
import {SubscriptionsFactory, LogSubscription, AbstractSubscription} from 'web3-core-subscriptions';
import {GetPastLogsMethod} from 'web3-core-method';
import {AbiCoder} from 'web3-eth-abi';
import {Accounts} from 'web3-eth-accounts';
import {Ens} from 'web3-eth-ens';
import {Iban} from 'web3-eth-iban';
import {Personal} from 'web3-eth-personal';
import {Network} from 'web3-net';
import EthModuleFactory from '../../src/factories/EthModuleFactory';
import MethodFactory from '../../src/factories/MethodFactory';
import Eth from '../../src/Eth';

// Mocks
jest.mock('AbstractSubscription');
jest.mock('LogSubscription');
jest.mock('GetPastLogsMethod');
jest.mock('AbstractWeb3Module');
jest.mock('SubscriptionsFactory');
jest.mock('AbiCoder');
jest.mock('Accounts');
jest.mock('Ens');
jest.mock('Personal');
jest.mock('Network');
jest.mock('Utils');
jest.mock('formatters');
jest.mock('../../src/factories/MethodFactory');
jest.mock('../../src/factories/EthModuleFactory');

/**
 * Eth test
 */
describe('EthTest', () => {
    let eth,
        methodFactoryMock,
        ethModuleFactoryMock,
        networkMock,
        accountsMock,
        personalMock,
        abiCoderMock,
        ensMock,
        subscriptionsFactoryMock,
        abstractWeb3ModuleMock;

    beforeEach(() => {
        new MethodFactory();
        methodFactoryMock = MethodFactory.mock.instances[0];

        new EthModuleFactory();
        ethModuleFactoryMock = EthModuleFactory.mock.instances[0];

        new Network();
        networkMock = Network.mock.instances[0];

        new Accounts();
        accountsMock = Accounts.mock.instances[0];

        new Personal();
        personalMock = Personal.mock.instances[0];

        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];

        new Ens();
        ensMock = Ens.mock.instances[0];

        new SubscriptionsFactory();
        subscriptionsFactoryMock = SubscriptionsFactory.mock.instances[0];

        eth = new Eth(
            {},
            {},
            {},
            methodFactoryMock,
            ethModuleFactoryMock,
            networkMock,
            accountsMock,
            personalMock,
            Iban,
            abiCoderMock,
            ensMock,
            Utils,
            formatters,
            subscriptionsFactoryMock,
            {}
        );

        abstractWeb3ModuleMock = AbstractWeb3Module.mock.instances[0];
        eth.methodFactory = methodFactoryMock;
    });

    it('constructor check', () => {
        expect(eth.ethModuleFactory)
            .toEqual(ethModuleFactoryMock);

        expect(eth.net)
            .toEqual(networkMock);

        expect(eth.accounts)
            .toEqual(accountsMock);

        expect(eth.personal)
            .toEqual(personalMock);

        expect(eth.Iban)
            .toEqual(Iban);

        expect(eth.abi)
            .toEqual(abiCoderMock);

        expect(eth.ens)
            .toEqual(ensMock);

        expect(eth.utils)
            .toEqual(Utils);

        expect(eth.formatters)
            .toEqual(formatters);

        expect(eth.initiatedContracts)
            .toEqual([]);

        expect(eth.Contract)
            .toBeInstanceOf(Function);
    });

    it('calls clearSubscriptions', () => {
        eth.clearSubscriptions();

        expect(abstractWeb3ModuleMock.clearSubscriptions)
            .toHaveBeenCalled();
    });

    it('sets the defaultGasPrice property', () => {
        eth.initiatedContracts = [{defaultGasPrice: 20}];
        eth.defaultGasPrice = 10;

        expect(eth.initiatedContracts[0].defaultGasPrice)
            .toEqual(10);

        expect(abstractWeb3ModuleMock.defaultGasPrice)
            .toEqual(10);

        expect(networkMock.defaultGasPrice)
            .toEqual(10);

        expect(personalMock.defaultGasPrice)
            .toEqual(10);
    });

    it('sets the defaultGas property', () => {
        eth.initiatedContracts = [{defaultGas: 20}];
        eth.defaultGas = 10;

        expect(eth.initiatedContracts[0].defaultGas)
            .toEqual(10);

        expect(abstractWeb3ModuleMock.defaultGas)
            .toEqual(10);

        expect(networkMock.defaultGas)
            .toEqual(10);

        expect(personalMock.defaultGas)
            .toEqual(10);
    });

    it('sets the transactionBlockTimeout property', () => {
        eth.initiatedContracts = [{transactionBlockTimeout: 20}];
        eth.transactionBlockTimeout = 10;

        expect(eth.initiatedContracts[0].transactionBlockTimeout)
            .toEqual(10);

        expect(abstractWeb3ModuleMock.transactionBlockTimeout)
            .toEqual(10);

        expect(networkMock.transactionBlockTimeout)
            .toEqual(10);

        expect(personalMock.transactionBlockTimeout)
            .toEqual(10);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        eth.initiatedContracts = [{transactionConfirmationBlocks: 20}];
        eth.transactionConfirmationBlocks = 10;

        expect(eth.initiatedContracts[0].transactionConfirmationBlocks)
            .toEqual(10);

        expect(abstractWeb3ModuleMock.transactionConfirmationBlocks)
            .toEqual(10);

        expect(networkMock.transactionConfirmationBlocks)
            .toEqual(10);

        expect(personalMock.transactionConfirmationBlocks)
            .toEqual(10);
    });

    it('sets the transactionPollingTimeout property', () => {
        eth.initiatedContracts = [{transactionPollingTimeout: 20}];
        eth.transactionPollingTimeout = 10;

        expect(eth.initiatedContracts[0].transactionPollingTimeout)
            .toEqual(10);

        expect(abstractWeb3ModuleMock.transactionPollingTimeout)
            .toEqual(10);

        expect(networkMock.transactionPollingTimeout)
            .toEqual(10);

        expect(personalMock.transactionPollingTimeout)
            .toEqual(10);
    });

    it('sets the defaultAccount property', () => {
        eth.initiatedContracts = [{defaultAccount: '0x0'}];
        eth.defaultAccount = '0x1';

        expect(eth.initiatedContracts[0].defaultAccount)
            .toEqual('0x1');

        expect(abstractWeb3ModuleMock.defaultAccount)
            .toEqual('0x1');

        expect(networkMock.defaultAccount)
            .toEqual('0x1');

        expect(personalMock.defaultAccount)
            .toEqual('0x1');
    });

    it('sets the defaultBlock property', () => {
        eth.initiatedContracts = [{defaultBlock: 20}];
        eth.defaultBlock = 10;

        expect(eth.initiatedContracts[0].defaultBlock)
            .toEqual(10);

        expect(abstractWeb3ModuleMock.defaultBlock)
            .toEqual(10);

        expect(networkMock.defaultBlock)
            .toEqual(10);

        expect(personalMock.defaultBlock)
            .toEqual(10);
    });

    it('calls subscribe wih "logs" as type', () => {
        subscriptionsFactoryMock.createLogSubscription = jest.fn();

        new LogSubscription();
        const logSubscriptionMock = LogSubscription.mock.instances[0];

        logSubscriptionMock.subscribe
            .mockReturnValueOnce(logSubscriptionMock);

        new GetPastLogsMethod();
        const getPastLogsMethodMock = GetPastLogsMethod.mock.instances[0];

        subscriptionsFactoryMock.createLogSubscription
            .mockReturnValueOnce(logSubscriptionMock);

        methodFactoryMock.createMethod
            .mockReturnValueOnce(getPastLogsMethodMock);

        const callback = () => {};

        expect(eth.subscribe('logs', {}, callback))
            .toBeInstanceOf(LogSubscription);

        expect(subscriptionsFactoryMock.createLogSubscription)
            .toHaveBeenCalledWith({}, eth, getPastLogsMethodMock);

        expect(logSubscriptionMock.subscribe)
            .toHaveBeenCalledWith(callback);

        expect(methodFactoryMock.createMethod)
            .toHaveBeenCalledWith('getPastLogs');
    });

    it('calls subscribe wih "newBlockHeaders" as type', () => {
        subscriptionsFactoryMock.createNewHeadsSubscription = jest.fn();

        new AbstractSubscription();
        const abstractSubscriptionMock = AbstractSubscription.mock.instances[0];

        abstractSubscriptionMock.subscribe
            .mockReturnValueOnce(abstractSubscriptionMock);

        subscriptionsFactoryMock.createNewHeadsSubscription
            .mockReturnValueOnce(abstractSubscriptionMock);

        const callback = () => {};

        expect(eth.subscribe('newBlockHeaders', {}, callback))
            .toBeInstanceOf(AbstractSubscription);

        expect(subscriptionsFactoryMock.createNewHeadsSubscription)
            .toHaveBeenCalledWith(eth);

        expect(abstractSubscriptionMock.subscribe)
            .toHaveBeenCalledWith(callback);
    });

    it('calls subscribe wih "pendingTransactions" as type', () => {
        subscriptionsFactoryMock.createNewPendingTransactionsSubscription = jest.fn();

        new AbstractSubscription();
        const abstractSubscriptionMock = AbstractSubscription.mock.instances[0];

        abstractSubscriptionMock.subscribe
            .mockReturnValueOnce(abstractSubscriptionMock);

        subscriptionsFactoryMock.createNewPendingTransactionsSubscription
            .mockReturnValueOnce(abstractSubscriptionMock);

        const callback = () => {};

        expect(eth.subscribe('pendingTransactions', {}, callback))
            .toBeInstanceOf(AbstractSubscription);

        expect(subscriptionsFactoryMock.createNewPendingTransactionsSubscription)
            .toHaveBeenCalledWith(eth);

        expect(abstractSubscriptionMock.subscribe)
            .toHaveBeenCalledWith(callback);
    });

    it('calls subscribe wih "syncing" as type', () => {
        subscriptionsFactoryMock.createSyncingSubscription = jest.fn();

        new AbstractSubscription();
        const abstractSubscriptionMock = AbstractSubscription.mock.instances[0];

        abstractSubscriptionMock.subscribe
            .mockReturnValueOnce(abstractSubscriptionMock);

        subscriptionsFactoryMock.createSyncingSubscription
            .mockReturnValueOnce(abstractSubscriptionMock);

        const callback = () => {};

        expect(eth.subscribe('syncing', {}, callback))
            .toBeInstanceOf(AbstractSubscription);

        expect(subscriptionsFactoryMock.createSyncingSubscription)
            .toHaveBeenCalledWith(eth);

        expect(abstractSubscriptionMock.subscribe)
            .toHaveBeenCalledWith(callback);
    });

    it('calls subscribe wih unknown type', () => {
        expect(() => {
            eth.subscribe('NOPE', {}, () => {})
        }).toThrow('Unknown subscription: NOPE');
    });
});
