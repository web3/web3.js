const chai = require('chai');
const expect = chai.expect;

const GetNodeInfoMethodModel = require('../../../../src/models/methods/node/GetNodeInfoMethodModel');

/**
 * GetNodeInfoMethodModel test
 */
describe('GetNodeInfoMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new GetNodeInfoMethodModel({}, {});
    });

    it('rpcMethod should return web3_clientVersion', () => {
        expect(model.rpcMethod).to.equal('web3_clientVersion');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount).to.equal(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('version')).equal('version');
    });
});
