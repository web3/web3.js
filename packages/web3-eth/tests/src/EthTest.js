import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {AbstractSubscription, LogSubscription, SubscriptionsFactory} from 'web3-core-subscriptions';
import {
    CallMethod,
    EstimateGasMethod,
    GetAccountsMethod,
    GetBalanceMethod,
    GetBlockMethod,
    GetBlockNumberMethod,
    GetBlockTransactionCountMethod,
    GetBlockUncleCountMethod,
    GetCodeMethod,
    GetCoinbaseMethod,
    GetGasPriceMethod,
    GetHashrateMethod,
    GetNodeInfoMethod,
    GetPastLogsMethod,
    GetProtocolVersionMethod,
    GetStorageAtMethod,
    GetTransactionCountMethod,
    GetTransactionFromBlockMethod,
    GetTransactionMethod,
    GetTransactionReceipt,
    GetUncleMethod,
    GetWorkMethod,
    IsMiningMethod,
    IsSyncingMethod,
    MethodModuleFactory,
    RequestAccountsMethod,
    SendRawTransactionMethod,
    SendTransactionMethod,
    SignMethod,
    SignTransactionMethod,
    SubmitWorkMethod
} from 'web3-core-method';
import {AbiCoder} from 'web3-eth-abi';
import {Accounts} from 'web3-eth-accounts';
import {Ens} from 'web3-eth-ens';
import {Iban} from 'web3-eth-iban';
import {Personal} from 'web3-eth-personal';
import {Network} from 'web3-net';
import {AbstractContract, ContractModuleFactory} from 'web3-eth-contract';
import {HttpProvider, ProviderDetector, ProviderResolver, ProvidersModuleFactory} from 'web3-providers';
import MethodFactory from '../../src/factories/MethodFactory';
import TransactionSigner from '../../src/signers/TransactionSigner';
import Eth from '../../src/Eth';

// Mocks
jest.mock('HttpProvider');
jest.mock('ProvidersModuleFactory');
jest.mock('ProviderDetector');
jest.mock('ProviderResolver');
jest.mock('MethodModuleFactory');
jest.mock('AbstractSubscription');
jest.mock('LogSubscription');
jest.mock('GetPastLogsMethod');
jest.mock('SubscriptionsFactory');
jest.mock('AbiCoder');
jest.mock('Accounts');
jest.mock('Ens');
jest.mock('Personal');
jest.mock('Network');
jest.mock('Utils');
jest.mock('formatters');
jest.mock('AbstractContract');
jest.mock('ContractModuleFactory');

/**
 * Eth test
 */
