var chai = require('chai');
var expect = chai.expect;

var GetNodeInfoMethodModel = require('../../../../src/models/methods/node/GetNodeInfoMethodModel');

/**
 * GetNodeInfoMethodModel test
 */
describe('GetNodeInfoMethodModelTest', function() {
    var model;

    beforeEach(function() {
        model = new GetNodeInfoMethodModel({}, {});
    });

    it('rpcMethod should return web3_clientVersion', function() {
        expect(model.rpcMethod).to.equal('web3_clientVersion');
    });

    it('parametersAmount should return 0', function() {
        expect(model.parametersAmount).to.equal(0);
    });

    it('beforeExecution should do nothing with the parameters', function() {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should just return the response', function() {
        expect(model.afterExecution('version')).equal('version');
    });
});
