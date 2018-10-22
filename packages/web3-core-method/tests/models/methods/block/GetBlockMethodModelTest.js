var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;

var GetBlockMethodModel = require('../../../../src/models/methods/block/GetBlockMethodModel');

/**
 * GetBlockMethodModel test
 */
describe('GetBlockMethodModelTest', function() {
    var model, formattersMock;

    beforeEach(function() {
        formattersMock = sinon.mock(formatters);
        model = new GetBlockMethodModel({}, formatters);
    });

    afterEach(function() {
        sinon.restore();
    });

    it('rpcMethod should return eth_getBlockByNumber', function() {
        expect(model.rpcMethod).to.equal('eth_getBlockByNumber');
    });

    it('parametersAmount should return 2', function() {
        expect(model.parametersAmount).to.equal(2);
    });

    it('should call beforeExecution with block hash as parameter and call inputBlockNumberFormatter', function() {
        model.parameters = ['0x0', true];

        formattersMock
            .expects('inputBlockNumberFormatter')
            .withArgs(model.parameters[0])
            .returns('0x0')
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).equal('0x0');
        expect(model.parameters[1]).to.be.true;

        formattersMock.verify();

        expect(model.rpcMethod).equal('eth_getBlockByHash');
    });

    it('should call beforeExecution with block number as parameter and call inputBlockNumberFormatter', function() {
        model.parameters = [100, true];

        formattersMock
            .expects('inputBlockNumberFormatter')
            .withArgs(model.parameters[0])
            .returns('0x0')
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).equal('0x0');
        expect(model.parameters[1]).to.be.true;

        formattersMock.verify();

        expect(model.rpcMethod).equal('eth_getBlockByNumber');
    });

    it('afterExecution should map the response', function() {
        formattersMock
            .expects('outputBlockFormatter')
            .withArgs({})
            .returns({empty: false})
            .once();

        expect(model.afterExecution({})).to.have.property('empty', false);

        formattersMock.verify();
    });
});
