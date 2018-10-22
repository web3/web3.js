var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;
var utils = require('web3-utils');

var GetAccountsMethodModel = require('../../../../src/models/methods/account/GetAccountsMethodModel');

/**
 * GetAccountsMethodModel test
 */
describe('GetAccountsMethodModelTest', function() {
    var model, utilsMock;

    beforeEach(function() {
        utilsMock = sinon.mock(utils);
        model = new GetAccountsMethodModel(utils, {});
    });

    afterEach(function() {
        sinon.restore();
    });

    it('rpcMethod should return eth_accounts', function() {
        expect(model.rpcMethod).to.equal('eth_accounts');
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
        utilsMock
            .expects('toChecksumAddress')
            .withArgs({})
            .returns('0x0')
            .once();

        expect(model.afterExecution([{}])[0]).equal('0x0');

        utilsMock.verify();
    });
});
