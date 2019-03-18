import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {AbstractSubscription, LogSubscription} from 'web3-core-subscriptions';
import {AbiCoder} from 'web3-eth-abi';
import {Accounts} from 'web3-eth-accounts';
import {Ens} from 'web3-eth-ens';
import {Iban} from 'web3-eth-iban';
import {Personal} from 'web3-eth-personal';
import {Network} from 'web3-net';
import {ContractModuleFactory} from 'web3-eth-contract';
import MethodFactory from '../../src/factories/MethodFactory';
import TransactionSigner from '../../src/signers/TransactionSigner';
import SubscriptionsFactory from '../../src/factories/SubscriptionsFactory';
import Eth from '../../src/Eth';

// Mocks
jest.mock('AbstractWeb3Module');
jest.mock('AbstractSubscription');
jest.mock('LogSubscription');
jest.mock('AbiCoder');
jest.mock('Accounts');
jest.mock('Ens');
jest.mock('Personal');
jest.mock('Network');
jest.mock('Utils');
jest.mock('formatters');
jest.mock('ContractModuleFactory');
jest.mock('../../src/factories/MethodFactory');
jest.mock('../../src/signers/TransactionSigner');
jest.mock('../../src/factories/SubscriptionsFactory');

/**
 * Eth test
 */
