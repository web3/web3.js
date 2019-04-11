import {formatters} from 'conflux-web-core-helpers';
import {SignTransactionMethod} from 'conflux-web-core-method';
import CfxSignTransactionMethod from '../../../src/methods/CfxSignTransactionMethod';

// Mocks
jest.mock('conflux-web-core-helpers');

/**
 * CfxSignTransactionMethod test
 */
describe('CfxSignTransactionMethodTest', () => {
    let method, moduleInstanceMock;

    beforeEach(() => {
        moduleInstanceMock = {};
        moduleInstanceMock.accounts = {wallet: {'0x0': {privateKey: '0x0'}}};
        moduleInstanceMock.transactionSigner = {
            sign: jest.fn(() => {
                return Promise.resolve('0x00');
            })
        };

        method = new CfxSignTransactionMethod(null, formatters, moduleInstanceMock);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(SignTransactionMethod);
    });

    it('beforeExecution should execute the inputTransactionFormatter', () => {
        method.parameters = [{}];

        formatters.inputTransactionFormatter.mockReturnValueOnce({empty: false});

        method.beforeExecution({});

        expect(method.parameters[0]).toHaveProperty('empty', false);

        expect(formatters.inputTransactionFormatter).toHaveBeenCalledWith({}, {});
    });

    it('calls execute and a local unlocked account does exist', async () => {
        method.parameters = [{}, '0x0'];

        const response = await method.execute();

        expect(response).toEqual('0x00');

        expect(method.moduleInstance.transactionSigner.sign).toHaveBeenCalledWith({}, '0x0');
    });

    it('calls execute and a local unlocked account does not exist', async () => {
        moduleInstanceMock.accounts = {wallet: {}};
        moduleInstanceMock.currentProvider = {send: jest.fn()};

        method.parameters = [{}];
        method.execute();

        expect(moduleInstanceMock.currentProvider.send).toHaveBeenCalledWith('cfx_signTransaction', method.parameters);
    });
});
