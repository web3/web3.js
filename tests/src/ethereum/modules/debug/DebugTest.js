import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {Network} from 'web3-net';
import {AbstractWeb3Module} from 'web3-core';
import MethodFactory from '../../src/factories/MethodFactory';
import Debug from '../../src/Debug';

// Mocks
jest.mock('web3-utils');
jest.mock('web3-core-helpers');
jest.mock('web3-net');

/**
 * Debug test
 */
describe('DebugTest', () => {
    let debug, providerMock, methodFactory, networkMock;

    beforeEach(() => {
        providerMock = {send: jest.fn(), clearSubscriptions: jest.fn()};
        methodFactory = new MethodFactory(Utils, formatters);

        new Network();
        networkMock = Network.mock.instances[0];

        debug = new Debug(providerMock, methodFactory, networkMock, Utils, formatters, {}, {});
    });

    it('constructor check', () => {
        expect(debug.net).toEqual(networkMock);

        expect(debug.utils).toEqual(Utils);

        expect(debug.formatters).toEqual(formatters);

        expect(debug).toBeInstanceOf(AbstractWeb3Module);
    });

    it('calls setProvider and returns true', () => {
        networkMock.setProvider = jest.fn();
        networkMock.setProvider.mockReturnValueOnce(true);

        expect(debug.setProvider(providerMock, 'net')).toEqual(true);

        expect(networkMock.setProvider).toHaveBeenCalledWith(providerMock, 'net');
    });

    it('sets the defaultGasPrice property', () => {
        debug.defaultGasPrice = 10;

        expect(debug.defaultGasPrice).toEqual(10);

        expect(networkMock.defaultGasPrice).toEqual(10);
    });

    it('sets the defaultGas property', () => {
        debug.defaultGas = 10;

        expect(debug.defaultGas).toEqual(10);

        expect(networkMock.defaultGas).toEqual(10);
    });

    it('sets the transactionBlockTimeout property', () => {
        debug.transactionBlockTimeout = 10;

        expect(debug.transactionBlockTimeout).toEqual(10);

        expect(networkMock.transactionBlockTimeout).toEqual(10);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        debug.transactionConfirmationBlocks = 10;

        expect(debug.transactionConfirmationBlocks).toEqual(10);

        expect(networkMock.transactionConfirmationBlocks).toEqual(10);
    });

    it('sets the transactionPollingTimeout property', () => {
        debug.transactionPollingTimeout = 10;

        expect(debug.transactionPollingTimeout).toEqual(10);

        expect(networkMock.transactionPollingTimeout).toEqual(10);
    });

    it('sets the defaultAccount property', () => {
        Utils.toChecksumAddress.mockReturnValue('0x2');

        debug.defaultAccount = '0x0';

        expect(debug.defaultAccount).toEqual('0x2');

        expect(networkMock.defaultAccount).toEqual('0x0');

        expect(Utils.toChecksumAddress).toHaveBeenCalledWith('0x0');
    });

    it('sets the defaultBlock property', () => {
        debug.defaultBlock = 1;

        expect(debug.defaultBlock).toEqual(1);

        expect(networkMock.defaultBlock).toEqual(1);
    });
});
