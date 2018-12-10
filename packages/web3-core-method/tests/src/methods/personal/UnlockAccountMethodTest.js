import {formatters} from 'web3-core-helpers';
import UnlockAccountMethod from '../../../../src/methods/personal/UnlockAccountMethod';

// Mocks
jest.mock('formatters');

/**
 * UnlockAccountMethod test
 */
describe('UnlockAccountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new UnlockAccountMethod({}, {}, formatters);
    });

    it('rpcMethod should return personal_unlockAccount', () => {
        expect(method.rpcMethod)
            .toBe('personal_unlockAccount');
    });

    it('parametersAmount should return 3', () => {
        expect(method.parametersAmount)
            .toBe(3);
    });

    it('beforeExecution should call inputSignFormatter and inputAddressFormatter', () => {
        method.parameters = ['0x0'];

        formatters.inputAddressFormatter
            .mockReturnValueOnce('0x00');

        method.beforeExecution();

        expect(formatters.inputAddressFormatter)
            .toHaveBeenCalledWith('0x0');

        expect(method.parameters[0]).toBe('0x00');
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution('unlockAccount'))
            .toBe('unlockAccount');
    });
});
