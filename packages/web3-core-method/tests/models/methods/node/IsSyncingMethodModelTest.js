var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon').createSandbox();
var formatters = require('web3-core-helpers').formatters;

var IsSyncingMethodModel = require('../../../../src/models/methods/node/IsSyncingMethodModel');

/**
 * IsSyncingMethodModel test
 */
describe('IsSyncingMethodModelTest', function () {
    var model, formattersMock;

    beforeEach(function () {
        formattersMock = sinon.mock(formatters);
        model = new IsSyncingMethodModel({}, formatters);
    });

    afterEach(function () {
        sinon.restore();
    });

    it('rpcMethod should return eth_syncing', function () {
        expect(model.rpcMethod).to.equal('eth_syncing');
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
        formattersMock
            .expects('outputSyncingFormatter')
            .withArgs({})
            .returns({isSyncing: true})
            .once();

        expect(model.afterExecution({})).to.be.property('isSyncing', true);

        formattersMock.verify();
    });
});
