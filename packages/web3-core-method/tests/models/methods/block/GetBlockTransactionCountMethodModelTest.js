const chai = require('chai');
const sinon = require('sinon').createSandbox();
const expect = chai.expect;
const utils = require('web3-utils');
const formatters = require('web3-core-helpers').formatters;

const GetBlockTransactionCountMethodModel = require('../../../../src/models/methods/block/GetBlockTransactionCountMethodModel');

/**
 * GetBlockTransactionCountMethodModel test
 */
describe('GetBlockTransactionCountMethodModelTest', () => {
    let model;
    let utilsMock;
    let formattersMock;

    beforeEach(() => {
        utilsMock = sinon.mock(utils);
        formattersMock = sinon.mock(formatters);
        model = new GetBlockTransactionCountMethodModel(utils, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_getTransactionByBlockNumberAndIndex', () => {
        expect(model.rpcMethod).to.equal('eth_getTransactionByBlockNumberAndIndex');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount).to.equal(1);
    });

    it('beforeExecution should call method with block hash as parameter and call inputBlockNumberFormatter', () => {
        model.parameters = ['0x0'];

        formattersMock
            .expects('inputBlockNumberFormatter')
            .withArgs(model.parameters[0])
            .returns('0x0')
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).equal('0x0');

        formattersMock.verify();

        expect(model.rpcMethod).equal('eth_getTransactionByBlockHashAndIndex');
    });

    it('beforeExecution should call method with block number as parameter and call inputBlockNumberFormatter', () => {
        model.parameters = [100];

        formattersMock
            .expects('inputBlockNumberFormatter')
            .withArgs(model.parameters[0])
            .returns('0x0')
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).equal('0x0');

        formattersMock.verify();

        expect(model.rpcMethod).equal('eth_getTransactionByBlockNumberAndIndex');
    });

    it('afterExecution should map the hex string to a number', () => {
        utilsMock
            .expects('hexToNumber')
            .withArgs('0x0')
            .returns(100)
            .once();

        expect(model.afterExecution('0x0')).equal(100);

        utilsMock.verify();
    });
});
