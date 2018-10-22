var chai = require('chai');
var expect = chai.expect;

var GetWorkMethodModel = require('../../../../src/models/methods/node/GetWorkMethodModel');

/**
 * GetWorkMethodModel test
 */
describe('GetWorkMethodModelTest', function() {
    var model;

    beforeEach(function() {
        model = new GetWorkMethodModel({}, {});
    });

    it('rpcMethod should return eth_getWork', function() {
        expect(model.rpcMethod).to.equal('eth_getWork');
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
