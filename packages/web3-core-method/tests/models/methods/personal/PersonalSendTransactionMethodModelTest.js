var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon').createSandbox();
var formatters = require('web3-core-helpers').formatters;

var PersonalSendTransactionMethodModel = require('../../../../src/models/methods/personal/PersonalSendTransactionMethodModel');

/**
 * PersonalSendTransactionMethodModel test
 */
describe('PersonalSendTransactionMethodModelTest', function () {
    var model, formattersMock;

    beforeEach(function () {
        formattersMock = sinon.mock(formatters);
        model = new PersonalSendTransactionMethodModel({}, formatters);
    });

    afterEach(function() {
       sinon.restore();
    });

    it('rpcMethod should return personal_sendTransaction', function () {
        expect(model.rpcMethod).to.equal('personal_sendTransaction');
    });

    it('parametersAmount should return 2', function () {
        expect(model.parametersAmount).to.equal(2);
    });

    it('beforeExecution should call inputTransactionFormatter', function () {
        model.parameters = [{}];

        formattersMock
            .expects('inputTransactionFormatter')
            .withArgs({}, {})
            .returns({send: true})
            .once();

        model.beforeExecution({});

        formattersMock.verify();

        expect(model.parameters[0]).to.be.property('send', true);
    });

    it('afterExecution should just return the response', function () {
        expect(model.afterExecution('personalSend')).equal('personalSend');
    });
});
