import {formatters} from 'web3-core-helpers';
import utils from 'web3-utils';
import GetStorageAtMethodModel from '../../../src/models/methods/GetStorageAtMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * GetStorageAtMethodModel test
 */
describe('GetStorageAtMethodModelTest', () => {
    let model,
        formattersMock,
        utilsMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        utilsMock = sinon.mock(utils);
        model = new GetStorageAtMethodModel(utils, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_getStorageAt', () => {
        expect(model.rpcMethod).to.equal('eth_getStorageAt');
    });

    it('parametersAmount should return 3', () => {
        expect(model.parametersAmount).to.equal(3);
    });

    it(
        'beforeExecution should call the formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter ' +
            'and utils.numberToHex method',
        () => {
            model.parameters = ['string', 100, 100];

            formattersMock
                .expects('inputAddressFormatter')
                .withArgs(model.parameters[0])
                .returns('0x0')
                .once();

            utilsMock
                .expects('numberToHex')
                .withArgs(model.parameters[1])
                .returns('0x0')
                .once();

            formattersMock
                .expects('inputDefaultBlockNumberFormatter')
                .withArgs(model.parameters[2])
                .returns('0x0')
                .once();

            model.beforeExecution({});

            expect(model.parameters[0]).equal('0x0');
            expect(model.parameters[1]).equal('0x0');
            expect(model.parameters[2]).equal('0x0');

            formattersMock.verify();
        }
    );

    it('afterExecution should just return the response', () => {
        const object = {};

        expect(model.afterExecution(object)).to.equal(object);
    });
});
