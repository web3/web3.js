import {formatters} from 'web3-core-helpers';
import {PromiEvent} from 'web3-core-promievent';
import {WebsocketProvider} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import * as Utils from 'web3-utils';
import Accounts from '../../../__mocks__/Accounts';
import SendRawTransactionMethod from '../../../../src/methods/transaction/SendRawTransactionMethod';
import TransactionSigner from '../../../__mocks__/TransactionSigner';
import TransactionConfirmationWorkflow from '../../../../src/workflows/TransactionConfirmationWorkflow';
import AbstractSendMethod from '../../../../lib/methods/AbstractSendMethod';
import SendTransactionMethod from '../../../../src/methods/transaction/SendTransactionMethod';

// Mocks
jest.mock('formatters');
jest.mock('Utils');
jest.mock('WebsocketProvider');
jest.mock('AbstractWeb3Module');
jest.mock('../../../../src/workflows/TransactionConfirmationWorkflow');
jest.mock('../../../../src/methods/transaction/SendRawTransactionMethod');

/**
 * SendTransactionMethod test
 */
describe('SendTransactionMethodTest', () => {
    let method,
        providerMock,
        moduleInstanceMock,
        promiEvent,
        transactionConfirmationWorkflowMock,
        transactionSignerMock,
        accountsMock,
        sendRawTransactionMethodMock;

    beforeEach(() => {
        new WebsocketProvider({});
        providerMock = WebsocketProvider.mock.instances[0];
        providerMock.send = jest.fn();

        new AbstractWeb3Module(providerMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        accountsMock = new Accounts();

        transactionSignerMock = new TransactionSigner();
        transactionSignerMock.sign = jest.fn();

        promiEvent = new PromiEvent();

        new TransactionConfirmationWorkflow({}, {}, {});
        transactionConfirmationWorkflowMock = TransactionConfirmationWorkflow.mock.instances[0];

        new SendRawTransactionMethod();
        sendRawTransactionMethodMock = SendRawTransactionMethod.mock.instances[0];

        method = new SendTransactionMethod(
            Utils,
            formatters,
            transactionConfirmationWorkflowMock,
            sendRawTransactionMethodMock
        );

        method.callback = jest.fn();
        method.parameters = [{}];
    });

    it('constructor check', () => {
        expect(method.rpcMethod).toEqual('eth_sendTransaction');

        expect(method.parametersAmount).toEqual(1);

        expect(method.sendRawTransactionMethod).toEqual(sendRawTransactionMethodMock);

        expect(method).toBeInstanceOf(AbstractSendMethod);
    });

    it('calls execute with wallets defined and returns with a resolved promise', async () => {
        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.currentProvider = providerMock;
        moduleInstanceMock.accounts = {wallet: {0: {address: '0x0', privateKey: '0x0'}}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;

        sendRawTransactionMethodMock.execute = jest.fn((moduleInstance, promiEvent) => {
            promiEvent.resolve('0x0');
        });

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: '0x0',
            data: '0x',
            to: '0x',
            value: '0x'
        };

        formatters.txInputFormatter.mockReturnValueOnce(transaction);

        Utils.numberToHex.mockReturnValueOnce('0x0');

        sendRawTransactionMethodMock.execute.mockReturnValueOnce(promiEvent.resolve(true));

        const callback = jest.fn();
        method.callback = callback;
        method.parameters = [transaction];

        const response = await method.execute(moduleInstanceMock, promiEvent);

        expect(response).toEqual(true);

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(formatters.txInputFormatter).toHaveBeenCalledWith(transaction);

        expect(Utils.numberToHex).toHaveBeenCalledWith(1);

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith(moduleInstanceMock, promiEvent);

        expect(sendRawTransactionMethodMock.parameters).toEqual(['0x0']);

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);

    });

    it('calls execute with wallets defined and returns with a rejected promise', async () => {
        moduleInstanceMock.currentProvider = providerMock;
        moduleInstanceMock.accounts = {wallet: {0: {address: '0x0', privateKey: '0x0'}}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        const error = new Error('ERROR');

        formatters.txInputFormatter = jest.fn(() => {
            throw error;
        });

        method.callback = jest.fn();
        method.parameters = [transaction];

        const errorCallback = jest.fn();
        promiEvent.on('error', (e) => {
            expect(e).toEqual(error);

            errorCallback();
        });

        await expect(method.execute(moduleInstanceMock, promiEvent)).rejects.toThrow('ERROR');

        expect(formatters.txInputFormatter).toHaveBeenCalledWith(transaction);

        expect(method.callback).toHaveBeenCalledWith(error, null);
    });

    it('calls execute with a custom transaction signer defined and returns with a resolved promise', async () => {
        const customSigner = {constructor: {name: 'CustomSigner'}};

        customSigner.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        providerMock.send = jest.fn(() => {
            return Promise.resolve('0x0');
        });

        moduleInstanceMock.currentProvider = providerMock;
        moduleInstanceMock.accounts = {wallet: {}};
        moduleInstanceMock.transactionSigner = customSigner;

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        formatters.txInputFormatter.mockReturnValueOnce(transaction);

        Utils.numberToHex.mockReturnValueOnce('0x0');

        sendRawTransactionMethodMock.execute.mockReturnValueOnce(promiEvent.resolve(true));

        const callback = jest.fn();
        method.callback = callback;
        method.parameters = [transaction];

        const response = await method.execute(moduleInstanceMock, promiEvent);

        expect(response).toEqual(true);

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: '0x0',
            data: '0x',
            to: '0x',
            value: '0x'
        };

        expect(customSigner.sign).toHaveBeenCalledWith(mappedTransaction, undefined);

        expect(formatters.txInputFormatter).toHaveBeenCalledWith(transaction);

        expect(Utils.numberToHex).toHaveBeenCalledWith(1);

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith(moduleInstanceMock, promiEvent);

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);

        expect(sendRawTransactionMethodMock.parameters).toEqual(['0x0']);
    });

    it('calls execute signs locally but doesnt have chainId defined and returns with a resolved promise', async () => {
        const customSigner = {constructor: {name: 'CustomSigner'}};
        customSigner.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.getChainId = jest.fn(() => {
            return Promise.resolve(1);
        });

        moduleInstanceMock.currentProvider = providerMock;
        moduleInstanceMock.accounts = {wallet: {0: {address: '0x0', privateKey: '0x0'}}};
        moduleInstanceMock.transactionSigner = customSigner;

        sendRawTransactionMethodMock.execute = jest.fn((moduleInstance, promiEvent) => {
            promiEvent.resolve('0x0');
        });

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 0
        };

        formatters.txInputFormatter.mockReturnValueOnce(transaction);

        Utils.numberToHex.mockReturnValueOnce('0x0');

        sendRawTransactionMethodMock.execute.mockReturnValueOnce(promiEvent.resolve(true));

        const callback = jest.fn();
        method.callback = callback;
        method.parameters = [transaction];

        const response = await method.execute(moduleInstanceMock, promiEvent);

        expect(response).toEqual(true);

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: '0x0',
            data: '0x',
            to: '0x',
            value: '0x'
        };

        expect(customSigner.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(formatters.txInputFormatter).toHaveBeenCalledWith(transaction);

        expect(Utils.numberToHex).toHaveBeenCalledWith(1);

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith(moduleInstanceMock, promiEvent);

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);

        expect(sendRawTransactionMethodMock.parameters).toEqual(['0x0']);

        expect(moduleInstanceMock.getChainId).toHaveBeenCalled();
    });

    it('calls execute signs locally but doesnt have an nonce defined and returns with a resolved promise', async () => {
        const customSigner = {constructor: {name: 'CustomSigner'}};
        customSigner.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.getTransactionCount = jest.fn(() => {
            return Promise.resolve(1);
        });

        moduleInstanceMock.currentProvider = providerMock;
        moduleInstanceMock.accounts = {wallet: {}};
        moduleInstanceMock.transactionSigner = customSigner;

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: undefined,
            chainId: 1
        };

        const transactionWithNonce = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        formatters.txInputFormatter.mockReturnValueOnce(transactionWithNonce);

        Utils.numberToHex.mockReturnValueOnce('0x0');

        sendRawTransactionMethodMock.execute.mockReturnValueOnce(promiEvent.resolve(true));

        const callback = jest.fn();
        method.callback = callback;
        method.parameters = [transaction];

        const response = await method.execute(moduleInstanceMock, promiEvent);

        expect(response).toEqual(true);

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: '0x0',
            data: '0x',
            to: '0x',
            value: '0x'
        };

        expect(customSigner.sign).toHaveBeenCalledWith(mappedTransaction, undefined);

        expect(formatters.txInputFormatter).toHaveBeenCalledWith(transaction);

        expect(Utils.numberToHex).toHaveBeenCalledWith(1);

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith(moduleInstanceMock, promiEvent);

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);

        expect(sendRawTransactionMethodMock.parameters).toEqual(['0x0']);

        expect(moduleInstanceMock.getTransactionCount).toHaveBeenCalledWith(0);
    });

    it('calls execute with no gas defined and uses the defaultGas and returns with a resolved promise', (done) => {
        providerMock.send.mockReturnValueOnce(Promise.resolve('0x0'));

        moduleInstanceMock.currentProvider = providerMock;
        moduleInstanceMock.transactionSigner = {constructor: {name: 'TransactionSigner'}};
        moduleInstanceMock.defaultGas = 10;

        const transaction = {
            from: 0,
            gas: 0,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        const mappedTransaction = {
            from: 0,
            gas: 10,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        formatters.inputTransactionFormatter.mockReturnValueOnce(transaction);

        method.callback = jest.fn();
        method.parameters = [transaction];

        promiEvent.on('transactionHash', (hash) => {
            expect(hash).toEqual('0x0');

            expect(providerMock.send).toHaveBeenCalledWith('eth_sendTransaction', [transaction]);

            expect(transactionConfirmationWorkflowMock.execute).toHaveBeenCalledWith(method, moduleInstanceMock, '0x0', promiEvent);

            expect(method.callback).toHaveBeenCalledWith(false, '0x0');

            expect(formatters.inputTransactionFormatter).toHaveBeenCalledWith(mappedTransaction, moduleInstanceMock);

            done();
        });

        method.execute(moduleInstanceMock, promiEvent);
    });

    it('calls execute with no gasPrice defined and uses the defaultGasPrice and returns with a resolved promise', (done) => {
        providerMock.send.mockReturnValueOnce(Promise.resolve('0x0'));

        moduleInstanceMock.currentProvider = providerMock;
        moduleInstanceMock.transactionSigner = {constructor: {name: 'TransactionSigner'}};
        moduleInstanceMock.defaultGasPrice = 10;

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 0,
            nonce: 1,
            chainId: 1
        };

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 10,
            nonce: 1,
            chainId: 1
        };

        formatters.inputTransactionFormatter.mockReturnValueOnce(transaction);

        method.callback = jest.fn();
        method.parameters = [transaction];

        promiEvent.on('transactionHash', (hash) => {
            expect(hash).toEqual('0x0');

            expect(providerMock.send).toHaveBeenCalledWith('eth_sendTransaction', [transaction]);

            expect(transactionConfirmationWorkflowMock.execute).toHaveBeenCalledWith(method, moduleInstanceMock, '0x0', promiEvent);

            expect(method.callback).toHaveBeenCalledWith(false, '0x0');

            expect(formatters.inputTransactionFormatter).toHaveBeenCalledWith(mappedTransaction, moduleInstanceMock);

            done();
        });

        method.execute(moduleInstanceMock, promiEvent);

    });

    it('calls execute and the gasPrice will be defined with "eth_gasPrice" and returns with a resolved promise', (done) => {
        providerMock.send.mockReturnValueOnce(Promise.resolve(10));
        providerMock.send.mockReturnValueOnce(Promise.resolve('0x0'));

        moduleInstanceMock.currentProvider = providerMock;
        moduleInstanceMock.transactionSigner = {constructor: {name: 'TransactionSigner'}};
        moduleInstanceMock.defaultGasPrice = false;

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 0,
            nonce: 1,
            chainId: 1
        };

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 10,
            nonce: 1,
            chainId: 1
        };

        formatters.inputTransactionFormatter.mockReturnValueOnce(transaction);

        method.callback = jest.fn();
        method.parameters = [transaction];

        promiEvent.on('transactionHash', (hash) => {
            expect(hash).toEqual('0x0');

            expect(providerMock.send).toHaveBeenNthCalledWith(1, 'eth_gasPrice', []);
            expect(providerMock.send).toHaveBeenNthCalledWith(2, 'eth_sendTransaction', [transaction]);

            expect(transactionConfirmationWorkflowMock.execute).toHaveBeenCalledWith(method, moduleInstanceMock, '0x0', promiEvent);

            expect(method.callback).toHaveBeenCalledWith(false, '0x0');

            expect(formatters.inputTransactionFormatter).toHaveBeenCalledWith(mappedTransaction, moduleInstanceMock);

            done();
        });

        method.execute(moduleInstanceMock, promiEvent);
    });
});
