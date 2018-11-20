import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import GetCodeMethodModel from '../../../src/models/methods/GetCodeMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * GetCodeMethodModel test
 */
describe('GetCodeMethodModelTest', () => {
    let model,
        formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new GetCodeMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_getCode', () => {
        expect(model.rpcMethod).to.equal('eth_getCode');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount).to.equal(2);
    });

    it('beforeExecution should call the inputAddressFormatter and inputDefaultBlockNumberFormatter method', () => {
        model.parameters = ['string', 100];

        formattersMock
            .expects('inputAddressFormatter')
            .withArgs(model.parameters[0])
            .returns('0x0')
            .once();

        formattersMock
            .expects('inputDefaultBlockNumberFormatter')
            .withArgs(model.parameters[1], {})
            .returns('0x0')
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).equal('0x0');
        expect(model.parameters[1]).equal('0x0');

        formattersMock.verify();
    });

    it('afterExecution should just return the response', () => {
        const object = {};

        expect(model.afterExecution(object)).to.equal(object);
    });
});
