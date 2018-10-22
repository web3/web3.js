var chai = require('chai');
var expect = chai.expect;

var SubmitWorkMethodModel = require('../../../../src/models/methods/node/SubmitWorkMethodModel');

/**
 * SubmitWorkMethodModel test
 */
describe('SubmitWorkMethodModelTest', function() {
    var model;

    beforeEach(function() {
        model = new SubmitWorkMethodModel({}, {});
    });

    it('rpcMethod should return eth_submitWork', function() {
        expect(model.rpcMethod).to.equal('eth_submitWork');
    });

    it('parametersAmount should return 3', function() {
        expect(model.parametersAmount).to.equal(3);
    });

    it('beforeExecution should do nothing with the parameters', function() {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should just return the response', function() {
        expect(model.afterExecution('submitWork')).equal('submitWork');
    });
});
