import * as Utils from 'conflux-web-utils';
import {formatters} from 'conflux-web-core-helpers';
import {AbstractSubscription, LogSubscription} from 'conflux-web-core-subscriptions';
import {AbiCoder} from 'conflux-web-cfx-abi';
import {Accounts} from 'conflux-web-cfx-accounts';
import {Network} from 'conflux-web-net';
import {ContractModuleFactory} from 'conflux-web-cfx-contract';
import MethodFactory from '../../src/factories/MethodFactory';
import TransactionSigner from '../../src/signers/TransactionSigner';
import SubscriptionsFactory from '../../src/factories/SubscriptionsFactory';
import Cfx from '../../src/Cfx';

// Mocks
jest.mock('conflux-web-core');
jest.mock('conflux-web-core-subscriptions');
jest.mock('conflux-web-cfx-abi');
jest.mock('conflux-web-cfx-accounts');
jest.mock('conflux-web-net');
jest.mock('conflux-web-cfx-contract');
jest.mock('conflux-web-utils');
jest.mock('conflux-web-core-helpers');
jest.mock('../../src/factories/MethodFactory');
jest.mock('../../src/signers/TransactionSigner');
jest.mock('../../src/factories/SubscriptionsFactory');

/**
 * Cfx test
 */
describe('CfxTest', () => {
    let cfx,
        providerMock,
        methodFactoryMock,
        contractModuleFactoryMock,
        networkMock,
        accountsMock,
        abiCoderMock,
        subscriptionsFactoryMock,
        transactionSignerMock;

    beforeEach(() => {
        providerMock = {send: jest.fn(), clearSubscriptions: jest.fn()};

        new MethodFactory();
        methodFactoryMock = MethodFactory.mock.instances[0];

        new ContractModuleFactory();
        contractModuleFactoryMock = ContractModuleFactory.mock.instances[0];

        new Network();
        networkMock = Network.mock.instances[0];

        new Accounts();
        accountsMock = Accounts.mock.instances[0];

        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];

        new SubscriptionsFactory();
        subscriptionsFactoryMock = SubscriptionsFactory.mock.instances[0];

        new TransactionSigner();
        transactionSignerMock = TransactionSigner.mock.instances[0];

        cfx = new Cfx(
            providerMock,
            methodFactoryMock,
            networkMock,
            accountsMock,
            abiCoderMock,
            Utils,
            formatters,
            subscriptionsFactoryMock,
            contractModuleFactoryMock,
            {transactionSigner: transactionSignerMock},
            {}
        );
    });

    it('constructor check', () => {
        expect(cfx.contractModuleFactory).toEqual(contractModuleFactoryMock);

        expect(cfx.net).toEqual(networkMock);

        expect(cfx.accounts).toEqual(accountsMock);

        expect(cfx.abi).toEqual(abiCoderMock);

        expect(cfx.utils).toEqual(Utils);

        expect(cfx.formatters).toEqual(formatters);

        expect(cfx.initiatedContracts).toEqual([]);

        expect(cfx.Contract).toBeInstanceOf(Function);
    });

    it('sets the defaultGasPrice property', () => {
        cfx.initiatedContracts = [{defaultGasPrice: 20}];

        cfx.defaultGasPrice = 10;

        expect(cfx.initiatedContracts[0].defaultGasPrice).toEqual(10);

        expect(cfx.defaultGasPrice).toEqual(10);

        expect(networkMock.defaultGasPrice).toEqual(10);
    });

    it('sets the defaultGas property', () => {
        cfx.initiatedContracts = [{defaultGas: 20}];
        cfx.defaultGas = 10;

        expect(cfx.initiatedContracts[0].defaultGas).toEqual(10);

        expect(cfx.defaultGas).toEqual(10);

        expect(networkMock.defaultGas).toEqual(10);
    });

    it('sets the transactionBlockTimeout property', () => {
        cfx.initiatedContracts = [{transactionBlockTimeout: 20}];
        cfx.transactionBlockTimeout = 10;

        expect(cfx.initiatedContracts[0].transactionBlockTimeout).toEqual(10);

        expect(cfx.transactionBlockTimeout).toEqual(10);

        expect(networkMock.transactionBlockTimeout).toEqual(10);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        cfx.initiatedContracts = [{transactionConfirmationBlocks: 20}];
        cfx.transactionConfirmationBlocks = 10;

        expect(cfx.initiatedContracts[0].transactionConfirmationBlocks).toEqual(10);

        expect(cfx.transactionConfirmationBlocks).toEqual(10);

        expect(networkMock.transactionConfirmationBlocks).toEqual(10);
    });

    it('sets the transactionPollingTimeout property', () => {
        cfx.initiatedContracts = [{transactionPollingTimeout: 20}];
        cfx.transactionPollingTimeout = 10;

        expect(cfx.initiatedContracts[0].transactionPollingTimeout).toEqual(10);

        expect(cfx.transactionPollingTimeout).toEqual(10);

        expect(networkMock.transactionPollingTimeout).toEqual(10);
    });

    it('sets the defaultAccount property', () => {
        cfx.initiatedContracts = [{defaultAccount: '0x0'}];

        Utils.toChecksumAddress.mockReturnValueOnce('0x1');

        cfx.defaultAccount = '0x1';

        expect(cfx.initiatedContracts[0].defaultAccount).toEqual('0x1');

        expect(cfx.defaultAccount).toEqual('0x1');

        expect(networkMock.defaultAccount).toEqual('0x1');

        expect(Utils.toChecksumAddress).toHaveBeenCalledWith('0x1');
    });

    it('sets the defaultBlock property', () => {
        cfx.initiatedContracts = [{defaultBlock: 20}];
        cfx.defaultBlock = 10;

        expect(cfx.initiatedContracts[0].defaultBlock).toEqual(10);

        expect(cfx.defaultBlock).toEqual(10);

        expect(networkMock.defaultBlock).toEqual(10);
    });

    it('calls subscribe wih "logs" as type', () => {
        subscriptionsFactoryMock.createLogSubscription = jest.fn();

        new LogSubscription();
        const logSubscriptionMock = LogSubscription.mock.instances[0];

        logSubscriptionMock.subscribe.mockReturnValueOnce(logSubscriptionMock);

        subscriptionsFactoryMock.getSubscription.mockReturnValueOnce(logSubscriptionMock);

        const callback = () => {};

        expect(cfx.subscribe('logs', {}, callback)).toBeInstanceOf(LogSubscription);

        expect(subscriptionsFactoryMock.getSubscription).toHaveBeenCalledWith(cfx, 'logs', {});

        expect(logSubscriptionMock.subscribe).toHaveBeenCalledWith(callback);
    });

    it('calls subscribe wih "newBlockHeaders" as type', () => {
        subscriptionsFactoryMock.createNewHeadsSubscription = jest.fn();

        new AbstractSubscription();
        const abstractSubscriptionMock = AbstractSubscription.mock.instances[0];

        abstractSubscriptionMock.subscribe.mockReturnValueOnce(abstractSubscriptionMock);

        subscriptionsFactoryMock.getSubscription.mockReturnValueOnce(abstractSubscriptionMock);

        const callback = () => {};

        expect(cfx.subscribe('newBlockHeaders', {}, callback)).toBeInstanceOf(AbstractSubscription);

        expect(subscriptionsFactoryMock.getSubscription).toHaveBeenCalledWith(cfx, 'newBlockHeaders', {});

        expect(abstractSubscriptionMock.subscribe).toHaveBeenCalledWith(callback);
    });

    it('calls subscribe wih "pendingTransactions" as type', () => {
        subscriptionsFactoryMock.createNewPendingTransactionsSubscription = jest.fn();

        new AbstractSubscription();
        const abstractSubscriptionMock = AbstractSubscription.mock.instances[0];

        abstractSubscriptionMock.subscribe.mockReturnValueOnce(abstractSubscriptionMock);

        subscriptionsFactoryMock.getSubscription.mockReturnValueOnce(abstractSubscriptionMock);

        const callback = () => {};

        expect(cfx.subscribe('pendingTransactions', {}, callback)).toBeInstanceOf(AbstractSubscription);

        expect(subscriptionsFactoryMock.getSubscription).toHaveBeenCalledWith(cfx, 'pendingTransactions', {});

        expect(abstractSubscriptionMock.subscribe).toHaveBeenCalledWith(callback);
    });

    it('calls subscribe wih "syncing" as type', () => {
        subscriptionsFactoryMock.createSyncingSubscription = jest.fn();

        new AbstractSubscription();
        const abstractSubscriptionMock = AbstractSubscription.mock.instances[0];

        abstractSubscriptionMock.subscribe.mockReturnValueOnce(abstractSubscriptionMock);

        subscriptionsFactoryMock.getSubscription.mockReturnValueOnce(abstractSubscriptionMock);

        const callback = () => {};

        expect(cfx.subscribe('syncing', {}, callback)).toBeInstanceOf(AbstractSubscription);

        expect(subscriptionsFactoryMock.getSubscription).toHaveBeenCalledWith(cfx, 'syncing', {});

        expect(abstractSubscriptionMock.subscribe).toHaveBeenCalledWith(callback);
    });

    it('calls the Contract factory method with options from the constructor', () => {
        contractModuleFactoryMock.createContract.mockReturnValueOnce({});

        cfx.currentProvider = providerMock;
        expect(new cfx.Contract([], '0x0', {data: '', from: '0x0', gas: '0x0', gasPrice: '0x0'})).toEqual({});

        expect(cfx.initiatedContracts).toHaveLength(1);

        expect(contractModuleFactoryMock.createContract).toHaveBeenCalledWith(providerMock, cfx.accounts, [], '0x0', {
            defaultAccount: '0x0',
            defaultBlock: cfx.defaultBlock,
            defaultGas: '0x0',
            defaultGasPrice: '0x0',
            transactionBlockTimeout: cfx.transactionBlockTimeout,
            transactionConfirmationBlocks: cfx.transactionConfirmationBlocks,
            transactionPollingTimeout: cfx.transactionPollingTimeout,
            transactionSigner: cfx.transactionSigner,
            data: ''
        });
    });

    it('calls the Contract factory method without options from the constructor', () => {
        contractModuleFactoryMock.createContract.mockReturnValueOnce({});

        cfx.currentProvider = providerMock;
        expect(new cfx.Contract([], '0x0', {})).toEqual({});

        expect(cfx.initiatedContracts).toHaveLength(1);

        expect(contractModuleFactoryMock.createContract).toHaveBeenCalledWith(providerMock, cfx.accounts, [], '0x0', {
            defaultAccount: cfx.defaultAccount,
            defaultBlock: cfx.defaultBlock,
            defaultGas: cfx.defaultGas,
            defaultGasPrice: cfx.defaultGasPrice,
            transactionBlockTimeout: cfx.transactionBlockTimeout,
            transactionConfirmationBlocks: cfx.transactionConfirmationBlocks,
            transactionPollingTimeout: cfx.transactionPollingTimeout,
            transactionSigner: cfx.transactionSigner,
            data: undefined
        });
    });
});
