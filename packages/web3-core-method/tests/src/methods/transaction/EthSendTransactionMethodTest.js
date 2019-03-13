import {formatters} from 'web3-core-helpers';
import {WebsocketProvider} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import * as Utils from 'web3-utils';
import TransactionSigner from '../../../__mocks__/TransactionSigner';
import ChainIdMethod from '../../../../src/methods/network/ChainIdMethod';
import TransactionObserver from '../../../../src/observers/TransactionObserver';
import SendRawTransactionMethod from '../../../../src/methods/transaction/SendRawTransactionMethod';
import GetTransactionCountMethod from '../../../../src/methods/account/GetTransactionCountMethod';
import AbstractObservedTransactionMethod from '../../../../lib/methods/transaction/AbstractObservedTransactionMethod';
import EthSendTransactionMethod from '../../../../src/methods/transaction/EthSendTransactionMethod';

// Mocks
jest.mock('formatters');
jest.mock('Utils');
jest.mock('WebsocketProvider');
jest.mock('AbstractWeb3Module');
jest.mock('../../../../src/methods/network/ChainIdMethod');
jest.mock('../../../../src/observers/TransactionObserver');
jest.mock('../../../../src/methods/transaction/SendRawTransactionMethod');
jest.mock('../../../../src/methods/account/GetTransactionCountMethod');

/**
 * EthSendTransactionMethod test
 */