describe('EthTest', () => {
    let eth,
        providerMock,
        providersModuleFactoryMock,
        providerDetectorMock,
        providerResolverMock,
        methodModuleFactoryMock,
        methodFactory,
        contractModuleFactoryMock,
        networkMock,
        accountsMock,
        personalMock,
        abiCoderMock,
        ensMock,
        subscriptionsFactoryMock,
        transactionSignerMock;

    beforeEach(() => {
        new HttpProvider();
        providerMock = HttpProvider.mock.instances[0];

        new ProvidersModuleFactory();
        providersModuleFactoryMock = ProvidersModuleFactory.mock.instances[0];

        new ProviderDetector();
        providerDetectorMock = ProviderDetector.mock.instances[0];
        providerDetectorMock.detect = jest.fn(() => {
            return null;
        });

        new ProviderResolver();
        providerResolverMock = ProviderResolver.mock.instances[0];
        providerResolverMock.resolve = jest.fn(() => {
            return providerMock;
        });

        providersModuleFactoryMock.createProviderDetector.mockReturnValueOnce(providerDetectorMock);

        providersModuleFactoryMock.createProviderResolver.mockReturnValueOnce(providerResolverMock);

        new MethodModuleFactory();
        methodModuleFactoryMock = MethodModuleFactory.mock.instances[0];
        methodModuleFactoryMock.createMethodProxy = jest.fn();

        methodFactory = new MethodFactory(methodModuleFactoryMock, Utils, formatters);

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
            providersModuleFactoryMock,
            methodModuleFactoryMock,
            methodFactory,
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
            transactionSignerMock,
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

    it('JSON-RPC methods check', () => {
        expect(eth.methodFactory.methods).toEqual({
            getNodeInfo: GetNodeInfoMethod,
            getProtocolVersion: GetProtocolVersionMethod,
            getCoinbase: GetCoinbaseMethod,
            isMining: IsMiningMethod,
            getHashrate: GetHashrateMethod,
            isSyncing: IsSyncingMethod,
            getGasPrice: GetGasPriceMethod,
            getAccounts: GetAccountsMethod,
            getBlockNumber: GetBlockNumberMethod,
            getBalance: GetBalanceMethod,
            getStorageAt: GetStorageAtMethod,
            getCode: GetCodeMethod,
            getBlock: GetBlockMethod,
            getUncle: GetUncleMethod,
            getBlockTransactionCount: GetBlockTransactionCountMethod,
            getBlockUncleCount: GetBlockUncleCountMethod,
            getTransaction: GetTransactionMethod,
            getTransactionFromBlock: GetTransactionFromBlockMethod,
            getTransactionReceipt: GetTransactionReceipt,
            getTransactionCount: GetTransactionCountMethod,
            sendSignedTransaction: SendRawTransactionMethod,
            signTransaction: SignTransactionMethod,
            sendTransaction: SendTransactionMethod,
            sign: SignMethod,
            call: CallMethod,
            estimateGas: EstimateGasMethod,
            submitWork: SubmitWorkMethod,
            getWork: GetWorkMethod,
            getPastLogs: GetPastLogsMethod,
            requestAccounts: RequestAccountsMethod
        });
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

        Utils.toChecksumAddress.mockReturnValue('0x2');

        eth.defaultAccount = '0x1';

        expect(eth.initiatedContracts[0].defaultAccount).toEqual('0x2');

        expect(eth.defaultAccount).toEqual('0x2');

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
        new GetPastLogsMethod();
        const getPastLogsMethodMock = GetPastLogsMethod.mock.instances[0];

        const methodFactoryMock = {
            createMethod: jest.fn(() => {
                return getPastLogsMethodMock;
            })
        };

        eth.methodFactory = methodFactoryMock;

        providersModuleFactoryMock.createProviderDetector.mockReturnValueOnce(providerDetectorMock);

        providersModuleFactoryMock.createProviderResolver.mockReturnValueOnce(providerResolverMock);

        subscriptionsFactoryMock.createLogSubscription = jest.fn();

        new LogSubscription();
        const logSubscriptionMock = LogSubscription.mock.instances[0];

        logSubscriptionMock.subscribe.mockReturnValueOnce(logSubscriptionMock);

        subscriptionsFactoryMock.createLogSubscription.mockReturnValueOnce(logSubscriptionMock);

        const callback = () => {};

        expect(eth.subscribe('logs', {}, callback)).toBeInstanceOf(LogSubscription);

        expect(subscriptionsFactoryMock.createLogSubscription).toHaveBeenCalledWith({}, eth, getPastLogsMethodMock);

        expect(logSubscriptionMock.subscribe).toHaveBeenCalledWith(callback);

        expect(methodFactoryMock.createMethod).toHaveBeenCalledWith('getPastLogs');
    });

    it('calls subscribe wih "newBlockHeaders" as type', () => {
        subscriptionsFactoryMock.createNewHeadsSubscription = jest.fn();

        new AbstractSubscription();
        const abstractSubscriptionMock = AbstractSubscription.mock.instances[0];

        abstractSubscriptionMock.subscribe.mockReturnValueOnce(abstractSubscriptionMock);

        subscriptionsFactoryMock.createNewHeadsSubscription.mockReturnValueOnce(abstractSubscriptionMock);

        const callback = () => {};

        expect(eth.subscribe('newBlockHeaders', {}, callback)).toBeInstanceOf(AbstractSubscription);

        expect(subscriptionsFactoryMock.createNewHeadsSubscription).toHaveBeenCalledWith(eth);

        expect(abstractSubscriptionMock.subscribe).toHaveBeenCalledWith(callback);
    });

    it('calls subscribe wih "pendingTransactions" as type', () => {
        subscriptionsFactoryMock.createNewPendingTransactionsSubscription = jest.fn();

        new AbstractSubscription();
        const abstractSubscriptionMock = AbstractSubscription.mock.instances[0];

        abstractSubscriptionMock.subscribe.mockReturnValueOnce(abstractSubscriptionMock);

        subscriptionsFactoryMock.createNewPendingTransactionsSubscription.mockReturnValueOnce(abstractSubscriptionMock);

        const callback = () => {};

        expect(eth.subscribe('pendingTransactions', {}, callback)).toBeInstanceOf(AbstractSubscription);

        expect(subscriptionsFactoryMock.createNewPendingTransactionsSubscription).toHaveBeenCalledWith(eth);

        expect(abstractSubscriptionMock.subscribe).toHaveBeenCalledWith(callback);
    });

    it('calls subscribe wih "syncing" as type', () => {
        subscriptionsFactoryMock.createSyncingSubscription = jest.fn();

        new AbstractSubscription();
        const abstractSubscriptionMock = AbstractSubscription.mock.instances[0];

        abstractSubscriptionMock.subscribe.mockReturnValueOnce(abstractSubscriptionMock);

        subscriptionsFactoryMock.createSyncingSubscription.mockReturnValueOnce(abstractSubscriptionMock);

        const callback = () => {};

        expect(eth.subscribe('syncing', {}, callback)).toBeInstanceOf(AbstractSubscription);

        expect(subscriptionsFactoryMock.createSyncingSubscription).toHaveBeenCalledWith(eth);

        expect(abstractSubscriptionMock.subscribe).toHaveBeenCalledWith(callback);
    });

    it('calls subscribe wih unknown type', () => {
        expect(() => {
            eth.subscribe('NOPE', {}, () => {});
        }).toThrow('Unknown subscription: NOPE');
    });

    it('calls the Contract factory method from the constructor', () => {
        contractModuleFactoryMock.createContract.mockReturnValueOnce(new AbstractContract());

        expect(new eth.Contract()).toBeInstanceOf(AbstractContract);

        expect(eth.initiatedContracts).toHaveLength(1);
    });

    it('calls setProvider and returns true', () => {
        eth.initiatedContracts = [
            {
                setProvider: jest.fn(() => {
                    return true;
                })
            }
        ];

        networkMock.setProvider = jest.fn();
        personalMock.setProvider = jest.fn();
        accountsMock.setProvider = jest.fn();

        networkMock.setProvider.mockReturnValueOnce(true);

        personalMock.setProvider.mockReturnValueOnce(true);

        accountsMock.setProvider.mockReturnValueOnce(true);

        expect(eth.setProvider('provider', 'net')).toEqual(true);

        expect(eth.initiatedContracts[0].setProvider).toHaveBeenCalledWith('provider', 'net');

        expect(networkMock.setProvider).toHaveBeenCalledWith('provider', 'net');

        expect(personalMock.setProvider).toHaveBeenCalledWith('provider', 'net');

        expect(accountsMock.setProvider).toHaveBeenCalledWith('provider', 'net');
    });
});
