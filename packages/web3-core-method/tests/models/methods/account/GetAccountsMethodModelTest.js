var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var utils = require('web3-utils');

var GetAccountsMethodModel = require('../../../../src/models/methods/account/GetAccountsMethodModel');

/**
 * GetAccountsMethodModel test
 */
describe('GetAccountsMethodModelTest', function () {
    var model,
        utilsMock = sinon.mock(utils);

    beforeEach(function () {
        model = new GetAccountsMethodModel(utils, {});
    });

    after(function () {
        utilsMock.restore();
    });

    describe('rpcMethod', function () {
        it('should return eth_accounts', function () {
            expect(model.rpcMethod).to.equal('eth_accounts');
        });
    });

    describe('parametersAmount', function () {
        it('should return 0', function () {
            expect(model.parametersAmount).to.equal(0);
        });
    });

    describe('beforeExecution', function () {
        it('should do nothing with the parameters', function () {
            model.parameters = [];
            model.beforeExecution();

            expect(model.parameters[0]).equal(undefined);
        });
    });

    describe('afterExecution', function () {
        it('should just return the response', function () {
            var response = [{}];

            utilsMock
                .expects('toChecksumAddress')
                .withArgs(response[0])
                .returns('0x0')
                .once();

            expect(model.afterExecution([{}])[0]).equal('0x0');

            utilsMock.verify();
        });
    });
});
