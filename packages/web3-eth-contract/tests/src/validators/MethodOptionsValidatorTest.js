import * as Utils from 'web3-utils';
import SendContractMethod from '../../../src/methods/SendContractMethod';
import MethodOptionsValidator from '../../../src/validators/MethodOptionsValidator';

// Mocks
jest.mock('Utils');
jest.mock('../../../src/methods/SendContractMethod');

/**
 * MethodOptionsValidator test
 */
describe('MethodOptionsValidatorTest', () => {
    let methodOptionsValidator, sendContractMethodMock;

    beforeEach(() => {
        new SendContractMethod();
        sendContractMethodMock = SendContractMethod.mock.instances[0];

        methodOptionsValidator = new MethodOptionsValidator(Utils);
    });

    it('constructor check', () => {
        expect(methodOptionsValidator.utils).toEqual(Utils);
    });

    it('calls validate and returns true', () => {
        sendContractMethodMock.parameters = [{value: 100, from: '0x0'}];
        Utils.isAddress.mockReturnValueOnce(true);

        expect(
            methodOptionsValidator.validate(
                {
                    signature: 'constructor',
                    payable: true
                },
                sendContractMethodMock
            )
        ).toEqual(true);

        expect(Utils.isAddress).toHaveBeenCalledWith('0x0');
    });

    it('calls validate and throws isToSet error', () => {
        sendContractMethodMock.parameters = [{value: 100, to: '0x0'}];

        Utils.isAddress.mockReturnValueOnce(false);

        expect(() => {
            methodOptionsValidator.validate({}, sendContractMethodMock);
        }).toThrow("This contract object doesn't have address set yet, please set an address first.");

        expect(Utils.isAddress).toHaveBeenCalledWith('0x0');
    });

    it('calls validate and throws isFromSet error', () => {
        sendContractMethodMock.parameters = [{value: 100, from: 'asdf'}];

        Utils.isAddress.mockReturnValueOnce(false);

        expect(() => {
            methodOptionsValidator.validate(
                {
                    signature: 'constructor'
                },
                sendContractMethodMock
            );
        }).toThrow('No valid "from" address specified in neither the given options, nor the default options.');

        expect(Utils.isAddress).toHaveBeenCalledWith('asdf');
    });

    it('calls validate and throws isValueValid error', () => {
        sendContractMethodMock.parameters = [{value: 100, from: '0x0'}];

        Utils.isAddress.mockReturnValueOnce(true);

        expect(() => {
            methodOptionsValidator.validate(
                {
                    signature: 'constructor',
                    payable: false
                },
                sendContractMethodMock
            );
        }).toThrow('Can not send value to non-payable contract method or constructor');
    });
});
