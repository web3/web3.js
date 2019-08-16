import Provider from '../__mocks__/Provider';
import MethodFactory from '../__mocks__/MethodFactory';
import ProviderResolver from '../__mocks__/ProviderResolver';
import AbstractWeb3Module from '../../src/AbstractWeb3Module';

// Mocks
jest.mock('../__mocks__/ProviderResolver');
jest.mock('../__mocks__/Provider');

/**
 * AbstractWeb3Module test
 */
describe('AbstractWeb3ModuleTest', () => {
    let abstractWeb3Module, methodFactoryMock, providerResolverMock, providerMock;

    beforeEach(() => {
        providerResolverMock = new ProviderResolver();
        providerMock = new Provider();
        providerResolverMock.resolve.mockReturnValue(providerMock);

        methodFactoryMock = new MethodFactory();
        methodFactoryMock.hasMethod = jest.fn(() => {
            return false;
        });

        abstractWeb3Module = new AbstractWeb3Module(
            'http://localhost:8545',
            {
                defaultAccount: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
                defaultBlock: 'latest',
                defaultGasPrice: 100,
                defaultGas: 100
            },
            methodFactoryMock,
            {},
            providerResolverMock
        );
    });

    it('constructor check', () => {
        expect(abstractWeb3Module.options).toEqual({
            defaultAccount: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
            defaultBlock: 'latest',
            defaultGasPrice: 100,
            defaultGas: 100
        });

        expect(abstractWeb3Module.BatchRequest).toBeInstanceOf(Function);

        expect(abstractWeb3Module.currentProvider).toEqual(providerMock);

        expect(providerResolverMock.resolve).toHaveBeenCalledWith('http://localhost:8545', {});
    });

    it('gets the BatchRequest property and it is of type BatchRequest', () => {
        const batchRequest = new abstractWeb3Module.BatchRequest();

        expect(batchRequest.constructor.name).toEqual('BatchRequest');

        expect(batchRequest.add).toBeInstanceOf(Function);
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
        expect(abstractWeb3Module.defaultAccount).toEqual('0x03c9a938ff7f54090d0d99e2c6f80380510ea078');
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
        expect(abstractWeb3Module.setProvider('http://newhost')).toEqual(true);

        expect(abstractWeb3Module.currentProvider).toEqual(providerMock);
    });

    it('calls setProvider and throws an error because of the resolver', () => {
        providerResolverMock.resolve = () => {
            throw new Error('Invalid provider');
        };

        expect(() => {
            abstractWeb3Module.setProvider({nope: true});
        }).toThrow('Invalid provider');
    });

    it('calls setProvider and returns false because of the equal host', () => {
        abstractWeb3Module._currentProvider.host = 'http://localhost:8545';

        expect(abstractWeb3Module.setProvider('http://localhost:8545')).toEqual(false);
    });

    it('calls setProvider and returns false because it is the same provider', () => {
        expect(abstractWeb3Module.setProvider(providerMock)).toEqual(false);
    });

    it('calls isSameProvider without a currentProvider set and returns false', () => {
        const provider = {
            constructor: {
                name: 'HttpProvider'
            },
            host: 'HOST1'
        };

        abstractWeb3Module.setProvider(false);
        expect(abstractWeb3Module.isSameProvider(provider)).toEqual(false);
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
        expect(abstractWeb3Module.isSameProvider(providerMock)).toEqual(true);
    });

    it('initiates a HttpProvider with the providers property of the module', () => {
        expect(new AbstractWeb3Module.providers.HttpProvider('http://localhost:7545', {}).host).toEqual(
            'http://localhost:7545'
        );
    });

    it('checks if all providers exists on the static providers property', () => {
        expect(AbstractWeb3Module.providers.HttpProvider).toBeInstanceOf(Function);
        expect(AbstractWeb3Module.providers.WebsocketProvider).toBeInstanceOf(Function);
        expect(AbstractWeb3Module.providers.IpcProvider).toBeInstanceOf(Function);
    });

    it('calls clearSubscriptions with a socket provider and resolves with the expected value', async () => {
        providerMock.supportsSubscriptions.mockReturnValueOnce(true);
        providerMock.clearSubscriptions.mockReturnValueOnce(Promise.resolve(true));

        await expect(abstractWeb3Module.clearSubscriptions('unsubscribe_method')).resolves.toEqual(true);

        expect(providerMock.clearSubscriptions).toHaveBeenCalledWith('unsubscribe_method');
    });

    it('calls clearSubscriptions without a socket provider and resolves with the expected value', async () => {
        providerMock.supportsSubscriptions.mockReturnValueOnce(false);

        await expect(abstractWeb3Module.clearSubscriptions('unsubscribe_method')).resolves.toEqual(true);
    });
});
