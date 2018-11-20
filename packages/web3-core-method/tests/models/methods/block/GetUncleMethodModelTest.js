import * as sinonLib from 'sinon';
import utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import GetUncleMethodModel from '../../../../src/models/methods/block/GetUncleMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * GetUncleMethodModel test
 */
describe('GetUncleMethodModelTest', () => {
    let model,
        utilsMock,
        formattersMock;

    beforeEach(() => {
        utilsMock = sinon.mock(utils);
        formattersMock = sinon.mock(formatters);
        model = new GetUncleMethodModel(utils, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_getUncleByBlockNumberAndIndex', () => {
        expect(model.rpcMethod).to.equal('eth_getUncleByBlockNumberAndIndex');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount).to.equal(2);
    });

    it('should call beforeExecution with block hash as parameter and call inputBlockNumberFormatter', () => {
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

    it('should call beforeExecution with block number as parameter and call inputBlockNumberFormatter', () => {
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

    it('afterExecution should map the response', () => {
        formattersMock
            .expects('outputBlockFormatter')
            .withArgs({})
            .returns({block: true})
            .once();

        expect(model.afterExecution({})).to.be.property('block', true);

        formattersMock.verify();
    });
});
