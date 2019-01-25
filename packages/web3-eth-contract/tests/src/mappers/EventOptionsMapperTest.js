import {formatters} from 'web3-core-helpers';

import EventFilterEncoder from '../../../src/encoders/EventFilterEncoder';
import EventOptionsMapper from '../../../src/mappers/EventOptionsMapper';

// Mocks
jest.mock('../../../src/encoders/EventFilterEncoder');
jest.mock('formatters');

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

        formatters.inputBlockNumberFormatter.mockReturnValueOnce('block');

        expect(eventOptionsMapper.map({}, {}, options)).toHaveProperty('fromBlock', 'block');

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith(0);
    });

    it('calls map with undefined fromBlock property and returns the expected result', () => {
        expect(eventOptionsMapper.map({}, {defaultBlock: 'block'}, {})).toHaveProperty('fromBlock', 'block');
    });

    it('calls map with defined toBlock property and returns the expected result', () => {
        const options = {
            fromBlock: 0,
            toBlock: 0
        };

        formatters.inputBlockNumberFormatter.mockReturnValue('block');

        expect(eventOptionsMapper.map({}, {}, options)).toHaveProperty('toBlock', 'block');

        expect(formatters.inputBlockNumberFormatter).toHaveBeenCalledWith(0);
    });

    it('calls map with defined filter property and returns the expected result', () => {
        const options = {
            filter: []
        };

        eventFilterEncoderMock.encode.mockReturnValueOnce([0]);

        expect(eventOptionsMapper.map({anonymous: true}, {defaultBlock: 0}, options)).toHaveProperty('topics', [0]);

        expect(eventFilterEncoderMock.encode).toHaveBeenCalledWith({anonymous: true}, []);
    });

    it('calls map with undefined address property and returns the expected result', () => {
        const options = {
            fromBlock: 0
        };

        expect(eventOptionsMapper.map({}, {defaultBlock: 0, address: true}, options)).toHaveProperty('address', true);
    });

    it('calls map with anonymous property false and returns the expected result', () => {
        const options = {
            filter: []
        };

        const abiItemModel = {
            anonymous: false,
            signature: 'signature'
        };

        eventFilterEncoderMock.encode.mockReturnValueOnce([0]);

        expect(eventOptionsMapper.map(abiItemModel, {defaultBlock: 0}, options)).toHaveProperty('topics', [
            'signature',
            0
        ]);

        expect(eventFilterEncoderMock.encode).toHaveBeenCalledWith(abiItemModel, []);
    });
});
