var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon').createSandbox();
var formatters = require('web3-core-helpers').formatters;

var UnlockAccountMethodModel = require('../../../../src/models/methods/personal/UnlockAccountMethodModel');

/**
 * UnlockAccountMethodModel test
 */
describe('UnlockAccountMethodModelTest', function () {
    var model, formattersMock;

    beforeEach(function () {
        formattersMock = sinon.mock(formatters);
        model = new UnlockAccountMethodModel({}, formatters);
    });

    afterEach(function() {
       sinon.restore();
    });

    it('rpcMethod should return personal_unlockAccount', function () {
        expect(model.rpcMethod).to.equal('personal_unlockAccount');
    });

    it('parametersAmount should return 3', function () {
        expect(model.parametersAmount).to.equal(3);
    });

    it('beforeExecution should call inputSignFormatter and inputAddressFormatter', function () {
        model.parameters = ['0x0'];

        formattersMock
            .expects('inputAddressFormatter')
            .withArgs('0x0')
            .returns('0x00')
            .once();

        model.beforeExecution();

        formattersMock.verify();

        expect(model.parameters[0]).equal('0x00');
    });

    it('afterExecution should just return the response', function () {
        expect(model.afterExecution('unlockAccount')).equal('unlockAccount');
    });
});
