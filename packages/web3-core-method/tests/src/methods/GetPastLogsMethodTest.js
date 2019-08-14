import AbstractMethod from '../../../lib/methods/AbstractMethod';
import GetPastLogsMethod from '../../../src/methods/GetPastLogsMethod';

/**
 * GetPastLogsMethod test
 */
describe('GetPastLogsMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetPastLogsMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_getLogs');

        expect(method.parametersAmount).toEqual(1);
    });

    it('beforeExecution should call the inputAddressFormatter and inputDefaultBlockNumberFormatter method', () => {
        method.parameters = [{}];

        method.beforeExecution();

        expect(method.parameters[0]).toHaveProperty('empty', true);
    });

    it('afterExecution should call the outputLogFormatter and return the response', () => {
        expect(method.afterExecution([{}])[0]).toHaveProperty('formatted', true);
    });
});
