import GetNodeInfoMethodModel from '../../../../src/models/methods/node/GetNodeInfoMethodModel';

/**
 * GetNodeInfoMethodModel test
 */
describe('GetNodeInfoMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetNodeInfoMethodModel({}, {});
    });

    it('rpcMethod should return web3_clientVersion', () => {
        expect(model.rpcMethod)
            .toBe('web3_clientVersion');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount)
            .toBe(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0])
            .toBe(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('version'))
            .toBe('version');
    });
});
