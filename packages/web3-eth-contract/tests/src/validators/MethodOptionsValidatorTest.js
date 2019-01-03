import * as Utils from 'web3-utils';
import MethodOptionsValidator from '../../../src/validators/MethodOptionsValidator';

// Mocks
jest.mock('Utils');

/**
 * MethodOptionsValidator test
 */
describe('MethodOptionsValidatorTest', () => {
    let methodOptionsValidator;

    beforeEach(() => {
        methodOptionsValidator = new MethodOptionsValidator(Utils);
    });

    it('constructor check', () => {
        expect(methodOptionsValidator.utils)
            .toEqual(Utils);
    });

    it('calls validate and returns true', () => {
        Utils.isAddress
            .mockReturnValueOnce(true);

        expect(methodOptionsValidator.validate(
            {
                signature: 'constructor',
                payable: true
            },
            {
                parameters: [{value: 100, from: '0x0'}]
            }
        )).toEqual(true);

        expect(Utils.isAddress)
            .toHaveBeenCalledWith('0x0');
    });

    it('calls validate and throws isToSet error', () => {
        Utils.isAddress
            .mockReturnValueOnce(false);

        expect(() => {
            methodOptionsValidator.validate({},
                {
                    parameters: [{value: 100, to: '0x0'}]
                }
            )
        }).toThrow('This contract object doesn\'t have address set yet, please set an address first.');

        expect(Utils.isAddress)
            .toHaveBeenCalledWith('0x0');
    });

    it('calls validate and throws isFromSet error', () => {
        Utils.isAddress
            .mockReturnValueOnce(false);

        expect(() => {
            methodOptionsValidator.validate(
                {
                    signature: 'constructor'
                },
                {
                    parameters: [{value: 100, from: '0x0'}]
                }
            )
        }).toThrow('No valid "from" address specified in neither the given options, nor the default options.');

        expect(Utils.isAddress)
            .toHaveBeenCalledWith('0x0');
    });

    it('calls validate and throws isValueValid error', () => {
        Utils.isAddress
            .mockReturnValueOnce(true);
        
        expect(() => {
            methodOptionsValidator.validate(
                {
                    signature: 'constructor',
                    payable: false,
                },
                {
                    parameters: [{value: 100, from: '0x0'}]
                }
            )
        }).toThrow('Can not send value to non-payable contract method or constructor');
    });
});
