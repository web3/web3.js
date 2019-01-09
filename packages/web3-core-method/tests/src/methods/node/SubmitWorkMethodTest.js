import SubmitWorkMethod from '../../../../src/methods/node/SubmitWorkMethod';

/**
 * SubmitWorkMethod test
 */
describe('SubmitWorkMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SubmitWorkMethod({}, {});
    });

    it('static Type property returns "CALL"', () => {
        expect(SubmitWorkMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_submitWork', () => {
        expect(method.rpcMethod).toEqual('eth_submitWork');
    });

    it('parametersAmount should return 3', () => {
        expect(method.parametersAmount).toEqual(3);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];
        method.beforeExecution();

        expect(method.parameters[0]).toEqual(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution('submitWork')).toEqual('submitWork');
    });
});
