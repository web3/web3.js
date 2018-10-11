var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon').createSandbox();
var formatters = require('web3-core-helpers').formatters;

var EcRecoverMethodModel = require('../../../../src/models/methods/personal/EcRecoverMethodModel');

/**
 * EcRecoverMethodModel test
 */
describe('EcRecoverMethodModelTest', function () {
    var model, formattersMock;

    beforeEach(function () {
        formattersMock = sinon.mock(formatters);
        model = new EcRecoverMethodModel({}, formatters);
    });

    afterEach(function() {
       sinon.restore();
    });

    it('rpcMethod should return personal_ecRecover', function () {
        expect(model.rpcMethod).to.equal('personal_ecRecover');
    });

    it('parametersAmount should return 3', function () {
        expect(model.parametersAmount).to.equal(3);
    });

    it('beforeExecution should do nothing with the parameters', function () {
        model.parameters = [{}, '0x0'];

        formattersMock
            .expects('inputSignFormatter')
            .withArgs(model.parameters[0])
            .returns({sign: true})
            .once();

        formattersMock
            .expects('inputAddressFormatter')
            .withArgs(model.parameters[1])
            .returns('0x0')
            .once();

        model.beforeExecution();

        expect(model.parameters[0]).to.be.property('sign', true);
        expect(model.parameters[1]).equal('0x0');

        formattersMock.verify();

    });

    it('afterExecution should just return the response', function () {
        expect(model.afterExecution('submitWork')).equal('submitWork');
    });
});
