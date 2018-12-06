import {formatters} from 'web3-core-helpers';
import LockAccountMethod from '../../../../src/methods/personal/LockAccountMethod';

// Mocks
jest.mock('formatters');

/**
 * LockAccountMethod test
 */
describe('LockAccountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new LockAccountMethod({}, {}, formatters);
    });

    it('rpcMethod should return personal_lockAccount', () => {
        expect(method.rpcMethod)
            .toBe('personal_lockAccount');
    });

    it('parametersAmount should return 1', () => {
        expect(method.parametersAmount)
            .toBe(1);
    });

    it('beforeExecution should call inputAddressFormatter', () => {
        method.parameters = ['0x0'];

        formatters.inputAddressFormatter
            .mockReturnValueOnce('0x0');

        method.beforeExecution();

        expect(formatters.inputAddressFormatter)
            .toHaveBeenCalledWith('0x0');

        expect(method.parameters[0])
            .toBe('0x0');
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution('lockAccount'))
            .toBe('lockAccount');
    });
});
