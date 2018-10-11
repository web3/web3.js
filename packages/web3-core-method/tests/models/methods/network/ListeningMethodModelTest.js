var chai = require('chai');
var expect = chai.expect;

var ListeningMethodModel = require('../../../../src/models/methods/network/ListeningMethodModel');

/**
 * ListeningMethodModel test
 */
describe('ListeningMethodModelTest', function () {
    var model;

    beforeEach(function () {
        model = new ListeningMethodModel({}, {});
    });

    it('rpcMethod should return net_listening', function () {
        expect(model.rpcMethod).to.equal('net_listening');
    });

    it('parametersAmount should return 0', function () {
        expect(model.parametersAmount).to.equal(0);
    });

    it('beforeExecution should do nothing with the parameters', function () {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should just return the response', function () {
        expect(model.afterExecution('version')).equal('version');
    });
});
