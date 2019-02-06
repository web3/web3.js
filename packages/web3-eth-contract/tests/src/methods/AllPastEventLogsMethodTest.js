import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {GetPastLogsMethod} from 'web3-core-method';
import AllEventsLogDecoder from '../../../src/decoders/AllEventsLogDecoder';
import AbiModel from '../../../src/models/AbiModel';
import AllPastEventLogsMethod from '../../../src/methods/AllPastEventLogsMethod';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('../../../src/decoders/AllEventsLogDecoder');
jest.mock('../../../src/models/AbiModel');

/**
 * AllPastEventLogsMethod test
 */
describe('AllPastEventLogsMethodTest', () => {
    let allPastEventLogsMethod, allEventsLogDecoderMock, abiModelMock;

    beforeEach(() => {
        new AllEventsLogDecoder();
        allEventsLogDecoderMock = AllEventsLogDecoder.mock.instances[0];

        new AbiModel();
        abiModelMock = AbiModel.mock.instances[0];

        allPastEventLogsMethod = new AllPastEventLogsMethod(Utils, formatters, allEventsLogDecoderMock, abiModelMock);
    });

    it('constructor check', () => {
        expect(allPastEventLogsMethod.utils).toEqual(Utils);

        expect(allPastEventLogsMethod.formatters).toEqual(formatters);

        expect(allPastEventLogsMethod.allEventsLogDecoder).toEqual(allEventsLogDecoderMock);

        expect(allPastEventLogsMethod.abiModel).toEqual(abiModelMock);

        expect(allPastEventLogsMethod).toBeInstanceOf(GetPastLogsMethod);
    });

    it('calls afterExecution and returns the expected result', () => {
        const response = [false, false, false];

        formatters.outputLogFormatter.mockReturnValue(true);

        allEventsLogDecoderMock.decode.mockReturnValue('decoded');

        const mappedResponse = allPastEventLogsMethod.afterExecution(response);

        expect(mappedResponse).toEqual(['decoded', 'decoded', 'decoded']);

        expect(formatters.outputLogFormatter).toHaveBeenCalledTimes(3);

        expect(allEventsLogDecoderMock.decode).toHaveBeenCalledTimes(3);

        expect(allEventsLogDecoderMock.decode).toHaveBeenCalledWith(abiModelMock, true);
    });
});