describe('EthSendTransactionMethodTest', () => {
    let method,
        providerMock,
        moduleInstanceMock,
        transactionSignerMock,
        sendRawTransactionMethodMock,
        chainIdMethodMock,
        getTransactionCountMethodMock,
        transactionObserverMock;

    beforeEach(() => {
        new WebsocketProvider({});
        providerMock = WebsocketProvider.mock.instances[0];
        providerMock.send = jest.fn();

        new AbstractWeb3Module(providerMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];
        moduleInstanceMock.currentProvider = providerMock;

        transactionSignerMock = new TransactionSigner();
        transactionSignerMock.sign = jest.fn();

        new SendRawTransactionMethod();
        sendRawTransactionMethodMock = SendRawTransactionMethod.mock.instances[0];

        new GetTransactionCountMethod();
        getTransactionCountMethodMock = GetTransactionCountMethod.mock.instances[0];

        new ChainIdMethod();
        chainIdMethodMock = ChainIdMethod.mock.instances[0];

        new TransactionObserver();
        transactionObserverMock = TransactionObserver.mock.instances[0];

        method = new EthSendTransactionMethod(
            Utils,
            formatters,
            moduleInstanceMock,
            transactionObserverMock,
            chainIdMethodMock,
            getTransactionCountMethodMock,
            sendRawTransactionMethodMock
        );

        method.callback = jest.fn();
        method.parameters = [{}];
    });

    it('constructor check', () => {
        expect(method.sendRawTransactionMethod).toEqual(sendRawTransactionMethodMock);

        expect(method.chainIdMethod).toEqual(chainIdMethodMock);

        expect(method.getTransactionCountMethod).toEqual(getTransactionCountMethodMock);

        expect(method).toBeInstanceOf(AbstractObservedTransactionMethod);
    });

    it('calls execute with wallets defined and returns with a resolved promise', async () => {
        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.accounts = {accountsIndex: 1, wallet: {0: {address: '0x0', privateKey: '0x0'}}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;

        sendRawTransactionMethodMock.execute = jest.fn(() => {
            method.promiEvent.resolve('0x0');
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
            chainId: 1
        };

        const callback = jest.fn();
        method.callback = callback;
        method.parameters = [transaction];

        const response = await method.execute();

        expect(response).toEqual('0x0');

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith();

        expect(sendRawTransactionMethodMock.promiEvent).toEqual(method.promiEvent);

        expect(sendRawTransactionMethodMock.parameters).toEqual(['0x0']);

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);
    });

    it('calls execute with wallets defined and returns with a rejected promise', async () => {
        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.accounts = {accountsIndex: 1, wallet: {0: {address: '0x0', privateKey: '0x0'}}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;

        sendRawTransactionMethodMock.execute = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
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
            chainId: 1
        };

        const callback = jest.fn();
        method.callback = callback;
        method.parameters = [transaction];

        await expect(method.execute()).rejects.toThrow('ERROR');

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith();

        expect(sendRawTransactionMethodMock.promiEvent).toEqual(method.promiEvent);

        expect(sendRawTransactionMethodMock.parameters).toEqual(['0x0']);

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);
    });

    it('calls execute with a custom transaction signer defined and returns with a resolved promise', async () => {
        const customSigner = {constructor: {name: 'CustomSigner'}};

        customSigner.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
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

        sendRawTransactionMethodMock.execute = jest.fn(() => {
            method.promiEvent.resolve(true);
        });

        const callback = jest.fn();
        method.callback = callback;
        method.parameters = [transaction];

        const response = await method.execute();

        expect(response).toEqual(true);

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        expect(customSigner.sign).toHaveBeenCalledWith(mappedTransaction, null);

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith();

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);

        expect(sendRawTransactionMethodMock.parameters).toEqual(['0x0']);
    });

    it('calls execute with custom transaction signer defined and returns with a rejected promise', async () => {
        const customSigner = {constructor: {name: 'CustomSigner'}};

        customSigner.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.accounts = {accountsIndex: 1, wallet: {0: {address: '0x0', privateKey: '0x0'}}};
        moduleInstanceMock.transactionSigner = customSigner;

        sendRawTransactionMethodMock.execute = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
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
            chainId: 1
        };

        const callback = jest.fn();
        method.callback = callback;
        method.parameters = [transaction];

        await expect(method.execute()).rejects.toThrow('ERROR');

        expect(customSigner.sign).toHaveBeenCalledWith(mappedTransaction, null);

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith();

        expect(sendRawTransactionMethodMock.promiEvent).toEqual(method.promiEvent);

        expect(sendRawTransactionMethodMock.parameters).toEqual(['0x0']);

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);
    });

    it('calls execute signs locally but doesnt have chainId defined and returns with a resolved promise', async () => {
        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.accounts = {accountsIndex: 1, wallet: {0: {address: '0x0', privateKey: '0x0'}}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;

        sendRawTransactionMethodMock.execute = jest.fn(() => {
            method.promiEvent.resolve('0x0');
        });

        chainIdMethodMock.execute.mockReturnValueOnce(Promise.resolve(1));

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 0
        };

        const callback = jest.fn();
        method.callback = callback;
        method.parameters = [transaction];

        const response = await method.execute();

        expect(response).toEqual('0x0');

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith();

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);

        expect(sendRawTransactionMethodMock.parameters).toEqual(['0x0']);

        expect(chainIdMethodMock.execute).toHaveBeenCalled();
    });

    it('calls execute signs locally but doesnt have an nonce defined and returns with a resolved promise', async () => {
        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.accounts = {accountsIndex: 1, wallet: {0: {address: '0x0', privateKey: '0x0'}}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;

        sendRawTransactionMethodMock.execute = jest.fn(() => {
            method.promiEvent.resolve('0x0');
        });

        getTransactionCountMethodMock.execute.mockReturnValueOnce(Promise.resolve(1));

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            chainId: 1
        };

        const callback = jest.fn();
        method.callback = callback;
        method.parameters = [transaction];

        const response = await method.execute();

        expect(response).toEqual('0x0');

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith();

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);

        expect(sendRawTransactionMethodMock.parameters).toEqual(['0x0']);

        expect(getTransactionCountMethodMock.parameters).toEqual([method.parameters[0].from]);

        expect(getTransactionCountMethodMock.execute).toHaveBeenCalledWith();
    });

    it('calls execute with no gas defined and uses the defaultGas and returns with a resolved promise', async () => {
        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.accounts = {accountsIndex: 1, wallet: {0: {address: '0x0', privateKey: '0x0'}}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;
        moduleInstanceMock.defaultGas = 10;

        sendRawTransactionMethodMock.execute = jest.fn(() => {
            method.promiEvent.resolve('0x0');
        });

        const transaction = {
            from: 0,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        const callback = jest.fn();
        method.callback = callback;
        method.parameters = [transaction];

        const response = await method.execute();

        expect(response).toEqual('0x0');

        const mappedTransaction = {
            from: 0,
            gas: 10,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith();

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);

        expect(sendRawTransactionMethodMock.parameters).toEqual(['0x0']);
    });

    it('calls execute with no gasPrice defined and uses the defaultGasPrice and returns with a resolved promise', async () => {
        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.accounts = {accountsIndex: 1, wallet: {0: {address: '0x0', privateKey: '0x0'}}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;
        moduleInstanceMock.defaultGasPrice = 10;

        sendRawTransactionMethodMock.execute = jest.fn(() => {
            method.promiEvent.resolve('0x0');
        });

        const transaction = {
            from: 0,
            gas: 1,
            nonce: 1,
            chainId: 1
        };

        const callback = jest.fn();
        method.callback = callback;
        method.parameters = [transaction];

        const response = await method.execute();

        expect(response).toEqual('0x0');

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 10,
            nonce: 1,
            chainId: 1
        };

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith();

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);

        expect(sendRawTransactionMethodMock.parameters).toEqual(['0x0']);
    });

    it('calls execute and the gasPrice will be defined with "eth_gasPrice" and returns with a resolved promise', async () => {
        providerMock.send.mockReturnValueOnce(Promise.resolve(10));

        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.accounts = {accountsIndex: 1, wallet: {0: {address: '0x0', privateKey: '0x0'}}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;

        sendRawTransactionMethodMock.execute = jest.fn(() => {
            method.promiEvent.resolve('0x0');
        });

        const transaction = {
            from: 0,
            gas: 1,
            nonce: 1,
            chainId: 1
        };

        const callback = jest.fn();
        method.callback = callback;
        method.parameters = [transaction];

        const response = await method.execute();

        expect(response).toEqual('0x0');

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 10,
            nonce: 1,
            chainId: 1
        };

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(sendRawTransactionMethodMock.execute).toHaveBeenCalledWith();

        expect(sendRawTransactionMethodMock.callback).toEqual(callback);

        expect(sendRawTransactionMethodMock.parameters).toEqual(['0x0']);

        expect(providerMock.send).toHaveBeenNthCalledWith(1, 'eth_gasPrice', []);
    });

    it('calls execute and signs on the node', () => {
        moduleInstanceMock.transactionSigner = transactionSignerMock;

        const parameters = [{
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        }];

        providerMock.send.mockReturnValueOnce(Promise.resolve('0x0'));

        method.parameters = parameters;

        method.execute();

        expect(providerMock.send).toHaveBeenCalledWith('eth_sendTransaction', parameters)
    });
});
