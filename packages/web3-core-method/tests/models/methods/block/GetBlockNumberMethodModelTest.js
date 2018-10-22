var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;
var utils = require('web3-utils');

var GetBlockNumberMethodModel = require('../../../../src/models/methods/block/GetBlockNumberMethodModel');

/**
 * GetBlockNumberMethodModel test
 */
describe('GetBlockNumberMethodModelTest', function() {
    var model, utilsMock;

    beforeEach(function() {
        utilsMock = sinon.mock(utils);
        model = new GetBlockNumberMethodModel(utils, {});
    });

    afterEach(function() {
        sinon.restore();
    });

    it('rpcMethod should return eth_blockNumber', function() {
        expect(model.rpcMethod).to.equal('eth_blockNumber');
    });

    it('parametersAmount should return 0', function() {
        expect(model.parametersAmount).to.equal(0);
    });

    it('beforeExecution should do nothing with the parameters', function() {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should map theresponse', function() {
        utilsMock
            .expects('hexToNumber')
            .withArgs('0x0')
            .returns(100)
            .once();

        expect(model.afterExecution('0x0')).equal(100);

        utilsMock.verify();
    });
});
