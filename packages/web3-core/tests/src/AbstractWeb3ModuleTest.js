import {
    ProvidersModuleFactory,
    ProviderDetector,
    ProviderAdapterResolver,
    BatchRequest,
    SocketProviderAdapter
} from 'web3-providers';
import AbstractWeb3Module from '../../src/AbstractWeb3Module';
import MethodProxy from '../__mocks__/MethodProxy';
import MethodModuleFactory from '../__mocks__/MethodModuleFactory';
import MethodFactory from '../__mocks__/MethodFactory';

// Mocks
jest.mock('BatchRequest');
jest.mock('ProviderDetector');
jest.mock('ProvidersModuleFactory');
jest.mock('ProviderAdapterResolver');
jest.mock('SocketProviderAdapter');

/**
 * AbstractWeb3Module test
 */
describe('AbstractWeb3ModuleTest', () => {
    let abstractWeb3Module,
        providerDetector,
        providerDetectorMock,
        providerAdapterResolver,
        providerAdapterResolverMock,
        providersModuleFactory,
        providersModuleFactoryMock,
        providerAdapter,
        providerAdapterMock,
        methodModuleFactoryMock,
        methodFactoryMock;

    beforeEach(() => {
        methodFactoryMock = new MethodFactory();
        methodModuleFactoryMock = new MethodModuleFactory();

        providerAdapter = new SocketProviderAdapter({});
        providerAdapterMock = SocketProviderAdapter.mock.instances[0];
        providerAdapterMock.host = 'HTTP_PROVIDER';
        providerAdapterMock.provider = {};
        providerAdapterMock.subscriptions = [];

        providersModuleFactory = new ProvidersModuleFactory();
        providersModuleFactoryMock = ProvidersModuleFactory.mock.instances[0];

        providerDetector = new ProviderDetector();
        providerDetectorMock = ProviderDetector.mock.instances[0];

        providerAdapterResolver = new ProviderAdapterResolver();
        providerAdapterResolverMock = ProviderAdapterResolver.mock.instances[0];

        providerAdapterResolverMock.resolve = jest.fn(() => {
            return providerAdapterMock;
        });

        providerDetectorMock.detect = jest.fn(() => {
            return false;
        });

        providersModuleFactory.createProviderAdapterResolver
            .mockReturnValueOnce(providerAdapterResolverMock);

        providersModuleFactory.createProviderDetector
            .mockReturnValueOnce(providerDetectorMock);

        methodFactoryMock.hasMethod = jest.fn(() => {
            return false;
        });

        methodModuleFactoryMock.createMethodProxy = jest.fn((target, methodFactory) => {
            return new MethodProxy(target);
        });

        abstractWeb3Module = new AbstractWeb3Module(
            'HTTP',
            providersModuleFactoryMock,
            {},
            methodModuleFactoryMock,
            methodFactoryMock,
            {
                defaultAccount: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
                defaultBlock: 'latest',
                defaultGasPrice: 100,
                defaultGas: 100,
            }
        );
    });

    it('constructor throws error on missing required parameters', () => {
        expect(() => {
            new AbstractWeb3Module()
        }).toThrow('Missing parameter: provider');

        expect(() => {
            new AbstractWeb3Module('')
        }).toThrow('Missing parameter: ProvidersModuleFactory');

        expect(() => {
            new AbstractWeb3Module('', '')
        }).toThrow('Missing parameter: providers');

        expect(() => {
            new AbstractWeb3Module('', '', '')
        }).toThrow('Missing parameter: MethodModuleFactory');
    });

    it('constructor check', () => {
        expect(abstractWeb3Module.defaultAccount)
            .toEqual('0x03C9A938fF7f54090d0d99e2c6f80380510Ea078');

        expect(abstractWeb3Module.defaultBlock)
            .toEqual('latest');

        expect(abstractWeb3Module.transactionBlockTimeout)
            .toEqual(50);

        expect(abstractWeb3Module.transactionConfirmationBlocks)
            .toEqual(24);

        expect(abstractWeb3Module.transactionPollingTimeout)
            .toEqual(15);

        expect(abstractWeb3Module.defaultGasPrice)
            .toEqual(100);

        expect(abstractWeb3Module.defaultGas)
            .toEqual(100);

        expect(abstractWeb3Module.BatchRequest)
            .toBeInstanceOf(Function);

        expect(abstractWeb3Module.methodFactory)
            .toEqual(methodFactoryMock);

        expect(abstractWeb3Module.providerDetector)
            .toEqual(providerDetectorMock);

        expect(abstractWeb3Module.currentProvider)
            .toEqual(providerAdapterMock);

        expect(methodModuleFactoryMock.createMethodProxy)
            .toHaveBeenCalledWith(abstractWeb3Module, methodFactoryMock);

        expect(providerAdapterResolverMock.resolve)
            .toHaveBeenCalledWith('HTTP');
    });

    it('property BatchRequest is of type BatchRequest', () => {
        const batchRequestMock = new BatchRequest();

        providersModuleFactory.createBatchRequest
            .mockReturnValueOnce(batchRequestMock);

        expect(new abstractWeb3Module.BatchRequest())
            .toBeInstanceOf(BatchRequest);

        expect(providersModuleFactory.createBatchRequest)
            .toHaveBeenCalledWith(abstractWeb3Module.currentProvider);
    });

    it('set defaultAccount validates the address and throws error', () => {
        try {
            abstractWeb3Module.defaultAccount = '0';
        } catch (error) {
            expect(error.message)
                .toEqual('Given address "0" is not a valid Ethereum address.');
        }
    });

    it('set defaultAccount validates the address and sets the value', () => {
        abstractWeb3Module.defaultAccount = '0x03c9a938ff7f54090d0d99e2c6f80380510ea078';
        expect(abstractWeb3Module.defaultAccount )
            .toEqual('0x03C9A938fF7f54090d0d99e2c6f80380510Ea078');
    });

    it('currentProvider is read-only', () => {
        try {
            abstractWeb3Module.currentProvider = false;
        } catch (error) {
            expect(error.message)
                .toEqual('The property currentProvider is read-only!');
        }
    });

    it('setProvider returns true and sets the provider as currentProvider', () => {
        expect(abstractWeb3Module.setProvider('SOCKET_PROVIDER'))
            .toEqual(true);

        expect(providerAdapterResolverMock.resolve)
            .toHaveBeenNthCalledWith(1, 'HTTP');

        expect(providerAdapterResolverMock.resolve)
            .toHaveBeenNthCalledWith(2, 'SOCKET_PROVIDER', undefined);

        expect(abstractWeb3Module.currentProvider)
            .toEqual(providerAdapterMock);
    });

    it('setProvider returns true, sets the provider and clears the subscriptions', () => {
        providerAdapterMock.subscriptions = [0,1];
        providerAdapterMock.clearSubscriptions = jest.fn();

        expect(abstractWeb3Module.setProvider('SOCKET_PROVIDER'))
            .toEqual(true);

        expect(providerAdapterResolverMock.resolve)
            .toHaveBeenNthCalledWith(1, 'HTTP');

        expect(providerAdapterResolverMock.resolve)
            .toHaveBeenNthCalledWith(2, 'SOCKET_PROVIDER', undefined);

        expect(providerAdapterMock.clearSubscriptions)
            .toHaveBeenCalled();

        expect(abstractWeb3Module.currentProvider)
            .toEqual(providerAdapterMock);
    });

    it('setProvider throws error because of the resolver', () => {
        providerAdapterResolverMock.resolve = jest.fn(() => {
            throw new Error('Invalid provider');
        });

        providerAdapterMock.provider.constructor = {name: 'SocketProviderAdapter'};

        const provider = {
            constructor: {
                name: 'SocketProviderAdapter'
            },
            host: 'SocketProvider'
        };

        expect(() => {
            abstractWeb3Module.setProvider(provider);
        }).toThrow('Invalid provider');

        expect(providerAdapterResolverMock.resolve)
            .toHaveBeenCalledWith(provider, undefined);
    });

    it('setProvider returns false because it is the equal provider', () => {
        expect(abstractWeb3Module.setProvider('HTTP_PROVIDER'))
            .toEqual(false)
    });

    it('setProvider returns false because they have the same constructor name', () => {
        const provider = {
            constructor: {
                name: 'SocketProviderAdapter'
            },
            host: 'SocketProvider'
        };

        providerAdapterMock.provider.constructor = {name: 'HttpProvider'};

        expect(abstractWeb3Module.setProvider(provider))
            .toEqual(true)
    });
});
