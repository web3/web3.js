import {AbstractContract} from 'web3-eth-contract';
import {Network} from 'web3-net';
import namehash from 'eth-ens-namehash';
import {RESOLVER_ABI} from '../../../ressources/ABI/Resolver';
import Registry from '../../../src/contracts/Registry';

// Mocks
jest.mock('Network');
jest.mock('namehash');

/**
 * Registry test
 */
describe('RegistryTest', () => {
    let registry,
        providerMock,
        contractModuleFactoryMock,
        networkMock;

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

        networkMock.getBlock = jest.fn(() => {
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
            {},
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

        expect(networkMock.getBlock).toHaveBeenCalledWith('latest', false);

        expect(networkMock.getNetworkType).toHaveBeenCalled();

        expect(registry.address).toEqual('0xe7410170f87102df0055eb195163a03b7f2bff4a');
    });

    it('calls owner and returns a resolved promise', async () => {
        const call = jest.fn(() => {
            return Promise.resolve(true);
        });

        const callback = jest.fn();

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
        networkMock.getBlock = jest.fn(() => {
            return Promise.resolve({timestamp: 0});
        });

        await expect(registry.checkNetwork()).rejects.toBeInstanceOf(Error);

        expect(networkMock.getBlock).toHaveBeenCalledWith('latest', false);
    });

    it('calls checkNetwork and ENS is not supported', async () => {
        networkMock.getNetworkType = jest.fn(() => {
            return Promise.resolve('Nope');
        });

        await expect(registry.checkNetwork()).rejects.toThrow('ENS is not supported on network: "Nope"');

        expect(networkMock.getBlock).toHaveBeenCalledWith('latest', false);

        expect(networkMock.getNetworkType).toHaveBeenCalled();
    });

    it('calls setProvider with resolver defined and returns true', () => {
        const providerMock = {send: jest.fn(), clearSubscriptions: jest.fn()};
        registry.resolverContract = {setProvider: jest.fn()};
        registry.resolverContract.setProvider.mockReturnValueOnce(true);

        expect(registry.setProvider(providerMock, 'net')).toEqual(true);

        expect(registry.resolverContract.setProvider).toHaveBeenCalledWith(providerMock, 'net');
    });

    it('calls setProvider returns true', () => {
        expect(registry.setProvider({send: jest.fn(), clearSubscriptions: jest.fn()}, 'net')).toEqual(true);
    });
});
