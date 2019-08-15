import {Network} from 'web3-net';
import {AbstractWeb3Module} from 'web3-core';
import MethodFactory from '../../src/factories/MethodFactory';
import TxPool from '../../src/TxPool';

// Mocks
jest.mock('web3-net');

/**
 * TxPool test
 */
describe('TxpoolTest', () => {
    let txpool, providerMock, methodFactory, networkMock;

    beforeEach(() => {
        providerMock = {send: jest.fn(), clearSubscriptions: jest.fn()};
        methodFactory = new MethodFactory();

        new Network();
        networkMock = Network.mock.instances[0];

        txpool = new TxPool(providerMock, methodFactory, networkMock, {}, {});
    });

    it('constructor check', () => {
        expect(txpool.net).toEqual(networkMock);

        expect(txpool).toBeInstanceOf(AbstractWeb3Module);
    });

    it('calls setProvider and returns true', () => {
        networkMock.setProvider = jest.fn();
        networkMock.setProvider.mockReturnValueOnce(true);

        expect(txpool.setProvider(providerMock, 'net')).toEqual(true);

        expect(networkMock.setProvider).toHaveBeenCalledWith(providerMock, 'net');
    });

    it('sets the defaultGasPrice property', () => {
        txpool.defaultGasPrice = 10;

        expect(txpool.defaultGasPrice).toEqual(10);

        expect(networkMock.defaultGasPrice).toEqual(10);
    });

    it('sets the defaultGas property', () => {
        txpool.defaultGas = 10;

        expect(txpool.defaultGas).toEqual(10);

        expect(networkMock.defaultGas).toEqual(10);
    });

    it('sets the transactionBlockTimeout property', () => {
        txpool.transactionBlockTimeout = 10;

        expect(txpool.transactionBlockTimeout).toEqual(10);

        expect(networkMock.transactionBlockTimeout).toEqual(10);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        txpool.transactionConfirmationBlocks = 10;

        expect(txpool.transactionConfirmationBlocks).toEqual(10);

        expect(networkMock.transactionConfirmationBlocks).toEqual(10);
    });

    it('sets the transactionPollingTimeout property', () => {
        txpool.transactionPollingTimeout = 10;

        expect(txpool.transactionPollingTimeout).toEqual(10);

        expect(networkMock.transactionPollingTimeout).toEqual(10);
    });

    it('sets the defaultAccount property', () => {
        txpool.defaultAccount = '0x0';

        expect(txpool.defaultAccount).toEqual('0x2');

        expect(networkMock.defaultAccount).toEqual('0x0');
    });

    it('sets the defaultBlock property', () => {
        txpool.defaultBlock = 1;

        expect(txpool.defaultBlock).toEqual(1);

        expect(networkMock.defaultBlock).toEqual(1);
    });
});
