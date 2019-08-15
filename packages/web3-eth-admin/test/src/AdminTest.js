import {Network} from 'web3-net';
import {AbstractWeb3Module} from 'web3-core';
import MethodFactory from '../../src/factories/MethodFactory';
import Admin from '../../src/Admin';

// Mocks
jest.mock('web3-net');

/**
 * Admin test
 */
describe('AdminTest', () => {
    let admin, providerMock, methodFactory, networkMock;

    beforeEach(() => {
        providerMock = {send: jest.fn(), clearSubscriptions: jest.fn()};
        methodFactory = new MethodFactory();

        new Network();
        networkMock = Network.mock.instances[0];

        admin = new Admin(providerMock, methodFactory, networkMock, {}, {});
    });

    it('constructor check', () => {
        expect(admin.net).toEqual(networkMock);

        expect(admin).toBeInstanceOf(AbstractWeb3Module);
    });

    it('calls setProvider and returns true', () => {
        networkMock.setProvider = jest.fn();
        networkMock.setProvider.mockReturnValueOnce(true);

        expect(admin.setProvider(providerMock, 'net')).toEqual(true);

        expect(networkMock.setProvider).toHaveBeenCalledWith(providerMock, 'net');
    });

    it('sets the defaultGasPrice property', () => {
        admin.defaultGasPrice = 10;

        expect(admin.defaultGasPrice).toEqual(10);

        expect(networkMock.defaultGasPrice).toEqual(10);
    });

    it('sets the defaultGas property', () => {
        admin.defaultGas = 10;

        expect(admin.defaultGas).toEqual(10);

        expect(networkMock.defaultGas).toEqual(10);
    });

    it('sets the transactionBlockTimeout property', () => {
        admin.transactionBlockTimeout = 10;

        expect(admin.transactionBlockTimeout).toEqual(10);

        expect(networkMock.transactionBlockTimeout).toEqual(10);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        admin.transactionConfirmationBlocks = 10;

        expect(admin.transactionConfirmationBlocks).toEqual(10);

        expect(networkMock.transactionConfirmationBlocks).toEqual(10);
    });

    it('sets the transactionPollingTimeout property', () => {
        admin.transactionPollingTimeout = 10;

        expect(admin.transactionPollingTimeout).toEqual(10);

        expect(networkMock.transactionPollingTimeout).toEqual(10);
    });

    it('sets the defaultAccount property', () => {
        admin.defaultAccount = '0x0';

        expect(admin.defaultAccount).toEqual('0x2');

        expect(networkMock.defaultAccount).toEqual('0x0');
    });

    it('sets the defaultBlock property', () => {
        admin.defaultBlock = 1;

        expect(admin.defaultBlock).toEqual(1);

        expect(networkMock.defaultBlock).toEqual(1);
    });
});
