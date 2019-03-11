import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import PersonalSignMethod from '../../../../src/methods/personal/PersonalSignMethod';

// Mocks
jest.mock('formatters');

/**
 * PersonalSignMethod test
 */
describe('PersonalSignMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new PersonalSignMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('personal_sign');

        expect(method.parametersAmount).toEqual(3);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('beforeExecution should call inputSignFormatter and inputAddressFormatter', () => {
        method.parameters = ['sign', '0x0'];

        formatters.inputSignFormatter.mockReturnValueOnce('signed');

        formatters.inputAddressFormatter.mockReturnValueOnce('0x00');

        method.beforeExecution();

        expect(method.parameters[0]).toEqual('signed');

        expect(method.parameters[1]).toEqual('0x00');

        expect(formatters.inputSignFormatter).toHaveBeenCalledWith('sign');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('0x0');
    });
});
