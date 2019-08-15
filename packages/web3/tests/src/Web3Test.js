import {Eth} from 'web3-eth';
import {Shh} from 'web3-shh';
import {Network} from 'web3-net';
import {Personal} from 'web3-eth-personal';
import {AbstractWeb3Module} from 'web3-core';
import Web3 from '../../src/Web3';

// Mocks
jest.mock('web3-eth');
jest.mock('web3-shh');
jest.mock('web3-net');
jest.mock('web3-eth-personal');

/**
 * Web3 test
 */
describe('Web3Test', () => {
    let web3;

    beforeEach(() => {
        web3 = new Web3('http://', {});
    });

    it('constructor check', () => {
        expect(web3.eth).toBeInstanceOf(Eth);

        expect(web3.shh).toBeInstanceOf(Shh);

        expect(web3).toBeInstanceOf(AbstractWeb3Module);
    });

    it('sets the defaultGasPrice property', () => {
        web3.defaultGasPrice = 10;

        expect(web3.defaultGasPrice).toEqual(10);

        expect(Eth.mock.instances[0].defaultGasPrice).toEqual(10);

        expect(Shh.mock.instances[0].defaultGasPrice).toEqual(10);
    });

    it('sets the defaultGas property', () => {
        web3.defaultGas = 10;

        expect(web3.defaultGas).toEqual(10);

        expect(Eth.mock.instances[0].defaultGas).toEqual(10);

        expect(Shh.mock.instances[0].defaultGas).toEqual(10);
    });

    it('sets the transactionBlockTimeout property', () => {
        web3.transactionBlockTimeout = 10;

        expect(web3.transactionBlockTimeout).toEqual(10);

        expect(Eth.mock.instances[0].transactionBlockTimeout).toEqual(10);

        expect(Shh.mock.instances[0].transactionBlockTimeout).toEqual(10);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        web3.transactionConfirmationBlocks = 10;

        expect(web3.transactionConfirmationBlocks).toEqual(10);

        expect(Eth.mock.instances[0].transactionConfirmationBlocks).toEqual(10);

        expect(Shh.mock.instances[0].transactionConfirmationBlocks).toEqual(10);
    });

    it('sets the transactionPollingTimeout property', () => {
        web3.transactionPollingTimeout = 10;

        expect(web3.transactionPollingTimeout).toEqual(10);

        expect(Eth.mock.instances[0].transactionPollingTimeout).toEqual(10);

        expect(Shh.mock.instances[0].transactionPollingTimeout).toEqual(10);
    });

    it('sets the defaultAccount property', () => {
        web3.defaultAccount = '0x1';

        expect(web3.defaultAccount).toEqual('0x2');

        expect(Eth.mock.instances[0].defaultAccount).toEqual('0x1');

        expect(Shh.mock.instances[0].defaultAccount).toEqual('0x1');
    });

    it('sets the defaultBlock property', () => {
        web3.defaultBlock = 10;

        expect(web3.defaultBlock).toEqual(10);

        expect(Eth.mock.instances[0].defaultBlock).toEqual(10);

        expect(Shh.mock.instances[0].defaultBlock).toEqual(10);
    });

    it('calls setProvider and returns true', () => {
        const ethMock = Eth.mock.instances[0];

        const shhMock = Shh.mock.instances[0];

        ethMock.setProvider = jest.fn().mockReturnValueOnce(true);
        shhMock.setProvider = jest.fn().mockReturnValueOnce(true);

        expect(web3.setProvider('http://localhost', 'net')).toEqual(true);

        expect(web3.currentProvider.host).toEqual('http://localhost');

        expect(ethMock.setProvider).toHaveBeenCalledWith('http://localhost', 'net');

        expect(shhMock.setProvider).toHaveBeenCalledWith('http://localhost', 'net');
    });

    it('calls the static modules property and gets the expected object', () => {
        const modules = Web3.modules;

        const eth = new modules.Eth('http://', 'net');

        const net = new modules.Net('http://', 'net');

        const personal = new modules.Personal('http://', 'net');

        const shh = new modules.Shh('http://', 'net');

        expect(eth).toBeInstanceOf(Eth);

        expect(net).toBeInstanceOf(Network);

        expect(personal).toBeInstanceOf(Personal);

        expect(shh).toBeInstanceOf(Shh);
    });

    it('calls the static givenProvider property and gets the result', () => {
        expect(Web3.givenProvider).toEqual(null);
    });
});
