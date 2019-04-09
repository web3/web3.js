import {Eth} from 'conflux-web-cfx';
import {Network} from 'conflux-web-net';
import {AbstractWeb3Module} from 'conflux-web-core';
import * as Utils from 'conflux-web-utils';
import ConfluxWeb from '../../src/ConfluxWeb';

// Mocks
jest.mock('conflux-web-cfx');
jest.mock('conflux-web-net');
jest.mock('conflux-web-utils');

/**
 * Web3 test
 */
describe('Web3Test', () => {
    let web3;

    beforeEach(() => {
        web3 = new ConfluxWeb('http://', {});
    });

    it('constructor check', () => {
        expect(web3.eth).toBeInstanceOf(Eth);

        expect(web3).toBeInstanceOf(AbstractWeb3Module);
    });

    it('sets the defaultGasPrice property', () => {
        web3.defaultGasPrice = 10;

        expect(web3.defaultGasPrice).toEqual(10);

        expect(Eth.mock.instances[0].defaultGasPrice).toEqual(10);
    });

    it('sets the defaultGas property', () => {
        web3.defaultGas = 10;

        expect(web3.defaultGas).toEqual(10);

        expect(Eth.mock.instances[0].defaultGas).toEqual(10);
    });

    it('sets the transactionBlockTimeout property', () => {
        web3.transactionBlockTimeout = 10;

        expect(web3.transactionBlockTimeout).toEqual(10);

        expect(Eth.mock.instances[0].transactionBlockTimeout).toEqual(10);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        web3.transactionConfirmationBlocks = 10;

        expect(web3.transactionConfirmationBlocks).toEqual(10);

        expect(Eth.mock.instances[0].transactionConfirmationBlocks).toEqual(10);
    });

    it('sets the transactionPollingTimeout property', () => {
        web3.transactionPollingTimeout = 10;

        expect(web3.transactionPollingTimeout).toEqual(10);

        expect(Eth.mock.instances[0].transactionPollingTimeout).toEqual(10);
    });

    it('sets the defaultAccount property', () => {
        Utils.toChecksumAddress.mockReturnValue('0x2');

        web3.defaultAccount = '0x1';

        expect(web3.defaultAccount).toEqual('0x2');

        expect(Eth.mock.instances[0].defaultAccount).toEqual('0x1');

        expect(Utils.toChecksumAddress).toHaveBeenCalledWith('0x1');
    });

    it('sets the defaultBlock property', () => {
        web3.defaultBlock = 10;

        expect(web3.defaultBlock).toEqual(10);

        expect(Eth.mock.instances[0].defaultBlock).toEqual(10);
    });

    it('calls setProvider and returns true', () => {
        const ethMock = Eth.mock.instances[0];

        ethMock.setProvider = jest.fn().mockReturnValueOnce(true);

        expect(web3.setProvider('http://localhost', 'net')).toEqual(true);

        expect(web3.currentProvider.host).toEqual('http://localhost');

        expect(ethMock.setProvider).toHaveBeenCalledWith('http://localhost', 'net');
    });

    it('calls the static modules property and gets the expected object', () => {
        const modules = ConfluxWeb.modules;

        const eth = new modules.Eth('http://', 'net');

        const net = new modules.Net('http://', 'net');

        expect(eth).toBeInstanceOf(Eth);

        expect(net).toBeInstanceOf(Network);
    });

    it('calls the static givenProvider property and gets the result', () => {
        expect(ConfluxWeb.givenProvider).toEqual(null);
    });
});
