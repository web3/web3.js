import {formatters} from 'web3-core-helpers';
import {WebsocketProvider} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import * as Utils from 'web3-utils';
import TransactionSigner from '../../../__mocks__/TransactionSigner';
import ChainIdMethod from '../../../../src/methods/network/ChainIdMethod';
import TransactionObserver from '../../../../src/observers/TransactionObserver';
import GetTransactionCountMethod from '../../../../src/methods/account/GetTransactionCountMethod';
import EthSendTransactionMethod from '../../../../src/methods/transaction/EthSendTransactionMethod';
import AbstractObservedTransactionMethod from '../../../../lib/methods/transaction/AbstractObservedTransactionMethod';

// Mocks
jest.mock('formatters');
jest.mock('Utils');
jest.mock('WebsocketProvider');
jest.mock('AbstractWeb3Module');
jest.mock('../../../../src/methods/network/ChainIdMethod');
jest.mock('../../../../src/observers/TransactionObserver');
jest.mock('../../../../src/methods/account/GetTransactionCountMethod');

/**
 * EthSendTransactionMethod test
 */
describe('EthSendTransactionMethodTest', () => {
    let method,
        providerMock,
        moduleInstanceMock,
        transactionSignerMock,
        chainIdMethodMock,
        getTransactionCountMethodMock,
        transactionObserverMock;

    beforeEach(() => {
        new WebsocketProvider({});
        providerMock = WebsocketProvider.mock.instances[0];
        providerMock.send = jest.fn(() => {
            return Promise.resolve('0x0');
        });

        new AbstractWeb3Module(providerMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];
        moduleInstanceMock.currentProvider = providerMock;

        transactionSignerMock = new TransactionSigner();
        transactionSignerMock.type = 'TransactionSigner';
        transactionSignerMock.sign = jest.fn();

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
            getTransactionCountMethodMock
        );

        method.parameters = [{}];
    });

    it('constructor check', () => {
        expect(method.chainIdMethod).toEqual(chainIdMethodMock);

        expect(method.getTransactionCountMethod).toEqual(getTransactionCountMethodMock);

        expect(method).toBeInstanceOf(AbstractObservedTransactionMethod);
    });

    it('calls the static property Type and it returns the expect value', () => {
        expect(EthSendTransactionMethod.Type).toEqual('eth-send-transaction-method');
    });

    it('calls execute with wallets defined and returns with a resolved promise', (done) => {
        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.accounts = {wallet: {0: {address: '0x0', privateKey: '0x0'}, accountsIndex: 1}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;

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

        formatters.inputCallFormatter.mockReturnValueOnce(mappedTransaction);

        method.callback = (error, hash) => {
            expect(error).toEqual(false);

            expect(hash).toEqual('0x0');

            done();
        };

        method.parameters = [transaction];

        method.execute();

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith(method.parameters[0], moduleInstanceMock);
    });

    it('calls execute with wallets defined and returns with a rejected promise', async () => {
        transactionSignerMock.sign = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
        });

        moduleInstanceMock.accounts = {wallet: {0: {address: '0x0', privateKey: '0x0'}, accountsIndex: 1}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;

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

        formatters.inputCallFormatter.mockReturnValueOnce(mappedTransaction);

        method.parameters = [transaction];

        await expect(method.execute()).rejects.toThrow('ERROR');

        expect(transactionSignerMock.sign).toHaveBeenCalledWith(mappedTransaction, '0x0');

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith(method.parameters[0], moduleInstanceMock);
    });

    it('calls execute with a custom transaction signer defined and returns with a resolved promise', (done) => {
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

        method.parameters = [transaction];

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        formatters.inputCallFormatter.mockReturnValueOnce(mappedTransaction);

        method.callback = (error, hash) => {
            expect(error).toEqual(false);

            expect(hash).toEqual('0x0');

            done();
        };

        method.execute();

        expect(customSigner.sign).toHaveBeenCalledWith(mappedTransaction, null);

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith(method.parameters[0], moduleInstanceMock);
    });

    it('calls execute with custom transaction signer defined and returns with a rejected promise', async () => {
        const customSigner = {constructor: {name: 'CustomSigner'}};

        customSigner.sign = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
        });

        moduleInstanceMock.accounts = {wallet: {0: {address: '0x0', privateKey: '0x0'}, accountsIndex: 1}};
        moduleInstanceMock.transactionSigner = customSigner;

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

        formatters.inputCallFormatter.mockReturnValueOnce(mappedTransaction);

        method.parameters = [transaction];

        await expect(method.execute()).rejects.toThrow('ERROR');

        expect(customSigner.sign).toHaveBeenCalledWith(mappedTransaction, null);

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith(method.parameters[0], moduleInstanceMock);
    });

    it('calls execute signs locally but doesnt have chainId defined and returns with a resolved promise', (done) => {
        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.accounts = {wallet: {0: {address: '0x0', privateKey: '0x0'}, accountsIndex: 1}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;

        chainIdMethodMock.execute = jest.fn(() => {
            return Promise.resolve(1);
        });

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 0
        };

        method.parameters = [transaction];

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        Utils.numberToHex.mockReturnValueOnce(1);

        formatters.inputCallFormatter.mockReturnValueOnce({
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        });

        method.callback = (error, hash) => {
            expect(error).toEqual(false);

            expect(hash).toEqual('0x0');

            expect(transactionSignerMock.sign).toHaveBeenCalledWith(
                {
                    gas: 1,
                    gasPrice: 1,
                    nonce: 1,
                    chainId: 1,
                    to: '0x',
                    data: '0x',
                    value: '0x'
                },
                '0x0'
            );

            expect(chainIdMethodMock.execute).toHaveBeenCalled();

            expect(method.rpcMethod).toEqual('eth_sendRawTransaction');

            expect(formatters.inputCallFormatter).toHaveBeenCalledWith(mappedTransaction, moduleInstanceMock);

            expect(Utils.numberToHex).toHaveBeenCalledWith(1);

            done();
        };

        method.execute();
    });

    it('calls execute signs locally but doesnt have an nonce defined and returns with a resolved promise', (done) => {
        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.accounts = {wallet: {0: {address: '0x0', privateKey: '0x0'}, accountsIndex: 1}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;

        getTransactionCountMethodMock.execute.mockReturnValueOnce(Promise.resolve(1));

        const transaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            chainId: 1
        };

        method.parameters = [transaction];

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        Utils.numberToHex.mockReturnValueOnce(1);

        formatters.inputCallFormatter.mockReturnValueOnce({
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        });

        method.callback = (error, hash) => {
            expect(error).toEqual(false);

            expect(hash).toEqual('0x0');

            expect(transactionSignerMock.sign).toHaveBeenCalledWith(
                {
                    gas: 1,
                    gasPrice: 1,
                    nonce: 1,
                    chainId: 1,
                    to: '0x',
                    data: '0x',
                    value: '0x'
                },
                '0x0'
            );

            expect(getTransactionCountMethodMock.execute).toHaveBeenCalled();

            expect(getTransactionCountMethodMock.parameters).toEqual([0, 'latest']);

            expect(method.rpcMethod).toEqual('eth_sendRawTransaction');

            expect(formatters.inputCallFormatter).toHaveBeenCalledWith(mappedTransaction, moduleInstanceMock);

            expect(Utils.numberToHex).toHaveBeenCalledWith(1);

            done();
        };

        method.execute();
    });

    it('calls execute with no gas defined and uses the defaultGas and returns with a resolved promise', (done) => {
        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.accounts = {wallet: {0: {address: '0x0', privateKey: '0x0'}, accountsIndex: 1}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;
        moduleInstanceMock.defaultGas = 10;

        const transaction = {
            from: 0,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        method.parameters = [transaction];

        const mappedTransaction = {
            from: 0,
            gas: 10,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        };

        Utils.numberToHex.mockReturnValueOnce(1);

        formatters.inputCallFormatter.mockReturnValueOnce({
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        });

        method.callback = (error, hash) => {
            expect(error).toEqual(false);

            expect(hash).toEqual('0x0');

            expect(transactionSignerMock.sign).toHaveBeenCalledWith(
                {
                    gas: 1,
                    gasPrice: 1,
                    nonce: 1,
                    chainId: 1,
                    to: '0x',
                    data: '0x',
                    value: '0x'
                },
                '0x0'
            );

            expect(method.rpcMethod).toEqual('eth_sendRawTransaction');

            expect(formatters.inputCallFormatter).toHaveBeenCalledWith(mappedTransaction, moduleInstanceMock);

            expect(Utils.numberToHex).toHaveBeenCalledWith(1);

            done();
        };

        method.execute();
    });

    it('calls execute with no gasPrice defined and uses the defaultGasPrice and returns with a resolved promise', (done) => {
        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.accounts = {wallet: {0: {address: '0x0', privateKey: '0x0'}, accountsIndex: 1}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;
        moduleInstanceMock.defaultGasPrice = 10;

        const transaction = {
            from: 0,
            gas: 1,
            nonce: 1,
            chainId: 1
        };

        method.parameters = [transaction];

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 10,
            nonce: 1,
            chainId: 1
        };

        Utils.numberToHex.mockReturnValueOnce(1);

        formatters.inputCallFormatter.mockReturnValueOnce({
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        });

        method.callback = (error, hash) => {
            expect(error).toEqual(false);

            expect(hash).toEqual('0x0');

            expect(transactionSignerMock.sign).toHaveBeenCalledWith(
                {
                    gas: 1,
                    gasPrice: 1,
                    nonce: 1,
                    chainId: 1,
                    to: '0x',
                    data: '0x',
                    value: '0x'
                },
                '0x0'
            );

            expect(method.rpcMethod).toEqual('eth_sendRawTransaction');

            expect(formatters.inputCallFormatter).toHaveBeenCalledWith(mappedTransaction, moduleInstanceMock);

            expect(Utils.numberToHex).toHaveBeenCalledWith(1);

            done();
        };

        method.execute();
    });

    it('calls execute and the gasPrice will be defined with "eth_gasPrice" and returns with a resolved promise', (done) => {
        providerMock.send.mockReturnValueOnce(Promise.resolve(10));

        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve({rawTransaction: '0x0'});
        });

        moduleInstanceMock.accounts = {wallet: {0: {address: '0x0', privateKey: '0x0'}, accountsIndex: 1}};
        moduleInstanceMock.transactionSigner = transactionSignerMock;

        const transaction = {
            from: 0,
            gas: 1,
            nonce: 1,
            chainId: 1
        };

        method.parameters = [transaction];

        const mappedTransaction = {
            from: 0,
            gas: 1,
            gasPrice: 10,
            nonce: 1,
            chainId: 1
        };

        Utils.numberToHex.mockReturnValueOnce(1);

        formatters.inputCallFormatter.mockReturnValueOnce({
            from: 0,
            gas: 1,
            gasPrice: 1,
            nonce: 1,
            chainId: 1
        });

        method.callback = (error, hash) => {
            expect(error).toEqual(false);

            expect(hash).toEqual('0x0');

            expect(transactionSignerMock.sign).toHaveBeenCalledWith(
                {
                    gas: 1,
                    gasPrice: 1,
                    nonce: 1,
                    chainId: 1,
                    to: '0x',
                    data: '0x',
                    value: '0x'
                },
                '0x0'
            );

            expect(method.rpcMethod).toEqual('eth_sendRawTransaction');

            expect(formatters.inputCallFormatter).toHaveBeenCalledWith(mappedTransaction, moduleInstanceMock);

            expect(Utils.numberToHex).toHaveBeenCalledWith(1);

            done();
        };

        method.execute();
    });

    it('calls execute and the gasPrice will be defined with "eth_gasPrice" and returns with a reject promise', async () => {
        providerMock.send = jest.fn(() => {
            return Promise.reject(new Error('Nope'));
        });

        const transaction = {
            from: 0,
            gas: 1,
            nonce: 1,
            chainId: 1
        };

        method.parameters = [transaction];

        await expect(method.execute()).rejects.toThrow('Nope');

        expect(providerMock.send).toHaveBeenNthCalledWith(1, 'eth_gasPrice', []);
    });

    it('calls execute and signs on the node', (done) => {
        moduleInstanceMock.transactionSigner = transactionSignerMock;

        const parameters = [
            {
                from: 0,
                gas: 1,
                gasPrice: 1,
                nonce: 1,
                chainId: 1
            }
        ];

        providerMock.send.mockReturnValueOnce(Promise.resolve('0x0'));

        method.parameters = parameters;
        method.callback = (error, hash) => {
            expect(error).toEqual(false);

            expect(hash).toEqual('0x0');

            done();
        };

        method.execute();

        expect(providerMock.send).toHaveBeenCalledWith('eth_sendTransaction', parameters);
    });
});
