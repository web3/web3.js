import ListeningMethod from '../../../../src/methods/network/ListeningMethod';

/**
 * ListeningMethod test
 */
describe('ListeningMethodTest', () => {
    let model;

    beforeEach(() => {
        model = new ListeningMethod({}, {});
    });

    it('static Type property returns "CALL"', () => {
        expect(ListeningMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return net_listening', () => {
        expect(model.rpcMethod).toEqual('net_listening');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount).toEqual(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).toEqual(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('version')).toEqual('version');
    });
});
