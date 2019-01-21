import {formatters} from 'web3-core-helpers';

import AllEventsFilterEncoder from '../../../src/encoders/AllEventsFilterEncoder';
import AllEventsOptionsMapper from '../../../src/mappers/AllEventsOptionsMapper';

// Mocks
jest.mock('../../../src/encoders/AllEventsFilterEncoder');
jest.mock('formatters');

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

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('block');

        expect(allEventsOptionsMapper.map({}, {}, options)).toHaveProperty('fromBlock', 'block');

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith(0);
    });

    it('calls map with undefined fromBlock property and returns the expected result', () => {
        expect(allEventsOptionsMapper.map({}, {defaultBlock: 'block'}, {})).toHaveProperty('fromBlock', 'block');
    });

    it('calls map with defined toBlock property and returns the expected result', () => {
        const options = {
            fromBlock: 0,
            toBlock: 0
        };

        formatters.inputBlockNumberFormatter.mockReturnValue('block');

        expect(allEventsOptionsMapper.map({}, {}, options)).toHaveProperty('toBlock', 'block');

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith(0);
    });

    it('calls map with defined filter property and returns the expected result', () => {
        const options = {
            filter: []
        };

        allEventsFilterEncoderMock.encode.mockReturnValueOnce([0]);

        expect(allEventsOptionsMapper.map({}, {defaultBlock: 0}, options)).toHaveProperty('topics', [0]);

        expect(allEventsFilterEncoderMock.encode).toHaveBeenCalledWith({}, []);
    });

    it('calls map with undefined address property and returns the expected result', () => {
        const options = {
            fromBlock: 0
        };

        expect(allEventsOptionsMapper.map({}, {defaultBlock: 0, address: true}, options)).toHaveProperty(
            'address',
            true
        );
    });
});
