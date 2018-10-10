var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;

var GetBlockMethodModel = require('../../../../src/models/methods/block/GetBlockMethodModel');

/**
 * GetBlockMethodModel test
 */
describe('GetBlockMethodModelTest', function () {
    var model,
        formattersMock = sinon.mock(formatters);

    beforeEach(function () {
        model = new GetBlockMethodModel({}, formatters);
    });

    after(function () {
        formattersMock.restore();
    });

    describe('rpcMethod', function () {
        it('should return eth_getBlockByNumber', function () {
            expect(model.rpcMethod).to.equal('eth_getBlockByNumber');
        });
    });

    describe('parametersAmount', function () {
        it('should return 2', function () {
            expect(model.parametersAmount).to.equal(2);
        });
    });

    describe('beforeExecution', function () {
        it('should call method with block hash as parameter and call inputBlockNumberFormatter', function () {
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

        it('should call method with block number as parameter and call inputBlockNumberFormatter', function () {
            formattersMock = sinon.mock(formatters);// Because mock.restore() does not work as expected.
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
    });

    describe('afterExecution', function () {
        it('should just return the response', function () {
            formattersMock
                .expects('outputBlockFormatter')
                .withArgs({})
                .returns({empty: false})
                .once();

            expect(model.afterExecution({})).to.have.property('empty', false);
        });
    });
});