describe('EthTest', () => {
    let eth,
        providerMock,
        methodFactoryMock,
        contractModuleFactoryMock,
        networkMock,
        accountsMock,
        personalMock,
        abiCoderMock,
        ensMock,
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

        new Personal();
        personalMock = Personal.mock.instances[0];

        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];

        new Ens();
        ensMock = Ens.mock.instances[0];

        new SubscriptionsFactory();
        subscriptionsFactoryMock = SubscriptionsFactory.mock.instances[0];

        new TransactionSigner();
        transactionSignerMock = TransactionSigner.mock.instances[0];

        eth = new Eth(
            providerMock,
            methodFactoryMock,
            networkMock,
            accountsMock,
            personalMock,
            Iban,
            abiCoderMock,
            ensMock,
            Utils,
            formatters,
            subscriptionsFactoryMock,
            contractModuleFactoryMock,
            {transactionSigner: transactionSignerMock},
            {}
        );
    });

    it('constructor check', () => {
        expect(eth.contractModuleFactory).toEqual(contractModuleFactoryMock);

        expect(eth.net).toEqual(networkMock);

        expect(eth.accounts).toEqual(accountsMock);

        expect(eth.personal).toEqual(personalMock);

        expect(eth.Iban).toEqual(Iban);

        expect(eth.abi).toEqual(abiCoderMock);

        expect(eth.ens).toEqual(ensMock);

        expect(eth.utils).toEqual(Utils);

        expect(eth.formatters).toEqual(formatters);

        expect(eth.initiatedContracts).toEqual([]);

        expect(eth.Contract).toBeInstanceOf(Function);
    });

    it('sets the defaultGasPrice property', () => {
        eth.initiatedContracts = [{defaultGasPrice: 20}];

        eth.defaultGasPrice = 10;

        expect(eth.initiatedContracts[0].defaultGasPrice).toEqual(10);

        expect(eth.defaultGasPrice).toEqual(10);

        expect(networkMock.defaultGasPrice).toEqual(10);

        expect(personalMock.defaultGasPrice).toEqual(10);
    });

    it('sets the defaultGas property', () => {
        eth.initiatedContracts = [{defaultGas: 20}];
        eth.defaultGas = 10;

        expect(eth.initiatedContracts[0].defaultGas).toEqual(10);

        expect(eth.defaultGas).toEqual(10);

        expect(networkMock.defaultGas).toEqual(10);

        expect(personalMock.defaultGas).toEqual(10);
    });

    it('sets the transactionBlockTimeout property', () => {
        eth.initiatedContracts = [{transactionBlockTimeout: 20}];
        eth.transactionBlockTimeout = 10;

        expect(eth.initiatedContracts[0].transactionBlockTimeout).toEqual(10);

        expect(eth.transactionBlockTimeout).toEqual(10);

        expect(networkMock.transactionBlockTimeout).toEqual(10);

        expect(personalMock.transactionBlockTimeout).toEqual(10);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        eth.initiatedContracts = [{transactionConfirmationBlocks: 20}];
        eth.transactionConfirmationBlocks = 10;

        expect(eth.initiatedContracts[0].transactionConfirmationBlocks).toEqual(10);

        expect(eth.transactionConfirmationBlocks).toEqual(10);

        expect(networkMock.transactionConfirmationBlocks).toEqual(10);

        expect(personalMock.transactionConfirmationBlocks).toEqual(10);
    });

    it('sets the transactionPollingTimeout property', () => {
        eth.initiatedContracts = [{transactionPollingTimeout: 20}];
        eth.transactionPollingTimeout = 10;

        expect(eth.initiatedContracts[0].transactionPollingTimeout).toEqual(10);

        expect(eth.transactionPollingTimeout).toEqual(10);

        expect(networkMock.transactionPollingTimeout).toEqual(10);

        expect(personalMock.transactionPollingTimeout).toEqual(10);
    });

    it('sets the defaultAccount property', () => {
        eth.initiatedContracts = [{defaultAccount: '0x0'}];

        Utils.toChecksumAddress.mockReturnValueOnce('0x1');

        eth.defaultAccount = '0x1';

        expect(eth.initiatedContracts[0].defaultAccount).toEqual('0x1');

        expect(eth.defaultAccount).toEqual('0x1');

        expect(networkMock.defaultAccount).toEqual('0x1');

        expect(personalMock.defaultAccount).toEqual('0x1');

        expect(Utils.toChecksumAddress).toHaveBeenCalledWith('0x1');
    });

    it('sets the defaultBlock property', () => {
        eth.initiatedContracts = [{defaultBlock: 20}];
        eth.defaultBlock = 10;

        expect(eth.initiatedContracts[0].defaultBlock).toEqual(10);

        expect(eth.defaultBlock).toEqual(10);

        expect(networkMock.defaultBlock).toEqual(10);

        expect(personalMock.defaultBlock).toEqual(10);
    });

    it('calls subscribe wih "logs" as type', () => {
        subscriptionsFactoryMock.createLogSubscription = jest.fn();

        new LogSubscription();
        const logSubscriptionMock = LogSubscription.mock.instances[0];

        logSubscriptionMock.subscribe.mockReturnValueOnce(logSubscriptionMock);

        subscriptionsFactoryMock.getSubscription.mockReturnValueOnce(logSubscriptionMock);

        const callback = () => {};

        expect(eth.subscribe('logs', {}, callback)).toBeInstanceOf(LogSubscription);

        expect(subscriptionsFactoryMock.getSubscription).toHaveBeenCalledWith(eth, 'logs', {});

        expect(logSubscriptionMock.subscribe).toHaveBeenCalledWith(callback);
    });

    it('calls subscribe wih "newBlockHeaders" as type', () => {
        subscriptionsFactoryMock.createNewHeadsSubscription = jest.fn();

        new AbstractSubscription();
        const abstractSubscriptionMock = AbstractSubscription.mock.instances[0];

        abstractSubscriptionMock.subscribe.mockReturnValueOnce(abstractSubscriptionMock);

        subscriptionsFactoryMock.getSubscription.mockReturnValueOnce(abstractSubscriptionMock);

        const callback = () => {};

        expect(eth.subscribe('newBlockHeaders', {}, callback)).toBeInstanceOf(AbstractSubscription);

        expect(subscriptionsFactoryMock.getSubscription).toHaveBeenCalledWith(eth, 'newBlockHeaders', {});

        expect(abstractSubscriptionMock.subscribe).toHaveBeenCalledWith(callback);
    });

    it('calls subscribe wih "pendingTransactions" as type', () => {
        subscriptionsFactoryMock.createNewPendingTransactionsSubscription = jest.fn();

        new AbstractSubscription();
        const abstractSubscriptionMock = AbstractSubscription.mock.instances[0];

        abstractSubscriptionMock.subscribe.mockReturnValueOnce(abstractSubscriptionMock);

        subscriptionsFactoryMock.getSubscription.mockReturnValueOnce(abstractSubscriptionMock);

        const callback = () => {};

        expect(eth.subscribe('pendingTransactions', {}, callback)).toBeInstanceOf(AbstractSubscription);

        expect(subscriptionsFactoryMock.getSubscription).toHaveBeenCalledWith(eth, 'pendingTransactions', {});

        expect(abstractSubscriptionMock.subscribe).toHaveBeenCalledWith(callback);
    });

    it('calls subscribe wih "syncing" as type', () => {
        subscriptionsFactoryMock.createSyncingSubscription = jest.fn();

        new AbstractSubscription();
        const abstractSubscriptionMock = AbstractSubscription.mock.instances[0];

        abstractSubscriptionMock.subscribe.mockReturnValueOnce(abstractSubscriptionMock);

        subscriptionsFactoryMock.getSubscription.mockReturnValueOnce(abstractSubscriptionMock);

        const callback = () => {};

        expect(eth.subscribe('syncing', {}, callback)).toBeInstanceOf(AbstractSubscription);

        expect(subscriptionsFactoryMock.getSubscription).toHaveBeenCalledWith(eth, 'syncing', {});

        expect(abstractSubscriptionMock.subscribe).toHaveBeenCalledWith(callback);
    });

    it('calls the Contract factory method with options from the constructor', () => {
        contractModuleFactoryMock.createContract.mockReturnValueOnce({});

        eth.currentProvider = providerMock;
        expect(new eth.Contract([], '0x0', {data: '', from: '0x0', gas: '0x0', gasPrice: '0x0'})).toEqual({});

        expect(eth.initiatedContracts).toHaveLength(1);

        expect(contractModuleFactoryMock.createContract).toHaveBeenCalledWith(providerMock, eth.accounts, [], '0x0', {
            defaultAccount: '0x0',
            defaultBlock: eth.defaultBlock,
            defaultGas: '0x0',
            defaultGasPrice: '0x0',
            transactionBlockTimeout: eth.transactionBlockTimeout,
            transactionConfirmationBlocks: eth.transactionConfirmationBlocks,
            transactionPollingTimeout: eth.transactionPollingTimeout,
            transactionSigner: eth.transactionSigner,
            data: ''
        });
    });

    it('calls the Contract factory method without options from the constructor', () => {
        contractModuleFactoryMock.createContract.mockReturnValueOnce({});

        eth.currentProvider = providerMock;
        expect(new eth.Contract([], '0x0', {})).toEqual({});

        expect(eth.initiatedContracts).toHaveLength(1);

        expect(contractModuleFactoryMock.createContract).toHaveBeenCalledWith(providerMock, eth.accounts, [], '0x0', {
            defaultAccount: eth.defaultAccount,
            defaultBlock: eth.defaultBlock,
            defaultGas: eth.defaultGas,
            defaultGasPrice: eth.defaultGasPrice,
            transactionBlockTimeout: eth.transactionBlockTimeout,
            transactionConfirmationBlocks: eth.transactionConfirmationBlocks,
            transactionPollingTimeout: eth.transactionPollingTimeout,
            transactionSigner: eth.transactionSigner,
            data: undefined
        });
    });
});
