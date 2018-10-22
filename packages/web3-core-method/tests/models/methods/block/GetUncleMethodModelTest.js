var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;
var utils = require('web3-utils');
var formatters = require('web3-core-helpers').formatters;

var GetUncleMethodModel = require('../../../../src/models/methods/block/GetUncleMethodModel');

/**
 * GetUncleMethodModel test
 */
describe('GetUncleMethodModelTest', function() {
    var model, utilsMock, formattersMock;

    beforeEach(function() {
        utilsMock = sinon.mock(utils);
        formattersMock = sinon.mock(formatters);
        model = new GetUncleMethodModel(utils, formatters);
    });

    afterEach(function() {
        sinon.restore();
    });

    it('rpcMethod should return eth_getUncleByBlockNumberAndIndex', function() {
        expect(model.rpcMethod).to.equal('eth_getUncleByBlockNumberAndIndex');
    });

    it('parametersAmount should return 2', function() {
        expect(model.parametersAmount).to.equal(2);
    });

    it('should call beforeExecution with block hash as parameter and call inputBlockNumberFormatter', function() {
        model.parameters = ['0x0', 100];

        formattersMock
            .expects('inputBlockNumberFormatter')
            .withArgs(model.parameters[0])
            .returns('0x0')
            .once();

        utilsMock
            .expects('numberToHex')
            .withArgs(model.parameters[1])
            .returns('0x0')
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).equal('0x0');
        expect(model.parameters[1]).equal('0x0');

        formattersMock.verify();

        expect(model.rpcMethod).equal('eth_getUncleByBlockHashAndIndex');
    });

    it('should call beforeExecution with block number as parameter and call inputBlockNumberFormatter', function() {
        model.parameters = [100, 100];

        formattersMock
            .expects('inputBlockNumberFormatter')
            .withArgs(model.parameters[0])
            .returns('0x0')
            .once();

        utilsMock
            .expects('numberToHex')
            .withArgs(model.parameters[1])
            .returns('0x0')
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).equal('0x0');
        expect(model.parameters[1]).equal('0x0');

        formattersMock.verify();

        expect(model.rpcMethod).equal('eth_getUncleByBlockNumberAndIndex');
    });

    it('afterExecution should map the response', function() {
        formattersMock
            .expects('outputBlockFormatter')
            .withArgs({})
            .returns({block: true})
            .once();

        expect(model.afterExecution({})).to.be.property('block', true);

        formattersMock.verify();
    });
});
