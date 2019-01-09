import {formatters} from 'web3-core-helpers';
import EcRecoverMethod from '../../../../src/methods/personal/EcRecoverMethod';

// Mocks
jest.mock('formatters');

/**
 * EcRecoverMethod test
 */
describe('EcRecoverMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new EcRecoverMethod({}, formatters);
    });

    it('static Type property returns "CALL"', () => {
        expect(EcRecoverMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return personal_ecRecover', () => {
        expect(method.rpcMethod).toEqual('personal_ecRecover');
    });

    it('parametersAmount should return 3', () => {
        expect(method.parametersAmount).toEqual(3);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [{}, '0x0'];

        formatters.inputSignFormatter.mockReturnValueOnce({sign: true});

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution();

        expect(method.parameters[0]).toHaveProperty('sign', true);

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputSignFormatter).toHaveBeenCalledWith({});

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('0x0');
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution('submitWork')).toEqual('submitWork');
    });
});
