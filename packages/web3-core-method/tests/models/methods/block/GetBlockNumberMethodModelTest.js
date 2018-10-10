var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var utils = require('web3-utils');

var GetBlockNumberMethodModel = require('../../../../src/models/methods/block/GetBlockNumberMethodModel');

/**
 * GetBlockNumberMethodModel test
 */
describe('GetBlockNumberMethodModelTest', function () {
    var model,
        utilsMock = sinon.mock(utils);

    beforeEach(function () {
        model = new GetBlockNumberMethodModel(utils, {});
    });

    after(function () {
        utilsMock.restore();
    });

    describe('rpcMethod', function () {
        it('should return eth_blockNumber', function () {
            expect(model.rpcMethod).to.equal('eth_blockNumber');
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
            utilsMock
                .expects('hexToNumber')
                .withArgs('0x0')
                .returns(100)
                .once();

            expect(model.afterExecution('0x0')).equal(100);
        });
    });
});
