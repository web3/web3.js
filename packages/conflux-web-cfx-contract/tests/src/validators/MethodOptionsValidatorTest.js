import * as Utils from 'conflux-web-utils';
import SendContractMethod from '../../../src/methods/SendContractMethod';
import MethodOptionsValidator from '../../../src/validators/MethodOptionsValidator';

// Mocks
jest.mock('conflux-web-utils');
jest.mock('../../../src/methods/SendContractMethod');

/**
 * MethodOptionsValidator test
 */
describe('MethodOptionsValidatorTest', () => {
    let methodOptionsValidator, sendContractMethodMock, abiItemModelMock;

    beforeEach(() => {
        abiItemModelMock = {isOfType: jest.fn()};

        new SendContractMethod();
        sendContractMethodMock = SendContractMethod.mock.instances[0];

        methodOptionsValidator = new MethodOptionsValidator(Utils);
    });

    it('constructor check', () => {
        expect(methodOptionsValidator.utils).toEqual(Utils);
    });

    it('calls validate and returns true', () => {
        abiItemModelMock.signature = 'constructor';
        abiItemModelMock.payable = true;
        abiItemModelMock.isOfType.mockReturnValueOnce(true);

        sendContractMethodMock.parameters = [{value: 100, from: '0x0'}];

        Utils.isAddress.mockReturnValueOnce(true);

        expect(methodOptionsValidator.validate(abiItemModelMock, sendContractMethodMock)).toEqual(true);

        expect(Utils.isAddress).toHaveBeenCalledWith('0x0');

        expect(abiItemModelMock.isOfType).toHaveBeenCalledWith('constructor');
    });

    it('calls validate and throws isToSet error', () => {
        abiItemModelMock.isOfType.mockReturnValueOnce(false);

        sendContractMethodMock.parameters = [{value: 100, to: '0x0'}];

        Utils.isAddress.mockReturnValueOnce(false);

        expect(() => {
            methodOptionsValidator.validate(abiItemModelMock, sendContractMethodMock);
        }).toThrow("This contract object doesn't have address set yet, please set an address first.");

        expect(Utils.isAddress).toHaveBeenCalledWith('0x0');

        expect(abiItemModelMock.isOfType).toHaveBeenCalledWith('constructor');
    });

    it('calls validate and throws isFromSet error', () => {
        abiItemModelMock.signature = 'constructor';
        abiItemModelMock.isOfType.mockReturnValueOnce(true);

        sendContractMethodMock.parameters = [{value: 100, from: 'asdf'}];

        Utils.isAddress.mockReturnValueOnce(false);

        expect(() => {
            methodOptionsValidator.validate(abiItemModelMock, sendContractMethodMock);
        }).toThrow('No valid "from" address specified in neither the given options, nor the default options.');

        expect(Utils.isAddress).toHaveBeenCalledWith('asdf');
    });

    it('calls validate and throws isValueValid error', () => {
        abiItemModelMock.signature = 'constructor';
        abiItemModelMock.payable = false;
        abiItemModelMock.isOfType.mockReturnValueOnce(true);

        sendContractMethodMock.parameters = [{value: 100, from: '0x0'}];

        Utils.isAddress.mockReturnValueOnce(true);

        expect(() => {
            methodOptionsValidator.validate(abiItemModelMock, sendContractMethodMock);
        }).toThrow('Can not send value to non-payable contract method or constructor');
    });

    it('calls validate returns true with payable true and value set to 0', () => {
        abiItemModelMock.signature = 'constructor';
        abiItemModelMock.payable = true;
        abiItemModelMock.isOfType.mockReturnValueOnce(true);

        sendContractMethodMock.parameters = [{value: 0, from: '0x0'}];

        Utils.isAddress.mockReturnValueOnce(true);

        expect(methodOptionsValidator.validate(abiItemModelMock, sendContractMethodMock)).toEqual(true);
    });
});
