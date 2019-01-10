import {formatters} from 'web3-core-helpers';
import {WebsocketProvider} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import SignMethod from '../../../src/methods/SignMethod';
import Accounts from '../../__mocks__/Accounts';
import MessageSigner from '../../../src/signers/MessageSigner';
import AbstractMethod from '../../../lib/methods/AbstractMethod';

// Mocks
jest.mock('WebsocketProvider');
jest.mock('AbstractWeb3Module');
jest.mock('formatters');
jest.mock('../../../src/signers/MessageSigner');

/**
 * SignMethod test
 */
describe('SignMethodTest', () => {
    let method, providerMock, moduleInstanceMock, messageSignerMock, accountsMock;

    beforeEach(() => {
        new WebsocketProvider({});
        providerMock = WebsocketProvider.mock.instances[0];
        providerMock.send = jest.fn();

        new AbstractWeb3Module(providerMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        accountsMock = new Accounts();

        new MessageSigner(accountsMock);
        messageSignerMock = MessageSigner.mock.instances[0];

        method = new SignMethod({}, formatters, accountsMock, messageSignerMock);
        method.callback = jest.fn();
    });

    it('contructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(SignMethod.Type).toEqual('CALL');

        expect(method.parametersAmount).toEqual(2);

        expect(method.rpcMethod).toEqual('eth_sign');

        expect(method.utils).toEqual({});

        expect(method.formatters).toEqual(formatters);

        expect(method.accounts).toEqual(accountsMock);

        expect(method.messageSigner).toEqual(messageSignerMock);
    });

    it('calls execute with wallets defined', async () => {
        method.parameters = ['nope', '0x00'];

        accountsMock.wallet[0] = {privateKey: '0x0'};

        formatters.inputSignFormatter.mockReturnValueOnce('string');

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        messageSignerMock.sign.mockReturnValueOnce('0x00');

        const response = await method.execute(moduleInstanceMock);

        expect(response).toEqual('0x00');

        expect(method.callback).toHaveBeenCalledWith(false, '0x00');

        expect(method.parameters[0]).toEqual('string');

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputSignFormatter).toHaveBeenCalledWith('nope');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('0x00');
    });

    it('calls execute with wallets defined but MessageSigner throws error', async () => {
        method.parameters = ['nope', '0x00'];

        accountsMock.wallet[0] = {privateKey: '0x0'};

        const error = new Error('SIGN ERROR');
        messageSignerMock.sign = jest.fn(() => {
            throw error;
        });

        try {
            await method.execute(moduleInstanceMock);
        } catch (error2) {
            expect(error2).toEqual(error);

            expect(method.callback).toHaveBeenCalledWith(error, null);
        }
    });

    it('calls execute without wallets defined', async () => {
        method.parameters = ['nope', '0x00'];

        formatters.inputSignFormatter.mockReturnValueOnce('string');

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        messageSignerMock.sign.mockReturnValueOnce('0x00');

        providerMock.send.mockReturnValueOnce(Promise.resolve('0x0'));

        moduleInstanceMock.currentProvider = providerMock;

        const response = await method.execute(moduleInstanceMock);

        expect(response).toEqual('0x0');

        expect(method.callback).toHaveBeenCalledWith(false, '0x0');

        expect(method.parameters[0]).toEqual('string');

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputSignFormatter).toHaveBeenCalledWith('nope');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('0x00');
    });

    it('beforeExecution should call the inputSignFormatter and inputAddressFormatter', () => {
        method.parameters = ['string', 'string'];

        formatters.inputSignFormatter.mockReturnValueOnce('string');

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('string');

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputSignFormatter).toHaveBeenCalledWith('string');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('string');
    });

    it('afterExecution should just return the response', () => {
        const object = {};

        expect(method.afterExecution(object)).toEqual(object);
    });
});
