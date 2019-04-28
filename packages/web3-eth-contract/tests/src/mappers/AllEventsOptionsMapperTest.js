import {formatters} from 'web3-core-helpers';
import AllEventsFilterEncoder from '../../../src/encoders/AllEventsFilterEncoder';
import AllEventsOptionsMapper from '../../../src/mappers/AllEventsOptionsMapper';

// Mocks
jest.mock('../../../src/encoders/AllEventsFilterEncoder');
jest.mock('web3-core-helpers');

/**
 * AllEventsOptionsMapper test
 */
describe('AllEventsOptionsMapperTest', () => {
    let allEventsOptionsMapper, allEventsFilterEncoderMock;

    beforeEach(() => {
        new AllEventsFilterEncoder();
        allEventsFilterEncoderMock = AllEventsFilterEncoder.mock.instances[0];

        allEventsOptionsMapper = new AllEventsOptionsMapper(formatters, allEventsFilterEncoderMock);
    });

    it('constructor check', () => {
        expect(allEventsOptionsMapper.formatters).toEqual(formatters);

        expect(allEventsOptionsMapper.allEventsFilterEncoder).toEqual(allEventsFilterEncoderMock);
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

        expect(allEventsOptionsMapper.map({}, {address: true}, options)).toEqual(mappedOptions);

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith(0);
    });

    it('calls map with topic already in form of array and returns the expected result', () => {
        const options = {
            fromBlock: 0,
            topics: []
        };

        const mappedOptions = {
            fromBlock: 'block',
            topics: [],
            address: true
        };

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('block');

        expect(allEventsOptionsMapper.map({}, {address: true}, options)).toEqual(mappedOptions);

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith(0);
    });

    it('calls map with address already defined returns the expected result', () => {
        const options = {
            fromBlock: 0,
            address: '0x0'
        };

        const mappedOptions = {
            fromBlock: 'block',
            topics: [],
            address: '0x0'
        };

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('block');

        expect(allEventsOptionsMapper.map({}, {address: true}, options)).toEqual(mappedOptions);

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith(0);
    });

    it('calls map with undefined options property and returns the expected result', () => {
        const mappedOptions = {
            fromBlock: undefined,
            topics: [],
            address: true
        };

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('block');

        expect(allEventsOptionsMapper.map({}, {address: true})).toEqual(mappedOptions);
    });

    it('calls map with undefined fromBlock property and returns the expected result', () => {
        const mappedOptions = {
            fromBlock: 'block',
            topics: [],
            address: true
        };

        expect(allEventsOptionsMapper.map({}, {defaultBlock: 'block', address: true}, {})).toEqual(mappedOptions);
    });

    it('calls map with  undefined fromBlock property and returns the expected result', () => {
        const mappedOptions = {
            topics: [],
            address: true
        };

        expect(allEventsOptionsMapper.map({}, {defaultBlock: null, address: true}, {})).toEqual(mappedOptions);
    });

    it('calls map with defined toBlock property and returns the expected result', () => {
        const options = {
            fromBlock: 0,
            toBlock: 0
        };

        const mappedOptions = {
            fromBlock: 'block',
            toBlock: 'block',
            topics: [],
            address: true
        };

        formatters.inputBlockNumberFormatter.mockReturnValue('block');

        expect(allEventsOptionsMapper.map({}, {address: true}, options)).toEqual(mappedOptions);

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith(0);
    });

    it('calls map with defined filter property and returns the expected result', () => {
        const options = {
            filter: []
        };

        const mappedOptions = {
            fromBlock: 0,
            topics: [0],
            address: true
        };

        allEventsFilterEncoderMock.encode.mockReturnValueOnce([0]);

        expect(allEventsOptionsMapper.map({}, {defaultBlock: 0, address: true}, options)).toEqual(mappedOptions);

        expect(allEventsFilterEncoderMock.encode).toHaveBeenCalledWith({}, []);
    });

    it('calls map with without address property and returns the expected result', () => {
        const mappedOptions = {
            topics: [],
            address: true
        };

        expect(allEventsOptionsMapper.map({}, {address: true}, {})).toEqual(mappedOptions);
    });
});
