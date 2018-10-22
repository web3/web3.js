var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon').createSandbox();
var formatters = require('web3-core-helpers').formatters;

var LockAccountMethodModel = require('../../../../src/models/methods/personal/LockAccountMethodModel');

/**
 * LockAccountMethodModel test
 */
describe('LockAccountMethodModelTest', function() {
    var model, formattersMock;

    beforeEach(function() {
        formattersMock = sinon.mock(formatters);
        model = new LockAccountMethodModel({}, formatters);
    });

    afterEach(function() {
        sinon.restore();
    });

    it('rpcMethod should return personal_lockAccount', function() {
        expect(model.rpcMethod).to.equal('personal_lockAccount');
    });

    it('parametersAmount should return 1', function() {
        expect(model.parametersAmount).to.equal(1);
    });

    it('beforeExecution should call inputAddressFormatter', function() {
        model.parameters = ['0x0'];

        formattersMock
            .expects('inputAddressFormatter')
            .withArgs('0x0')
            .returns('0x0')
            .once();

        model.beforeExecution();

        formattersMock.verify();

        expect(model.parameters[0]).equal('0x0');
    });

    it('afterExecution should just return the response', function() {
        expect(model.afterExecution('lockAccount')).equal('lockAccount');
    });
});
