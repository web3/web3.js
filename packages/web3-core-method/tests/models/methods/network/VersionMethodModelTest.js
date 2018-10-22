var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon').createSandbox();
var utils = require('web3-utils');

var VersionMethodModel = require('../../../../src/models/methods/network/VersionMethodModel');

/**
 * VersionMethodModel test
 */
describe('VersionMethodModelTest', function() {
    var model, utilsMock;

    beforeEach(function() {
        utilsMock = sinon.mock(utils);
        model = new VersionMethodModel(utils, {});
    });

    afterEach(function() {
        sinon.restore();
    });

    it('rpcMethod should return eth_protocolVersion', function() {
        expect(model.rpcMethod).to.equal('eth_protocolVersion');
    });

    it('parametersAmount should return 0', function() {
        expect(model.parametersAmount).to.equal(0);
    });

    it('beforeExecution should do nothing with the parameters', function() {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should map the response', function() {
        utilsMock
            .expects('hexToNumber')
            .withArgs('0x0')
            .returns(100)
            .once();

        expect(model.afterExecution('0x0')).equal(100);

        utilsMock.verify();
    });
});
