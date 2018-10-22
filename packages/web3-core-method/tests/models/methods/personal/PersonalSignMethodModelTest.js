var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon').createSandbox();
var formatters = require('web3-core-helpers').formatters;

var PersonalSignMethodModel = require('../../../../src/models/methods/personal/PersonalSignMethodModel');

/**
 * PersonalSignMethodModel test
 */
describe('PersonalSignMethodModelTest', function() {
    var model, formattersMock;

    beforeEach(function() {
        formattersMock = sinon.mock(formatters);
        model = new PersonalSignMethodModel({}, formatters);
    });

    afterEach(function() {
        sinon.restore();
    });

    it('rpcMethod should return personal_sign', function() {
        expect(model.rpcMethod).to.equal('personal_sign');
    });

    it('parametersAmount should return 3', function() {
        expect(model.parametersAmount).to.equal(3);
    });

    it('beforeExecution should call inputSignFormatter and inputAddressFormatter', function() {
        model.parameters = ['sign', '0x0'];

        formattersMock
            .expects('inputSignFormatter')
            .withArgs('sign')
            .returns('signed')
            .once();

        formattersMock
            .expects('inputAddressFormatter')
            .withArgs('0x0')
            .returns('0x00')
            .once();

        model.beforeExecution();

        formattersMock.verify();

        expect(model.parameters[0]).equal('signed');
        expect(model.parameters[1]).equal('0x00');
    });

    it('afterExecution should just return the response', function() {
        expect(model.afterExecution('personalSign')).equal('personalSign');
    });
});
