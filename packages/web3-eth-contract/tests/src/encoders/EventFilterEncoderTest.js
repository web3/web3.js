import {AbiCoder} from 'web3-eth-abi';
import AbiItemModel from '../../../src/models/AbiItemModel';
import EventFilterEncoder from '../../../src/encoders/EventFilterEncoder';

// Mocks
jest.mock('web3-eth-abi');
jest.mock('../../../src/models/AbiItemModel');

/**
 * EventFilterEncoder test
 */
describe('EventFilterEncoderTest', () => {
    let eventFilterEncoder, abiCoderMock, abiItemModelMock;

    beforeEach(() => {
        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];
        abiCoderMock.encodeParameter = jest.fn();

        new AbiItemModel({});
        abiItemModelMock = AbiItemModel.mock.instances[0];

        eventFilterEncoder = new EventFilterEncoder(abiCoderMock);
    });

    it('constructor check', () => {
        expect(eventFilterEncoder.abiCoder).toEqual(abiCoderMock);
    });

    it('calls encode and returns the expected value', () => {
        const filter = {
            myName: 'theValue',
            arrayItem: [100, 200]
        };

        abiItemModelMock.getIndexedInputs.mockReturnValueOnce([
            {
                type: 'bytes32',
                name: 'myName'
            },
            {
                type: 'uint256[]',
                name: 'arrayItem'
            }
        ]);

        abiCoderMock.encodeParameter.mockReturnValue('0x0');

        const topics = eventFilterEncoder.encode(abiItemModelMock, filter);

        expect(topics).toEqual(['0x0', ['0x0', '0x0']]);

        expect(abiCoderMock.encodeParameter).toHaveBeenNthCalledWith(1, 'bytes32', filter.myName);

        expect(abiCoderMock.encodeParameter).toHaveBeenNthCalledWith(2, 'uint256[]', filter.arrayItem[0]);

        expect(abiCoderMock.encodeParameter).toHaveBeenNthCalledWith(3, 'uint256[]', filter.arrayItem[1]);
    });

    it('calls encode with string type and returns the expected value', () => {
        const filter = {
            myString: 'theValue',
            stringArrayItem: ['array1', 'array2']
        };

        abiItemModelMock.getIndexedInputs.mockReturnValueOnce([
            {
                type: 'string',
                name: 'myString'
            },
            {
                type: 'string[]',
                name: 'stringArrayItem'
            }
        ]);

        abiCoderMock.utils = {
            keccak256: jest.fn().mockReturnValue('0x0')
        };

        const topics = eventFilterEncoder.encode(abiItemModelMock, filter);

        expect(topics).toEqual(['0x0', ['0x0', '0x0']]);

        expect(abiCoderMock.utils.keccak256).toHaveBeenNthCalledWith(1, filter.myString);

        expect(abiCoderMock.utils.keccak256).toHaveBeenNthCalledWith(2, filter.stringArrayItem[0]);

        expect(abiCoderMock.utils.keccak256).toHaveBeenNthCalledWith(3, filter.stringArrayItem[1]);
    });
});
