import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {HttpProvider, ProvidersModuleFactory, ProviderDetector, ProviderResolver} from 'web3-providers';
import {
    MethodModuleFactory,
    GetAccountsMethod,
    NewAccountMethod,
    UnlockAccountMethod,
    LockAccountMethod,
    ImportRawKeyMethod,
    PersonalSendTransactionMethod,
    PersonalSignTransactionMethod,
    PersonalSignMethod,
    EcRecoverMethod
} from 'web3-core-method';
import {Network} from 'web3-net';
import {AbstractWeb3Module} from 'web3-core';
import MethodFactory from '../../src/factories/MethodFactory';
import Personal from '../../src/Personal';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('HttpProvider');
jest.mock('ProvidersModuleFactory');
jest.mock('ProviderDetector');
jest.mock('ProviderResolver');
jest.mock('MethodModuleFactory');
jest.mock('Network');

/**
 * Personal test
 */
describe('PersonalTest', () => {
    let personal,
        providerMock,
        providersModuleFactoryMock,
        providerDetectorMock,
        providerResolverMock,
        methodModuleFactoryMock,
        methodFactory,
        networkMock;

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

        new Network();
        networkMock = Network.mock.instances[0];

        personal = new Personal(
            providerMock,
            providersModuleFactoryMock,
            methodModuleFactoryMock,
            methodFactory,
            networkMock,
            Utils,
            formatters,
            {}
        );
    });

    it('constructor check', () => {
        expect(personal.currentProvider).toEqual(providerMock);

        expect(personal.providersModuleFactory).toEqual(providersModuleFactoryMock);

        expect(personal.methodFactory).toEqual(methodFactory);

        expect(personal.net).toEqual(networkMock);

        expect(personal.utils).toEqual(Utils);

        expect(personal.formatters).toEqual(formatters);

        expect(personal).toBeInstanceOf(AbstractWeb3Module);
    });

    it('JSON-RPC methods check', () => {
        expect(personal.methodFactory.methods).toEqual({
            getAccounts: GetAccountsMethod,
            newAccount: NewAccountMethod,
            unlockAccount: UnlockAccountMethod,
            lockAccount: LockAccountMethod,
            importRawKey: ImportRawKeyMethod,
            sendTransaction: PersonalSendTransactionMethod,
            signTransaction: PersonalSignTransactionMethod,
            sign: PersonalSignMethod,
            ecRecover: EcRecoverMethod
        });
    });

    it('calls setProvider and returns true', () => {
        networkMock.setProvider = jest.fn();
        networkMock.setProvider.mockReturnValueOnce(true);

        expect(personal.setProvider('provider', 'net')).toEqual(true);

        expect(networkMock.setProvider).toHaveBeenCalledWith('provider', 'net');
    });

    it('sets the defaultGasPrice property', () => {
        personal.defaultGasPrice = 10;

        expect(personal.defaultGasPrice).toEqual(10);

        expect(networkMock.defaultGasPrice).toEqual(10);
    });

    it('sets the defaultGas property', () => {
        personal.defaultGas = 10;

        expect(personal.defaultGas).toEqual(10);

        expect(networkMock.defaultGas).toEqual(10);
    });

    it('sets the transactionBlockTimeout property', () => {
        personal.transactionBlockTimeout = 10;

        expect(personal.transactionBlockTimeout).toEqual(10);

        expect(networkMock.transactionBlockTimeout).toEqual(10);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        personal.transactionConfirmationBlocks = 10;

        expect(personal.transactionConfirmationBlocks).toEqual(10);

        expect(networkMock.transactionConfirmationBlocks).toEqual(10);
    });

    it('sets the transactionPollingTimeout property', () => {
        personal.transactionPollingTimeout = 10;

        expect(personal.transactionPollingTimeout).toEqual(10);

        expect(networkMock.transactionPollingTimeout).toEqual(10);
    });

    it('sets the defaultAccount property', () => {
        Utils.toChecksumAddress.mockReturnValue('0x2');

        personal.defaultAccount = '0x0';

        expect(personal.defaultAccount).toEqual('0x2');

        expect(networkMock.defaultAccount).toEqual('0x0');

        expect(Utils.toChecksumAddress).toHaveBeenCalledWith('0x0');
    });

    it('sets the defaultBlock property', () => {
        personal.defaultBlock = 1;

        expect(personal.defaultBlock).toEqual(1);

        expect(networkMock.defaultBlock).toEqual(1);
    });
});
