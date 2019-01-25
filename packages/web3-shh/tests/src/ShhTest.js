import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {AbstractSubscription, SubscriptionsFactory} from 'web3-core-subscriptions';
import {
    AddPrivateKeyMethod,
    AddSymKeyMethod,
    DeleteKeyPairMethod,
    DeleteMessageFilterMethod,
    DeleteSymKeyMethod,
    GenerateSymKeyFromPasswordMethod,
    GetFilterMessagesMethod,
    GetInfoMethod,
    GetPrivateKeyMethod,
    GetPublicKeyMethod,
    GetSymKeyMethod,
    HasKeyPairMethod,
    HasSymKeyMethod,
    MarkTrustedPeerMethod,
    MethodModuleFactory,
    NewKeyPairMethod,
    NewMessageFilterMethod,
    NewSymKeyMethod,
    PostMethod,
    SetMaxMessageSizeMethod,
    SetMinPoWMethod,
    ShhVersionMethod
} from 'web3-core-method';
import {Network} from 'web3-net';
import {HttpProvider, ProviderDetector, ProviderResolver, ProvidersModuleFactory} from 'web3-providers';
import MethodFactory from '../../src/factories/MethodFactory';
import Shh from '../../src/Shh';

// Mocks
jest.mock('HttpProvider');
jest.mock('ProvidersModuleFactory');
jest.mock('ProviderDetector');
jest.mock('ProviderResolver');
jest.mock('MethodModuleFactory');
jest.mock('SubscriptionsFactory');
jest.mock('AbstractSubscription');
jest.mock('Network');
jest.mock('Utils');
jest.mock('formatters');

/**
 * Shh test
 */
describe('ShhTest', () => {
    let shh,
        providerMock,
        providersModuleFactoryMock,
        providerDetectorMock,
        providerResolverMock,
        methodModuleFactoryMock,
        methodFactory,
        networkMock,
        subscriptionsFactoryMock;

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

        new SubscriptionsFactory();
        subscriptionsFactoryMock = SubscriptionsFactory.mock.instances[0];

        new Network();
        networkMock = Network.mock.instances[0];

        shh = new Shh(
            providerMock,
            providersModuleFactoryMock,
            methodModuleFactoryMock,
            methodFactory,
            subscriptionsFactoryMock,
            networkMock,
            {}
        );
    });

    it('constructor check', () => {
        expect(shh.subscriptionsFactory).toEqual(subscriptionsFactoryMock);

        expect(shh.net).toEqual(networkMock);
    });

    it('JSON-RPC methods check', () => {
        expect(shh.methodFactory.methods).toEqual({
            getVersion: ShhVersionMethod,
            getInfo: GetInfoMethod,
            setMaxMessageSize: SetMaxMessageSizeMethod,
            setMinPoW: SetMinPoWMethod,
            markTrustedPeer: MarkTrustedPeerMethod,
            newKeyPair: NewKeyPairMethod,
            addPrivateKey: AddPrivateKeyMethod,
            deleteKeyPair: DeleteKeyPairMethod,
            hasKeyPair: HasKeyPairMethod,
            getPublicKey: GetPublicKeyMethod,
            getPrivateKey: GetPrivateKeyMethod,
            newSymKey: NewSymKeyMethod,
            addSymKey: AddSymKeyMethod,
            generateSymKeyFromPassword: GenerateSymKeyFromPasswordMethod,
            hasSymKey: HasSymKeyMethod,
            getSymKey: GetSymKeyMethod,
            deleteSymKey: DeleteSymKeyMethod,
            newMessageFilter: NewMessageFilterMethod,
            getFilterMessages: GetFilterMessagesMethod,
            deleteMessageFilter: DeleteMessageFilterMethod,
            post: PostMethod
        });
    });

    it('calls the subscribe method with the method string "messages" and it returns a object of type ShhMessagesSubscription', () => {
        const callback = jest.fn();

        subscriptionsFactoryMock.createShhMessagesSubscription = jest.fn();

        new AbstractSubscription();
        const shhMessagesSubscriptionMock = AbstractSubscription.mock.instances[0];

        shhMessagesSubscriptionMock.subscribe.mockReturnValueOnce(shhMessagesSubscriptionMock);

        subscriptionsFactoryMock.createShhMessagesSubscription.mockReturnValueOnce(shhMessagesSubscriptionMock);

        expect(shh.subscribe('messages', {}, callback)).toEqual(shhMessagesSubscriptionMock);

        expect(subscriptionsFactoryMock.createShhMessagesSubscription).toHaveBeenCalledWith({}, shh);
    });

    it('calls the subscribe method with a unknown method string and it throws an error', () => {
        expect(() => {
            shh.subscribe('error', {}, () => {});
        }).toThrow('Unknown subscription: error');
    });

    it('calls setProvider and returns true', () => {
        networkMock.setProvider = jest.fn();
        networkMock.setProvider.mockReturnValueOnce(true);

        expect(shh.setProvider('provider', 'net')).toEqual(true);

        expect(networkMock.setProvider).toHaveBeenCalledWith('provider', 'net');
    });

    it('calls setProvider and returns false', () => {
        networkMock.setProvider = jest.fn();
        networkMock.setProvider.mockReturnValueOnce(false);

        expect(shh.setProvider('provider', 'net')).toEqual(false);

        expect(networkMock.setProvider).toHaveBeenCalledWith('provider', 'net');
    });

    it('sets the defaultGasPrice property', () => {
        shh.defaultGasPrice = 10;

        expect(shh.defaultGasPrice).toEqual(10);
    });

    it('sets the defaultGas property', () => {
        shh.defaultGas = 10;

        expect(shh.defaultGas).toEqual(10);
    });

    it('sets the transactionBlockTimeout property', () => {
        shh.transactionBlockTimeout = 10;

        expect(shh.transactionBlockTimeout).toEqual(10);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        shh.transactionConfirmationBlocks = 10;

        expect(shh.transactionConfirmationBlocks).toEqual(10);
    });

    it('sets the transactionPollingTimeout property', () => {
        shh.transactionPollingTimeout = 10;

        expect(shh.transactionPollingTimeout).toEqual(10);
    });

    it('sets the defaultAccount property', () => {
        Utils.toChecksumAddress.mockReturnValue('0x2');

        shh.defaultAccount = '0x1';

        expect(shh.defaultAccount).toEqual('0x2');

        expect(Utils.toChecksumAddress).toHaveBeenCalledWith('0x1');
    });

    it('sets the defaultBlock property', () => {
        shh.defaultBlock = 10;

        expect(shh.defaultBlock).toEqual(10);
    });
});
