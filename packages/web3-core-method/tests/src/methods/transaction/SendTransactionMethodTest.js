import {formatters} from 'web3-core-helpers';
import {PromiEvent} from 'web3-core-promievent';
import {WebsocketProvider} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import Accounts from '../../../__mocks__/Accounts';
import SendRawTransactionMethod from '../../../../src/methods/transaction/SendRawTransactionMethod';
import TransactionSigner from '../../../../src/signers/TransactionSigner';
import TransactionConfirmationWorkflow from '../../../../src/workflows/TransactionConfirmationWorkflow';
import SendTransactionMethod from '../../../../src/methods/transaction/SendTransactionMethod';

// Mocks
jest.mock('formatters');
jest.mock('WebsocketProvider');
jest.mock('AbstractWeb3Module');
jest.mock('../../../../src/workflows/TransactionConfirmationWorkflow');
jest.mock('../../../../src/signers/TransactionSigner');
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

        new TransactionSigner(accountsMock);
        transactionSignerMock = TransactionSigner.mock.instances[0];

        promiEvent = new PromiEvent();

        new TransactionConfirmationWorkflow({}, {}, {});
        transactionConfirmationWorkflowMock = TransactionConfirmationWorkflow.mock.instances[0];

        new SendRawTransactionMethod();
        sendRawTransactionMethodMock = SendRawTransactionMethod.mock.instances[0];

        method = new SendTransactionMethod(
            {},
            formatters,
            transactionConfirmationWorkflowMock,
            accountsMock,
            transactionSignerMock,
            sendRawTransactionMethodMock
        );

        method.callback = jest.fn();
        method.parameters = [{}];
    });

    it('constructor check', () => {
        expect(SendTransactionMethod.Type).toEqual('SEND');

        expect(method.rpcMethod).toEqual('eth_sendTransaction');

        expect(method.parametersAmount).toEqual(1);

        expect(method.accounts).toEqual(accountsMock);

        expect(method.transactionConfirmationWorkflow).toEqual(transactionConfirmationWorkflowMock);

        expect(method.transactionSigner).toEqual(transactionSignerMock);
    });

    it('calls execute with wallets defined', async () => {
        accountsMock.wallet[0] = {privateKey: '0x0'};

        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve('0x0');
        });

        providerMock.send = jest.fn(() => {
            return Promise.resolve('0x0');
        });

        moduleInstanceMock.currentProvider = providerMock;

        sendRawTransactionMethodMock.execute = jest.fn((moduleInstance, givenPromiEvent) => {
            expect(moduleInstance).toEqual(moduleInstanceMock);

            expect(givenPromiEvent).toEqual(promiEvent);

            givenPromiEvent.resolve(true);
        });

        const response = await method.execute(moduleInstanceMock, promiEvent);

        expect(response).toEqual(true);

        expect(transactionSignerMock.sign).toHaveBeenCalledWith({gasPrice: '0x0'});
    });

    it('calls execute with wallets defined and uses the module default gas properties', async () => {
        accountsMock.wallet[0] = {privateKey: '0x0'};

        transactionSignerMock.sign = jest.fn(() => {
            return Promise.resolve('0x0');
        });

        providerMock.send = jest.fn(() => {
            return Promise.resolve('0x0');
        });

        moduleInstanceMock.currentProvider = providerMock;
        moduleInstanceMock.defaultGas = 100;
        moduleInstanceMock.defaultGasPrice = 100;

        sendRawTransactionMethodMock.execute = jest.fn((moduleInstance, givenPromiEvent) => {
            expect(moduleInstance).toEqual(moduleInstanceMock);

            expect(givenPromiEvent).toEqual(promiEvent);

            givenPromiEvent.resolve(true);
        });

        const response = await method.execute(moduleInstanceMock, promiEvent);

        expect(response).toEqual(true);

        expect(method.parameters[0].gas).toEqual(100);

        expect(method.parameters[0].gasPrice).toEqual(100);

        expect(transactionSignerMock.sign).toHaveBeenCalledWith({gasPrice: 100, gas: 100});
    });

    it('calls execute and TransactionSigner throws error', async (done) => {
        accountsMock.wallet[0] = {privateKey: '0x0'};

        providerMock.send = jest.fn(() => {
            return Promise.resolve('0x0');
        });

        const error = new Error('SIGN ERROR');
        transactionSignerMock.sign = jest.fn(() => {
            return new Promise((resolve, reject) => {
                reject(error);
            });
        });

        moduleInstanceMock.currentProvider = providerMock;

        promiEvent.on('error', (e) => {
            expect(e).toEqual(error);

            expect(providerMock.send).toHaveBeenCalledWith('eth_gasPrice', []);

            expect(transactionSignerMock.sign).toHaveBeenCalledWith({gasPrice: '0x0'});

            done();
        });

        try {
            await method.execute(moduleInstanceMock, promiEvent);
        } catch (error2) {
            expect(error2).toEqual(error);

            expect(method.callback).toHaveBeenCalledWith(error, null);
        }
    });

    it('calls execute without wallets defined', async (done) => {
        method.parameters = [{gasPrice: false}];

        providerMock.send = jest.fn(() => {
            return Promise.resolve('0x0');
        });

        moduleInstanceMock.currentProvider = providerMock;

        promiEvent.on('transactionHash', (response) => {
            expect(response).toEqual('0x0');

            expect(transactionConfirmationWorkflowMock.execute).toHaveBeenCalledWith(
                method,
                moduleInstanceMock,
                '0x0',
                promiEvent
            );

            expect(providerMock.send).toHaveBeenCalledWith(method.rpcMethod, method.parameters);

            done();
        });

        const response = await method.execute(moduleInstanceMock, promiEvent);

        expect(response).toEqual('0x0');

        expect(method.callback).toHaveBeenCalledWith(false, '0x0');
    });
});
