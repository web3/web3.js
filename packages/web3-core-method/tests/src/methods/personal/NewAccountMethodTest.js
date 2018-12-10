import * as Utils from 'web3-utils';
import NewAccountMethod from '../../../../src/methods/personal/NewAccountMethod';

// Mocks
jest.mock('Utils');

/**
 * NewAccountMethod test
 */
describe('NewAccountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new NewAccountMethod(Utils, {});
    });

    it('static Type property returns "CALL"', () => {
        expect(NewAccountMethod.Type)
            .toBe('CALL');
    });

    it('rpcMethod should return personal_newAccount', () => {
        expect(method.rpcMethod)
            .toBe('personal_newAccount');
    });

    it('parametersAmount should return 0', () => {
        expect(method.parametersAmount)
            .toBe(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];
        method.beforeExecution();

        expect(method.parameters[0])
            .toBe(undefined);
    });

    it('afterExecution should just return the response', () => {
        Utils.toChecksumAddress
            .mockReturnValueOnce('0x0');

        expect(method.afterExecution('0x0'))
            .toBe('0x0');

        expect(Utils.toChecksumAddress)
            .toHaveBeenCalledWith('0x0');
    });
});
