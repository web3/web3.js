import {formatters} from 'web3-core-helpers';
import PersonalSignMethod from '../../../../src/methods/personal/PersonalSignMethod';

// Mocks
jest.mock('formatters');

/**
 * PersonalSignMethod test
 */
describe('PersonalSignMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new PersonalSignMethod({}, formatters);
    });

    it('static Type property returns "CALL"', () => {
        expect(PersonalSignMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return personal_sign', () => {
        expect(method.rpcMethod).toEqual('personal_sign');
    });

    it('parametersAmount should return 3', () => {
        expect(method.parametersAmount).toEqual(3);
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

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution('personalSign')).toEqual('personalSign');
    });
});
