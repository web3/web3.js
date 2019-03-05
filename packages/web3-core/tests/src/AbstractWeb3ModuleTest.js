import {
    BatchRequest,
    ProviderDetector,
    ProviderResolver,
    ProvidersModuleFactory,
    WebsocketProvider,
    HttpProvider,
    IpcProvider
} from 'web3-providers';
import AbstractWeb3Module from '../../src/AbstractWeb3Module';
import MethodProxy from '../__mocks__/MethodProxy';
import MethodModuleFactory from '../__mocks__/MethodModuleFactory';
import MethodFactory from '../__mocks__/MethodFactory';

// Mocks
jest.mock('BatchRequest');
jest.mock('ProviderDetector');
jest.mock('ProvidersModuleFactory');
jest.mock('ProviderResolver');
jest.mock('WebsocketProvider');
jest.mock('HttpProvider');
jest.mock('IpcProvider');

/**
 * AbstractWeb3Module test
 */
describe('AbstractWeb3ModuleTest', () => {
    let abstractWeb3Module,
        providerDetectorMock,
        providerResolverMock,
        providersModuleFactoryMock,
        providerMock,
        methodModuleFactoryMock,
        methodFactoryMock;

    beforeEach(() => {
        methodFactoryMock = new MethodFactory();
        methodModuleFactoryMock = new MethodModuleFactory();

        new WebsocketProvider('HOST', {});
        providerMock = WebsocketProvider.mock.instances[0];
        providerMock.host = 'HOST';

        new ProvidersModuleFactory();
        providersModuleFactoryMock = ProvidersModuleFactory.mock.instances[0];

        new ProviderDetector();
        providerDetectorMock = ProviderDetector.mock.instances[0];

        new ProviderResolver();
        providerResolverMock = ProviderResolver.mock.instances[0];

        providerResolverMock.resolve = jest.fn(() => {
            return providerMock;
        });

        providerDetectorMock.detect = jest.fn(() => {
            return false;
        });

        providersModuleFactoryMock.createProviderResolver.mockReturnValueOnce(providerResolverMock);

        providersModuleFactoryMock.createProviderDetector.mockReturnValueOnce(providerDetectorMock);

        methodFactoryMock.hasMethod = jest.fn(() => {
            return false;
        });

        methodModuleFactoryMock.createMethodProxy = jest.fn((target, methodFactory) => {
            return new MethodProxy(target);
        });

        abstractWeb3Module = new AbstractWeb3Module(
            'WS',
            providersModuleFactoryMock,
            methodModuleFactoryMock,
            methodFactoryMock,
            {
                defaultAccount: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
                defaultBlock: 'latest',
                defaultGasPrice: 100,
                defaultGas: 100
            }
        );
    });

    it('constructor check', () => {
        expect(abstractWeb3Module.defaultAccount).toEqual('0x03C9A938fF7f54090d0d99e2c6f80380510Ea078');

        expect(abstractWeb3Module.defaultBlock).toEqual('latest');

        expect(abstractWeb3Module.transactionBlockTimeout).toEqual(50);

        expect(abstractWeb3Module.transactionConfirmationBlocks).toEqual(24);

        expect(abstractWeb3Module.transactionPollingTimeout).toEqual(750);

        expect(abstractWeb3Module.defaultGasPrice).toEqual(100);

        expect(abstractWeb3Module.defaultGas).toEqual(100);

        expect(abstractWeb3Module.BatchRequest).toBeInstanceOf(Function);

        expect(abstractWeb3Module.methodFactory).toEqual(methodFactoryMock);

        expect(abstractWeb3Module.providerDetector).toEqual(providerDetectorMock);

        expect(abstractWeb3Module.currentProvider).toEqual(providerMock);

        expect(methodModuleFactoryMock.createMethodProxy).toHaveBeenCalledWith(abstractWeb3Module, methodFactoryMock);

        expect(providerResolverMock.resolve).toHaveBeenCalledWith('WS', null);
    });

    it('gets the BatchRequest property and it is of type BatchRequest', () => {
        const batchRequestMock = new BatchRequest();

        providersModuleFactoryMock.createBatchRequest.mockReturnValueOnce(batchRequestMock);

        expect(new abstractWeb3Module.BatchRequest()).toBeInstanceOf(BatchRequest);

        expect(providersModuleFactoryMock.createBatchRequest).toHaveBeenCalledWith(abstractWeb3Module);
    });

    it('sets the defaultAccount property validates the address and throws error', () => {
        try {
            abstractWeb3Module.defaultAccount = '0';
        } catch (error) {
            expect(error.message).toEqual('Given address "0" is not a valid Ethereum address.');
        }
    });

    it('sets the defaultAccount property and validates the address', () => {
        abstractWeb3Module.defaultAccount = '0x03c9a938ff7f54090d0d99e2c6f80380510ea078';
        expect(abstractWeb3Module.defaultAccount).toEqual('0x03C9A938fF7f54090d0d99e2c6f80380510Ea078');
    });

    it('sets the defaultBlock property', () => {
        abstractWeb3Module.defaultBlock = 'latest';
        expect(abstractWeb3Module.defaultBlock).toEqual('latest');
    });

    it('sets the transactionBlockTimeout property', () => {
        abstractWeb3Module.transactionBlockTimeout = 0;
        expect(abstractWeb3Module.transactionBlockTimeout).toEqual(0);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        abstractWeb3Module.transactionConfirmationBlocks = 0;
        expect(abstractWeb3Module.transactionConfirmationBlocks).toEqual(0);
    });

    it('sets the transactionPollingTimeout property', () => {
        abstractWeb3Module.transactionPollingTimeout = 0;
        expect(abstractWeb3Module.transactionPollingTimeout).toEqual(0);
    });

    it('sets the defaultGasPrice property', () => {
        abstractWeb3Module.defaultGasPrice = 0;
        expect(abstractWeb3Module.defaultGasPrice).toEqual(0);
    });

    it('sets the defaultGas property', () => {
        abstractWeb3Module.defaultGas = 0;
        expect(abstractWeb3Module.defaultGas).toEqual(0);
    });

    it('gets the currentProvider property who is read-only', () => {
        try {
            abstractWeb3Module.currentProvider = false;
        } catch (error) {
            expect(error.message).toEqual('The property currentProvider is read-only!');
        }
    });

    it('calls setProvider returns true and sets the provider as currentProvider', () => {
        expect(abstractWeb3Module.setProvider('SOCKET_PROVIDER')).toEqual(true);

        expect(providerResolverMock.resolve).toHaveBeenNthCalledWith(1, 'WS', null);

        expect(providerResolverMock.resolve).toHaveBeenNthCalledWith(2, 'SOCKET_PROVIDER', undefined);

        expect(abstractWeb3Module.currentProvider).toEqual(providerMock);
    });

    it('calls setProvider returns true, sets the provider and clears the subscriptions', () => {
        providerMock.subscriptions = [0, 1];
        providerMock.clearSubscriptions = jest.fn();

        expect(abstractWeb3Module.setProvider('SOCKET_PROVIDER')).toEqual(true);

        expect(providerResolverMock.resolve).toHaveBeenNthCalledWith(1, 'WS', null);

        expect(providerResolverMock.resolve).toHaveBeenNthCalledWith(2, 'SOCKET_PROVIDER', undefined);

        expect(providerMock.clearSubscriptions).toHaveBeenCalled();

        expect(abstractWeb3Module.currentProvider).toEqual(providerMock);
    });

    it('calls setProvider and throws an error because of the resolver', () => {
        providerResolverMock.resolve = jest.fn(() => {
            throw new Error('Invalid provider');
        });

        const provider = {
            constructor: {
                name: 'WebsocketProvider'
            },
            host: 'WS'
        };

        expect(() => {
            abstractWeb3Module.setProvider(provider);
        }).toThrow('Invalid provider');

        expect(providerResolverMock.resolve).toHaveBeenCalledWith(provider, undefined);
    });

    it('calls setProvider and returns false because of the equal host', () => {
        expect(abstractWeb3Module.setProvider('HOST')).toEqual(false);
    });

    it('calls setProvider and returns false because of the same constructor name', () => {
        const provider = {
            constructor: {
                name: 'WebsocketProvider'
            },
            host: 'HOST'
        };

        expect(abstractWeb3Module.setProvider(provider)).toEqual(false);
    });

    it('calls isSameProvider and returns false', () => {
        const provider = {
            constructor: {
                name: 'HttpProvider'
            },
            host: 'HOST1'
        };

        expect(abstractWeb3Module.isSameProvider(provider)).toEqual(false);
    });

    it('calls isSameProvider and returns true', () => {
        const provider = {
            constructor: {
                name: 'WebsocketProvider'
            },
            host: 'HOST'
        };

        expect(abstractWeb3Module.isSameProvider(provider)).toEqual(true);
    });

    it('initiates a HttpProvider with the providers property of the module', () => {
        const url = 'HOST';
        const options = {};

        const httpProvider = new AbstractWeb3Module.providers.HttpProvider(url, options);

        expect(httpProvider).toBeInstanceOf(HttpProvider);
    });

    it('initiates a WebsocketProvider with the providers property of the module', () => {
        const url = 'HOST';
        const options = {};

        const websocketProvider = new AbstractWeb3Module.providers.WebsocketProvider(url, options);

        expect(websocketProvider).toBeInstanceOf(WebsocketProvider);
    });

    it('initiates a IpcProvider with the providers property of the module', () => {
        const path = 'HOST';
        const net = {};

        const ipcProvider = new AbstractWeb3Module.providers.IpcProvider(path, net);

        expect(ipcProvider).toBeInstanceOf(IpcProvider);
    });
});
