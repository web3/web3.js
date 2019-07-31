import GetBlockByHashWithPivotAssumptionMethod from '../../../src/methods/GetBlockByHashWithPivotAssumptionMethod';

/**
 * GetBlocksByEpochMethod test
 */
describe('GetBlockByHashWithPivotAssumptionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBlockByHashWithPivotAssumptionMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method.rpcMethod).toEqual('cfx_getBlockByHashWithPivotAssumption');
    });
});
