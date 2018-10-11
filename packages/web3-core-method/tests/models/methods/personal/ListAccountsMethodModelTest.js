var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon').createSandbox();
var utils = require('web3-utils');

var ListAccountsMethodModel = require('../../../../src/models/methods/personal/ListAccountsMethodModel');

/**
 * ListAccountsMethodModel test
 */
describe('ListAccountsMethodModelTest', function () {
    var model, utilsMock;

    beforeEach(function () {
        utilsMock = sinon.mock(utils);
        model = new ListAccountsMethodModel(utils, {});
    });

    afterEach(function() {
       sinon.restore();
    });

    it('rpcMethod should return personal_listAccounts', function () {
        expect(model.rpcMethod).to.equal('personal_listAccounts');
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
        utilsMock
            .expects('toChecksumAddress')
            .withArgs('0x0')
            .returns('0x0')
            .once();

        expect(model.afterExecution(['0x0'])[0]).equal('0x0');

        utilsMock.verify();
    });
});
