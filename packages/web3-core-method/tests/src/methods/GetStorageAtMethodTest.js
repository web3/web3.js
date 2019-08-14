import AbstractMethod from '../../../lib/methods/AbstractMethod';
import GetStorageAtMethod from '../../../src/methods/GetStorageAtMethod';

/**
 * GetStorageAtMethod test
 */
describe('GetStorageAtMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetStorageAtMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_getStorageAt');

        expect(method.parametersAmount).toEqual(3);
    });

    it(
        'beforeExecution should call the formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter ' +
            'and utils.numberToHex method',
        () => {
            method.parameters = ['string', 100, 100];

            method.beforeExecution();

            expect(method.parameters[0]).toEqual('0x0');

            expect(method.parameters[1]).toEqual('0x0');

            expect(method.parameters[2]).toEqual('0x0');
        }
    );

    it(
        'calls beforeExecution without a callback instead of the optional parameter and should call the inputAddressFormatter, inputDefaultBlockNumberFormatter ' +
            'and numberToHex method',
        () => {
            const callback = jest.fn();
            method.parameters = ['string', 100, callback];

            method.beforeExecution();

            expect(method.callback).toEqual(callback);

            expect(method.parameters[0]).toEqual('0x0');

            expect(method.parameters[1]).toEqual('0x0');

            expect(method.parameters[2]).toEqual('0x0');
        }
    );
});
