import SubmitWorkMethod from '../../../../src/methods/node/SubmitWorkMethod';

/**
 * SubmitWorkMethod test
 */
describe('SubmitWorkMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SubmitWorkMethod({}, {}, {});
    });

    it('rpcMethod should return eth_submitWork', () => {
        expect(method.rpcMethod)
            .toBe('eth_submitWork');
    });

    it('parametersAmount should return 3', () => {
        expect(method.parametersAmount)
            .toBe(3);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];
        method.beforeExecution();

        expect(method.parameters[0])
            .toBe(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution('submitWork'))
            .toBe('submitWork');
    });
});
