import {formatters} from 'web3-core-helpers';
import {PromiEvent} from 'web3-core-promievent';
import {WebsocketProvider} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import Accounts from '../../../__mocks__/Accounts';
import SendRawTransactionMethod from '../../../../src/methods/transaction/SendRawTransactionMethod';
import TransactionSigner from '../../../__mocks__/TransactionSigner';
import TransactionConfirmationWorkflow from '../../../../src/workflows/TransactionConfirmationWorkflow';
import SendTransactionMethod from '../../../../src/methods/transaction/SendTransactionMethod';
import AbstractSendMethod from '../../../../lib/methods/AbstractSendMethod';

// Mocks
jest.mock('formatters');
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

        promiEvent = new PromiEvent();

        new TransactionConfirmationWorkflow({}, {}, {});
        transactionConfirmationWorkflowMock = TransactionConfirmationWorkflow.mock.instances[0];

        new SendRawTransactionMethod();
        sendRawTransactionMethodMock = SendRawTransactionMethod.mock.instances[0];

        method = new SendTransactionMethod(
            {},
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
        transactionSignerMock.sign.mockReturnValueOnce(Promise.resolve({rawTransaction: '0x0'}));

        providerMock.send.mockReturnValueOnce(Promise.resolve('0x0'));

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

        sendRawTransactionMethodMock.parameters = [transaction];

        formatters.txInputFormatter.mockReturnValueOnce(transaction);

        Utils.numberToHex.mockReturnValueOnce('0x0');

        sendRawTransactionMethodMock.execute.mockReturnValueOnce(promiEvent.resolve(true));

        const callback = jest.fn();
        method.callback = callback;

        const response = await method.execute(moduleInstanceMock, promiEvent);

        expect(response).toEqual(true);

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: '0x0'
        };

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(formatters.txInputFormatter).toHaveBeenCalledWith(transaction);

        expect(providerMock.send).toHaveBeenCalledWith('eth_sendRawTransaction', sendRawTransactionMethodMock.parameters);

        expect(Utils.numberToHex).toHaveBeenCalledWith(1);

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith(moduleInstanceMock, promiEvent);

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);
    });

    it('calls execute with a custom transaction signer defined and returns with a resolved promise', async () => {
        const customSigner = {constructor: {name: 'CustomSigner'}, sign: jest.fn()};

        customSigner.sign.mockReturnValueOnce(Promise.resolve({rawTransaction: '0x0'}));

        providerMock.send.mockReturnValueOnce(Promise.resolve('0x0'));

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

        sendRawTransactionMethodMock.parameters = [transaction];

        formatters.txInputFormatter.mockReturnValueOnce(transaction);

        Utils.numberToHex.mockReturnValueOnce('0x0');

        sendRawTransactionMethodMock.execute.mockReturnValueOnce(promiEvent.resolve(true));

        const callback = jest.fn();
        method.callback = callback;

        const response = await method.execute(moduleInstanceMock, promiEvent);

        expect(response).toEqual(true);

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: '0x0'
        };

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(formatters.txInputFormatter).toHaveBeenCalledWith(transaction);

        expect(providerMock.send).toHaveBeenCalledWith('eth_sendRawTransaction', sendRawTransactionMethodMock.parameters);

        expect(Utils.numberToHex).toHaveBeenCalledWith(1);

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith(moduleInstanceMock, promiEvent);

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);
    });

    it('calls execute with no gas defined and uses the defaultGas and returns with a resolved promise', async () => {
        transactionSignerMock.sign.mockReturnValueOnce(Promise.resolve({rawTransaction: '0x0'}));

        providerMock.send.mockReturnValueOnce(Promise.resolve('0x0'));

        moduleInstanceMock.currentProvider = providerMock;
        moduleInstanceMock.accounts = {wallet: {0: {address: '0x0', privateKey: '0x0'}}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;
        moduleInstanceMock.defaultGas = 10;

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        sendRawTransactionMethodMock.parameters = [transaction];

        formatters.txInputFormatter.mockReturnValueOnce(transaction);

        Utils.numberToHex.mockReturnValueOnce('0x0');

        sendRawTransactionMethodMock.execute.mockReturnValueOnce(promiEvent.resolve(true));

        const callback = jest.fn();
        method.callback = callback;

        const response = await method.execute(moduleInstanceMock, promiEvent);

        expect(response).toEqual(true);

        const mappedTransaction = {
            from: 0,
            gas: 10,
            gasPrice: 1,
            nonce: 1,
            chainId: '0x0'
        };

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(formatters.txInputFormatter).toHaveBeenCalledWith(transaction);

        expect(providerMock.send).toHaveBeenCalledWith('eth_sendRawTransaction', sendRawTransactionMethodMock.parameters);

        expect(Utils.numberToHex).toHaveBeenCalledWith(1);

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith(moduleInstanceMock, promiEvent);

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);
    });

    it('calls execute with no gasPrice defined and uses the defaultGasPrice and returns with a resolved promise', async () => {
        transactionSignerMock.sign.mockReturnValueOnce(Promise.resolve({rawTransaction: '0x0'}));

        providerMock.send.mockReturnValueOnce(Promise.resolve('0x0'));

        moduleInstanceMock.currentProvider = providerMock;
        moduleInstanceMock.accounts = {wallet: {0: {address: '0x0', privateKey: '0x0'}}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;
        moduleInstanceMock.defaultGasPrice = 10;

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        sendRawTransactionMethodMock.parameters = [transaction];

        formatters.txInputFormatter.mockReturnValueOnce(transaction);

        Utils.numberToHex.mockReturnValueOnce('0x0');

        sendRawTransactionMethodMock.execute.mockReturnValueOnce(promiEvent.resolve(true));

        const callback = jest.fn();
        method.callback = callback;

        const response = await method.execute(moduleInstanceMock, promiEvent);

        expect(response).toEqual(true);

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 10,
            nonce: 1,
            chainId: '0x0'
        };

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(formatters.txInputFormatter).toHaveBeenCalledWith(transaction);

        expect(providerMock.send).toHaveBeenCalledWith('eth_sendRawTransaction', sendRawTransactionMethodMock.parameters);

        expect(Utils.numberToHex).toHaveBeenCalledWith(1);

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith(moduleInstanceMock, promiEvent);

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);
    });

    it('calls execute with no gasPrice defined and uses the defaultGasPrice and returns with a resolved promise', async () => {
        transactionSignerMock.sign.mockReturnValueOnce(Promise.resolve({rawTransaction: '0x0'}));

        providerMock.send.mockReturnValueOnce(Promise.resolve('0x0'));

        providerMock.send.mockReturnValueOnce(Promise.resolve(10));

        moduleInstanceMock.currentProvider = providerMock;
        moduleInstanceMock.accounts = {wallet: {0: {address: '0x0', privateKey: '0x0'}}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;
        moduleInstanceMock.defaultGasPrice = false;

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        sendRawTransactionMethodMock.parameters = [transaction];

        formatters.txInputFormatter.mockReturnValueOnce(transaction);

        Utils.numberToHex.mockReturnValueOnce('0x0');

        sendRawTransactionMethodMock.execute.mockReturnValueOnce(promiEvent.resolve(true));

        const callback = jest.fn();
        method.callback = callback;

        const response = await method.execute(moduleInstanceMock, promiEvent);

        expect(response).toEqual(true);

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 10,
            nonce: 1,
            chainId: '0x0'
        };

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(formatters.txInputFormatter).toHaveBeenCalledWith(transaction);

        expect(providerMock.send).toHaveBeenNthCalledWith(1, 'eth_gasPrice', []);

        expect(providerMock.send).toHaveBeenNthCalledWith(2, 'eth_sendRawTransaction', sendRawTransactionMethodMock.parameters);

        expect(Utils.numberToHex).toHaveBeenCalledWith(1);

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith(moduleInstanceMock, promiEvent);

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);
    });

    it('calls execute with no gasPrice defined and uses the defaultGasPrice and returns with a resolved promise', async () => {
        transactionSignerMock.sign.mockReturnValueOnce(Promise.resolve({rawTransaction: '0x0'}));

        providerMock.send.mockReturnValueOnce(Promise.resolve('0x0'));

        providerMock.send.mockReturnValueOnce(Promise.resolve(10));

        moduleInstanceMock.currentProvider = providerMock;
        moduleInstanceMock.accounts = {wallet: {0: {address: '0x0', privateKey: '0x0'}}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;
        moduleInstanceMock.defaultGasPrice = false;

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        sendRawTransactionMethodMock.parameters = [transaction];

        formatters.txInputFormatter.mockReturnValueOnce(transaction);

        Utils.numberToHex.mockReturnValueOnce('0x0');

        sendRawTransactionMethodMock.execute.mockReturnValueOnce(promiEvent.resolve(true));

        const callback = jest.fn();
        method.callback = callback;

        const response = await method.execute(moduleInstanceMock, promiEvent);

        expect(response).toEqual(true);

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 10,
            nonce: 1,
            chainId: '0x0'
        };

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(formatters.txInputFormatter).toHaveBeenCalledWith(transaction);

        expect(providerMock.send).toHaveBeenNthCalledWith(1, 'eth_gasPrice', []);

        expect(providerMock.send).toHaveBeenNthCalledWith(2, 'eth_sendRawTransaction', sendRawTransactionMethodMock.parameters);

        expect(Utils.numberToHex).toHaveBeenCalledWith(1);

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith(moduleInstanceMock, promiEvent);

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);
    });
});
