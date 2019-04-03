import {formatters} from 'web3-core-helpers';
import EventFilterEncoder from '../../../src/encoders/EventFilterEncoder';
import EventOptionsMapper from '../../../src/mappers/EventOptionsMapper';

// Mocks
jest.mock('../../../src/encoders/EventFilterEncoder');
jest.mock('web3-core-helpers');

/**
 * EventOptionsMapper test
 */
describe('EventOptionsMapperTest', () => {
    let eventOptionsMapper, eventFilterEncoderMock;

    beforeEach(() => {
        new EventFilterEncoder();
        eventFilterEncoderMock = EventFilterEncoder.mock.instances[0];

        eventOptionsMapper = new EventOptionsMapper(formatters, eventFilterEncoderMock);
    });

    it('constructor check', () => {
        expect(eventOptionsMapper.formatters).toEqual(formatters);

        expect(eventOptionsMapper.eventFilterEncoder).toEqual(eventFilterEncoderMock);
    });

    it('calls map with defined fromBlock property and returns the expected result', () => {
        const options = {
            fromBlock: 0
        };

        const mappedOptions = {
            fromBlock: 'block',
            topics: [],
            address: true
        };

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('block');

        expect(eventOptionsMapper.map({anonymous: true}, {address: true}, options)).toEqual(mappedOptions);

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith(0);
    });

    it('calls map with undefined fromBlock property and returns the expected result', () => {
        const mappedOptions = {
            fromBlock: 'block',
            topics: [],
            address: true
        };

        expect(eventOptionsMapper.map({anonymous: true}, {defaultBlock: 'block', address: true}, {})).toEqual(
            mappedOptions
        );
    });

    it('calls map with defined toBlock property and returns the expected result', () => {
        const options = {
            toBlock: 0
        };

        const mappedOptions = {
            toBlock: 'block',
            topics: [],
            address: true
        };

        formatters.inputBlockNumberFormatter.mockReturnValue('block');

        expect(eventOptionsMapper.map({anonymous: true}, {address: true}, options)).toEqual(mappedOptions);

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith(0);
    });

    it('calls map with defined filter property and returns the expected result', () => {
        const options = {
            filter: []
        };

        const mappedOptions = {
            topics: [0],
            address: true
        };

        eventFilterEncoderMock.encode.mockReturnValueOnce([0]);

        expect(eventOptionsMapper.map({anonymous: true}, {address: true}, options)).toEqual(mappedOptions);

        expect(eventFilterEncoderMock.encode).toHaveBeenCalledWith({anonymous: true}, []);
    });

    it('calls map with undefined address property and returns the expected result', () => {
        const mappedOptions = {
            fromBlock: 0,
            address: true,
            topics: []
        };

        expect(eventOptionsMapper.map({anonymous: true}, {defaultBlock: 0, address: true}, {})).toEqual(mappedOptions);
    });

    it('calls map with anonymous property false and returns the expected result', () => {
        const options = {
            filter: []
        };

        const mappedOptions = {
            fromBlock: 0,
            topics: ['signature', 0],
            address: true
        };

        const abiItemModel = {
            anonymous: false,
            signature: 'signature'
        };

        eventFilterEncoderMock.encode.mockReturnValueOnce([0]);

        expect(eventOptionsMapper.map(abiItemModel, {defaultBlock: 0, address: true}, options)).toEqual(mappedOptions);

        expect(eventFilterEncoderMock.encode).toHaveBeenCalledWith(abiItemModel, []);
    });

    it('calls map with undefined options parameter and returns the expected result', () => {
        const mappedOptions = {
            fromBlock: 0,
            address: true,
            topics: []
        };

        expect(eventOptionsMapper.map({anonymous: true}, {defaultBlock: 0, address: true})).toEqual(mappedOptions);
    });
});
