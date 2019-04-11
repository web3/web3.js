import {Cfx} from 'conflux-web-cfx';
import {Network} from 'conflux-web-net';
import {AbstractConfluxWebModule} from 'conflux-web-core';
import * as Utils from 'conflux-web-utils';
import ConfluxWeb from '../../src/ConfluxWeb';

// Mocks
jest.mock('conflux-web-cfx');
jest.mock('conflux-web-net');
jest.mock('conflux-web-utils');

/**
 * ConfluxWeb test
 */
describe('ConfluxWebTest', () => {
    let confluxWeb;

    beforeEach(() => {
        confluxWeb = new ConfluxWeb('http://', {});
    });

    it('constructor check', () => {
        expect(confluxWeb.cfx).toBeInstanceOf(Cfx);

        expect(confluxWeb).toBeInstanceOf(AbstractConfluxWebModule);
    });

    it('sets the defaultGasPrice property', () => {
        confluxWeb.defaultGasPrice = 10;

        expect(confluxWeb.defaultGasPrice).toEqual(10);

        expect(Cfx.mock.instances[0].defaultGasPrice).toEqual(10);
    });

    it('sets the defaultGas property', () => {
        confluxWeb.defaultGas = 10;

        expect(confluxWeb.defaultGas).toEqual(10);

        expect(Cfx.mock.instances[0].defaultGas).toEqual(10);
    });

    it('sets the transactionBlockTimeout property', () => {
        confluxWeb.transactionBlockTimeout = 10;

        expect(confluxWeb.transactionBlockTimeout).toEqual(10);

        expect(Cfx.mock.instances[0].transactionBlockTimeout).toEqual(10);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        confluxWeb.transactionConfirmationBlocks = 10;

        expect(confluxWeb.transactionConfirmationBlocks).toEqual(10);

        expect(Cfx.mock.instances[0].transactionConfirmationBlocks).toEqual(10);
    });

    it('sets the transactionPollingTimeout property', () => {
        confluxWeb.transactionPollingTimeout = 10;

        expect(confluxWeb.transactionPollingTimeout).toEqual(10);

        expect(Cfx.mock.instances[0].transactionPollingTimeout).toEqual(10);
    });

    it('sets the defaultAccount property', () => {
        Utils.toChecksumAddress.mockReturnValue('0x2');

        confluxWeb.defaultAccount = '0x1';

        expect(confluxWeb.defaultAccount).toEqual('0x2');

        expect(Cfx.mock.instances[0].defaultAccount).toEqual('0x1');

        expect(Utils.toChecksumAddress).toHaveBeenCalledWith('0x1');
    });

    it('sets the defaultEpoch property', () => {
        confluxWeb.defaultEpoch = 10;

        expect(confluxWeb.defaultEpoch).toEqual(10);

        expect(Cfx.mock.instances[0].defaultEpoch).toEqual(10);
    });

    it('calls setProvider and returns true', () => {
        const cfxMock = Cfx.mock.instances[0];

        cfxMock.setProvider = jest.fn().mockReturnValueOnce(true);

        expect(confluxWeb.setProvider('http://localhost', 'net')).toEqual(true);

        expect(confluxWeb.currentProvider.host).toEqual('http://localhost');

        expect(cfxMock.setProvider).toHaveBeenCalledWith('http://localhost', 'net');
    });

    it('calls the static modules property and gets the expected object', () => {
        const modules = ConfluxWeb.modules;

        const cfx = new modules.Cfx('http://', 'net');

        const net = new modules.Net('http://', 'net');

        expect(cfx).toBeInstanceOf(Cfx);

        expect(net).toBeInstanceOf(Network);
    });

    it('calls the static givenProvider property and gets the result', () => {
        expect(ConfluxWeb.givenProvider).toEqual(null);
    });
});
