import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {AbstractWeb3Module} from 'web3-core';
import MethodFactory from '../../src/factories/MethodFactory';
import Network from '../../src/Network';

// Mocks
jest.mock('Utils');
jest.mock('formatters');

/**
 * Network test
 */
describe('NetworkTest', () => {
    let network,
        providerMock,
        methodFactoryMock;

    beforeEach(() => {
        providerMock = {send: jest.fn(), clearSubscriptions: jest.fn()};
        methodFactoryMock = {hasMethod: () => {return false;}};

        network = new Network(
            providerMock,
            methodFactoryMock,
            Utils,
            formatters,
            {},
            {}
        );
    });

    it('constructor check', () => {
        expect(network.utils).toEqual(Utils);

        expect(network.formatters).toEqual(formatters);

        expect(network).toBeInstanceOf(AbstractWeb3Module);
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
