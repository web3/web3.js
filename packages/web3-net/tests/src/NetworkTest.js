import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {HttpProvider, ProvidersModuleFactory, ProviderDetector, ProviderResolver} from 'web3-providers';
import {MethodModuleFactory, VersionMethod, GetBlockMethod, ListeningMethod, PeerCountMethod} from 'web3-core-method';
import {AbstractWeb3Module} from 'web3-core';
import MethodFactory from '../../src/factories/MethodFactory';
import Network from '../../src/Network';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('HttpProvider');
jest.mock('ProvidersModuleFactory');
jest.mock('ProviderDetector');
jest.mock('ProviderResolver');
jest.mock('MethodModuleFactory');

/**
 * Network test
 */
describe('NetworkTest', () => {
    let network,
        providerMock,
        providersModuleFactoryMock,
        providerDetectorMock,
        providerResolverMock,
        methodModuleFactoryMock,
        methodFactory;

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

        network = new Network(
            providerMock,
            providersModuleFactoryMock,
            methodModuleFactoryMock,
            methodFactory,
            Utils,
            formatters,
            {}
        );
    });

    it('constructor check', () => {
        expect(network.currentProvider).toEqual(providerMock);

        expect(network.providersModuleFactory).toEqual(providersModuleFactoryMock);

        expect(network.methodFactory).toEqual(methodFactory);

        expect(network.utils).toEqual(Utils);

        expect(network.formatters).toEqual(formatters);

        expect(network).toBeInstanceOf(AbstractWeb3Module);
    });

    it('JSON-RPC methods check', () => {
        expect(network.methodFactory.methods).toEqual({
            getId: VersionMethod,
            getBlock: GetBlockMethod,
            isListening: ListeningMethod,
            getPeerCount: PeerCountMethod
        });
    });

    it('calls getNetworkType and resolves to the network name "private', async () => {
        const callback = jest.fn();

        network.getId = jest.fn(() => {
            return Promise.resolve(0);
        });

        network.getBlock = jest.fn((block, txObjects) => {
            expect(block).toEqual(0);

            expect(txObjects).toEqual(false);

            return Promise.resolve({hash: 'private'});
        });

        await expect(network.getNetworkType(callback)).resolves.toEqual('private');

        expect(callback).toHaveBeenCalledWith(null, 'private');

        expect(network.getBlock).toHaveBeenCalled();

        expect(network.getId).toHaveBeenCalled();
    });

    it('calls getNetworkType and resolves to the network name "main', async () => {
        const callback = jest.fn();

        network.getId = jest.fn(() => {
            return Promise.resolve(1);
        });

        network.getBlock = jest.fn((block, txObjects) => {
            expect(block).toEqual(0);

            expect(txObjects).toEqual(false);

            return Promise.resolve({hash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'});
        });

        await expect(network.getNetworkType(callback)).resolves.toEqual('main');

        expect(callback).toHaveBeenCalledWith(null, 'main');

        expect(network.getBlock).toHaveBeenCalled();

        expect(network.getId).toHaveBeenCalled();
    });

    it('calls getNetworkType and resolves to the network name "morden', async () => {
        const callback = jest.fn();

        network.getId = jest.fn(() => {
            return Promise.resolve(2);
        });

        network.getBlock = jest.fn((block, txObjects) => {
            expect(block).toEqual(0);

            expect(txObjects).toEqual(false);

            return Promise.resolve({hash: '0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303'});
        });

        await expect(network.getNetworkType(callback)).resolves.toEqual('morden');

        expect(callback).toHaveBeenCalledWith(null, 'morden');

        expect(network.getBlock).toHaveBeenCalled();

        expect(network.getId).toHaveBeenCalled();
    });

    it('calls getNetworkType and resolves to the network name "ropsten', async () => {
        const callback = jest.fn();

        network.getId = jest.fn(() => {
            return Promise.resolve(3);
        });

        network.getBlock = jest.fn((block, txObjects) => {
            expect(block).toEqual(0);

            expect(txObjects).toEqual(false);

            return Promise.resolve({hash: '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d'});
        });

        await expect(network.getNetworkType(callback)).resolves.toEqual('ropsten');

        expect(callback).toHaveBeenCalledWith(null, 'ropsten');

        expect(network.getBlock).toHaveBeenCalled();

        expect(network.getId).toHaveBeenCalled();
    });

    it('calls getNetworkType and resolves to the network name "rinkeby', async () => {
        const callback = jest.fn();

        network.getId = jest.fn(() => {
            return Promise.resolve(4);
        });

        network.getBlock = jest.fn((block, txObjects) => {
            expect(block).toEqual(0);

            expect(txObjects).toEqual(false);

            return Promise.resolve({hash: '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177'});
        });

        await expect(network.getNetworkType(callback)).resolves.toEqual('rinkeby');

        expect(callback).toHaveBeenCalledWith(null, 'rinkeby');

        expect(network.getBlock).toHaveBeenCalled();

        expect(network.getId).toHaveBeenCalled();
    });

    it('calls getNetworkType and resolves to the network name "kovan', async () => {
        const callback = jest.fn();

        network.getId = jest.fn(() => {
            return Promise.resolve(42);
        });

        network.getBlock = jest.fn((block, txObjects) => {
            expect(block).toEqual(0);

            expect(txObjects).toEqual(false);

            return Promise.resolve({hash: '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9'});
        });

        await expect(network.getNetworkType(callback)).resolves.toEqual('kovan');

        expect(callback).toHaveBeenCalledWith(null, 'kovan');

        expect(network.getBlock).toHaveBeenCalled();

        expect(network.getId).toHaveBeenCalled();
    });

    it('calls getNetworkType and rejects the promise', async () => {
        const callback = jest.fn();

        network.getId = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
        });

        await expect(network.getNetworkType(callback)).rejects.toEqual(new Error('ERROR'));

        expect(callback).toHaveBeenCalledWith(new Error('ERROR'), null);

        expect(network.getId).toHaveBeenCalled();
    });
});
