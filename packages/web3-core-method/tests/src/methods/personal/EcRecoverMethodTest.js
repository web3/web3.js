import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import EcRecoverMethod from '../../../../src/methods/personal/EcRecoverMethod';

// Mocks
jest.mock('formatters');

/**
 * EcRecoverMethod test
 */
describe('EcRecoverMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new EcRecoverMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('personal_ecRecover');

        expect(method.parametersAmount).toEqual(3);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [{}, '0x0'];

        formatters.inputSignFormatter.mockReturnValueOnce({sign: true});

        method.beforeExecution();

        expect(method.parameters[0]).toHaveProperty('sign', true);

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputSignFormatter).toHaveBeenCalledWith({});
    });
});
