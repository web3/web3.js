import EventLogDecoder from '../../../src/decoders/EventLogDecoder';
import {formatters} from 'web3-core-helpers';
import {AbiCoder} from 'web3-eth-abi';

// Mocks
jest.mock('formatters');
jest.mock('AbiCoder');

/**
 * EventLogDecoder test
 */
describe('EventLogDecoderTest', () => {
    let eventLogDecoder,
        abiCoder,
        abiCoderMock;

    beforeEach(() => {
        abiCoder = new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];

        eventLogDecoder = new EventLogDecoder(abiCoderMock, formatters);
    });

    it('constructor check', () => {

    });

    it('calls decode and returns the expected value', () => {

    });
});
