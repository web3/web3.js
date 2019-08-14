import AbstractMethod from '../../../lib/methods/AbstractMethod';
import CallMethod from '../../../src/methods/CallMethod';

/**
 * CallMethod test
 */
describe('CallMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new CallMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_call');

        expect(method.parametersAmount).toEqual(2);
    });

    it('beforeExecution should call inputCallFormatter and inputDefaultBlockNumberFormatter', () => {
        method.parameters = [{}, 100];

        method.beforeExecution();

        expect(method.parameters[0]).toHaveProperty('empty', true);

        expect(method.parameters[1]).toEqual({empty: true});
    });

    it('calls beforeExecution with a callback instead of the optional paramter and it calls the inputCallFormatter and inputDefaultBlockNumberFormatter', () => {
        const callback = jest.fn();
        method.parameters = [{}, callback];

        method.beforeExecution();

        expect(method.callback).toEqual(callback);

        expect(method.parameters[0]).toEqual({empty: true});

        expect(method.parameters[1]).toEqual('0x0');
    });
});
