import {AbiCoder} from 'web3-eth-abi';
import AbiItemModel from '../../../src/models/AbiItemModel';
import MethodEncoder from '../../../src/encoders/MethodEncoder';

// Mocks
jest.mock('AbiCoder');
jest.mock('../../../src/models/AbiItemModel');

/**
 * MethodEncoder test
 */
describe('MethodEncoderTest', () => {
    let methodEncoder, abiCoderMock, abiItemModelMock;

    beforeEach(() => {
        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];
        abiCoderMock.encodeParameters = jest.fn();

        new AbiItemModel({});
        abiItemModelMock = AbiItemModel.mock.instances[0];
        abiItemModelMock.signature = 'method';
        abiItemModelMock.contractMethodParameters = [];

        methodEncoder = new MethodEncoder(abiCoderMock);
    });

    it('constructor check', () => {
        expect(methodEncoder.abiCoder).toEqual(abiCoderMock);
    });

    it('calls encode and returns the expected value', () => {
        abiCoderMock.encodeParameters.mockReturnValueOnce('0x0');

        abiItemModelMock.getInputs.mockReturnValueOnce([]);

        abiItemModelMock.isOfType.mockReturnValueOnce(false);

        abiItemModelMock.isOfType.mockReturnValueOnce(false);

        const result = methodEncoder.encode(abiItemModelMock);

        expect(result).toEqual('0');

        expect(abiCoderMock.encodeParameters).toHaveBeenCalledWith([], []);

        expect(abiItemModelMock.getInputs).toHaveBeenCalled();

        expect(abiItemModelMock.isOfType).toHaveBeenCalledWith('function');
    });

    it('calls encode with "constructor" as type and a error is thrown because of the missing data argument', () => {
        abiCoderMock.encodeParameters.mockReturnValueOnce('0x0');

        abiItemModelMock.getInputs.mockReturnValueOnce([]);

        abiItemModelMock.isOfType.mockReturnValueOnce(true);

        expect(() => {
            methodEncoder.encode(abiItemModelMock);
        }).toThrow(
            'The contract has no contract data option set. This is necessary to append the constructor parameters.'
        );

        expect(abiCoderMock.encodeParameters).toHaveBeenCalledWith([], []);

        expect(abiItemModelMock.getInputs).toHaveBeenCalled();

        expect(abiItemModelMock.isOfType).toHaveBeenCalledWith('constructor');
    });

    it('calls encode with "constructor" as type and returns the expected value', () => {
        abiCoderMock.encodeParameters.mockReturnValueOnce('0x0');

        abiItemModelMock.getInputs.mockReturnValueOnce([]);

        abiItemModelMock.isOfType.mockReturnValueOnce(true);

        const result = methodEncoder.encode(abiItemModelMock, '0');

        expect(result).toEqual('00');

        expect(abiCoderMock.encodeParameters).toHaveBeenCalledWith([], []);

        expect(abiItemModelMock.getInputs).toHaveBeenCalled();

        expect(abiItemModelMock.isOfType).toHaveBeenCalledWith('constructor');
    });

    it('calls encode with "function" as type and returns the expected value', () => {
        abiCoderMock.encodeParameters.mockReturnValueOnce('0x0');

        abiItemModelMock.getInputs.mockReturnValueOnce([]);

        abiItemModelMock.isOfType.mockReturnValueOnce(false);
        abiItemModelMock.isOfType.mockReturnValueOnce(true);

        abiItemModelMock.signature = '0';

        const result = methodEncoder.encode(abiItemModelMock);

        expect(result).toEqual('00');

        expect(abiCoderMock.encodeParameters).toHaveBeenCalledWith([], []);

        expect(abiItemModelMock.getInputs).toHaveBeenCalled();

        expect(abiItemModelMock.isOfType).toHaveBeenNthCalledWith(1,'constructor');
        expect(abiItemModelMock.isOfType).toHaveBeenNthCalledWith(2,'function');
    });
});
