import {AbstractContract} from 'web3-eth-contract';
import {Network} from 'web3-net';
import namehash from 'eth-ens-namehash';
import {RESOLVER_ABI} from '../../../ressources/ABI/Resolver';
import Registry from '../../../src/contracts/Registry';

// Mocks
jest.mock('web3-net');
jest.mock('eth-ens-namehash');

/**
 * Registry test
 */
describe('RegistryTest', () => {
    let registry, providerMock, contractModuleFactoryMock, networkMock;

    beforeEach(() => {
        providerMock = {send: jest.fn(), clearSubscriptions: jest.fn()};
        contractModuleFactoryMock = {
            createAbiMapper: () => {
                return {map: jest.fn()};
            },
            createMethodFactory: jest.fn(),
            createEventSubscriptionsProxy: jest.fn(),
            createMethodsProxy: jest.fn()
        };

        new Network();
        networkMock = Network.mock.instances[0];

        networkMock.getBlockByNumber = jest.fn(() => {
            return Promise.resolve({timestamp: new Date() / 1000});
        });

        networkMock.getNetworkType = jest.fn(() => {
            return Promise.resolve('rinkeby');
        });

        registry = new Registry(
            providerMock,
            contractModuleFactoryMock,
            {},
            {},
            {},
            {},
            {transactionSigner: true},
            networkMock
        );

        registry.methods = {};
        registry.events = {};
    });

    it('constructor check', () => {
        expect(registry).toBeInstanceOf(AbstractContract);

        expect(registry.net).toEqual(networkMock);

        expect(registry.resolverContract).toEqual(null);

        expect(registry.resolverName).toEqual(null);
    });

    it('sets the transactionSigner property', () => {
        registry.resolverContract = {transactionSigner: true};

        registry.transactionSigner = {};

        expect(registry.transactionSigner).toEqual({});

        expect(registry.resolverContract.transactionSigner).toEqual({});
    });

    it('sets the transactionSigner property and throws the expected error', () => {
        try {
            registry.transactionSigner = {type: 'TransactionSigner'};
        } catch (error) {
            expect(error).toEqual(new Error('Invalid TransactionSigner given!'));
        }
    });

    it('sets the defaultGasPrice property', () => {
        registry.resolverContract = {defaultGasPrice: 0};

        registry.defaultGasPrice = 10;

        expect(registry.resolverContract.defaultGasPrice).toEqual(10);

        expect(registry.defaultGasPrice).toEqual(10);
    });

    it('sets the defaultGas property', () => {
        registry.resolverContract = {defaultGas: 0};

        registry.defaultGas = 10;

        expect(registry.resolverContract.defaultGas).toEqual(10);

        expect(registry.defaultGas).toEqual(10);
    });

    it('sets the transactionBlockTimeout property', () => {
        registry.resolverContract = {transactionBlockTimeout: 0};

        registry.transactionBlockTimeout = 10;

        expect(registry.resolverContract.transactionBlockTimeout).toEqual(10);

        expect(registry.transactionBlockTimeout).toEqual(10);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        registry.resolverContract = {transactionConfirmationBlocks: 0};

        registry.transactionConfirmationBlocks = 10;

        expect(registry.resolverContract.transactionConfirmationBlocks).toEqual(10);

        expect(registry.transactionConfirmationBlocks).toEqual(10);
    });

    it('sets the transactionPollingTimeout property', () => {
        registry.resolverContract = {transactionPollingTimeout: 0};

        registry.transactionPollingTimeout = 10;

        expect(registry.resolverContract.transactionPollingTimeout).toEqual(10);

        expect(registry.transactionPollingTimeout).toEqual(10);
    });

    it('sets the defaultAccount property', () => {
        registry.resolverContract = {defaultAccount: '0x0'};

        registry.defaultAccount = '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B';

        expect(registry.resolverContract.defaultAccount).toEqual('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');

        expect(registry.defaultAccount).toEqual('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');
    });

    it('sets the defaultBlock property', () => {
        registry.resolverContract = {defaultBlock: '0x0'};

        registry.defaultBlock = '0x1';

        expect(registry.resolverContract.defaultBlock).toEqual('0x1');

        expect(registry.defaultBlock).toEqual('0x1');
    });

    it('calls owner and returns a resolved promise', async () => {
        const call = jest.fn(() => {
            return Promise.resolve(true);
        });

        const callback = jest.fn();

        registry.address = '0x0';

        registry.methods.owner = jest.fn((hash) => {
            expect(hash).toEqual('0x0');

            return call;
        });

        namehash.hash = jest.fn((name) => {
            expect(name).toEqual('name');

            return '0x0';
        });

        await expect(registry.owner('name', callback)).resolves.toEqual(true);

        expect(callback).toHaveBeenCalledWith(false, true);
    });

    it('calls owner and returns a rejected promise', async () => {
        const call = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
        });

        const callback = jest.fn();

        registry.address = '0x0';

        registry.methods.owner = jest.fn((hash) => {
            expect(hash).toEqual('0x0');

            return call;
        });

        namehash.hash = jest.fn((name) => {
            expect(name).toEqual('name');

            return '0x0';
        });

        await expect(registry.owner('name', callback)).rejects.toEqual(new Error('ERROR'));

        expect(callback).toHaveBeenCalledWith(new Error('ERROR'), null);
    });

    it('calls resolver and returns with a resolved promise', async () => {
        const call = jest.fn(() => {
            return Promise.resolve('address');
        });

        registry.methods.resolver = jest.fn((hash) => {
            expect(hash).toEqual('0x0');

            return call;
        });

        namehash.hash = jest.fn((name) => {
            expect(name).toEqual('name');

            return '0x0';
        });

        registry.clone = jest.fn(() => {
            return {jsonInterface: '', address: ''};
        });

        const resolver = await registry.resolver('name');

        expect(resolver.jsonInterface).toEqual(RESOLVER_ABI);

        expect(resolver.address).toEqual('address');

        expect(registry.resolverName).toEqual('name');

        expect(registry.resolverContract).toEqual(resolver);

        expect(registry.clone).toHaveBeenCalled();
    });

    it('calls resolver with the same name again and returns with a resolved promise', async () => {
        registry.resolverName = 'name';
        registry.resolverContract = true;

        await expect(registry.resolver('name')).resolves.toEqual(true);
    });

    it('calls checkNetwork and the network is not synced', async () => {
        networkMock.getBlockByNumber = jest.fn(() => {
            return Promise.resolve({timestamp: 0});
        });

        await expect(registry.checkNetwork()).rejects.toBeInstanceOf(Error);

        expect(networkMock.getBlockByNumber).toHaveBeenCalledWith('latest', false);
    });

    it('calls checkNetwork and ENS is not supported', async () => {
        networkMock.getNetworkType = jest.fn(() => {
            return Promise.resolve('Nope');
        });

        await expect(registry.checkNetwork()).rejects.toThrow('ENS is not supported on network: "Nope"');

        expect(networkMock.getBlockByNumber).toHaveBeenCalledWith('latest', false);

        expect(networkMock.getNetworkType).toHaveBeenCalled();
    });

    it('calls setProvider with resolver defined and returns true', () => {
        const providerMock = {send: jest.fn(), clearSubscriptions: jest.fn()};
        registry.resolverContract = {setProvider: jest.fn(), clearSubscriptions: jest.fn()};
        registry.resolverContract.setProvider.mockReturnValueOnce(true);

        expect(registry.setProvider(providerMock, 'net')).toEqual(true);

        expect(registry.resolverContract.setProvider).toHaveBeenCalledWith(providerMock, 'net');

        expect(registry.resolverContract.clearSubscriptions).toHaveBeenCalled();
    });

    it('calls setProvider returns true', () => {
        expect(registry.setProvider({send: jest.fn(), clearSubscriptions: jest.fn()}, 'net')).toEqual(true);
    });
});
