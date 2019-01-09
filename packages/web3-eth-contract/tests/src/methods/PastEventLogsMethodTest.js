import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {GetPastLogsMethod} from 'web3-core-method';
import EventLogDecoder from '../../../src/decoders/EventLogDecoder';
import AbiItemModel from '../../../src/models/AbiItemModel';
import PastEventLogsMethod from '../../../src/methods/PastEventLogsMethod';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('../../../src/decoders/EventLogDecoder');
jest.mock('../../../src/models/AbiItemModel');

/**
 * PastEventLogsMethod test
 */
describe('PastEventLogsMethodTest', () => {
    let pastEventLogsMethod, eventLogDecoderMock, abiItemModelMock;

    beforeEach(() => {
        new EventLogDecoder();
        eventLogDecoderMock = EventLogDecoder.mock.instances[0];

        new AbiItemModel();
        abiItemModelMock = AbiItemModel.mock.instances[0];

        pastEventLogsMethod = new PastEventLogsMethod(Utils, formatters, eventLogDecoderMock, abiItemModelMock);
    });

    it('constructor check', () => {
        expect(pastEventLogsMethod.utils).toEqual(Utils);

        expect(pastEventLogsMethod.formatters).toEqual(formatters);

        expect(pastEventLogsMethod.eventLogDecoder).toEqual(eventLogDecoderMock);

        expect(pastEventLogsMethod.abiItemModel).toEqual(abiItemModelMock);

        expect(pastEventLogsMethod).toBeInstanceOf(GetPastLogsMethod);
    });

    it('calls afterExecution and returns the expected result', () => {
        const response = [false, false, false];

        formatters.outputLogFormatter.mockReturnValue(true);

        eventLogDecoderMock.decode.mockReturnValue('decoded');

        const mappedResponse = pastEventLogsMethod.afterExecution(response);

        expect(mappedResponse).toEqual(['decoded', 'decoded', 'decoded']);

        expect(formatters.outputLogFormatter).toHaveBeenCalledTimes(3);

        expect(eventLogDecoderMock.decode).toHaveBeenCalledTimes(3);

        expect(eventLogDecoderMock.decode).toHaveBeenCalledWith(abiItemModelMock, true);
    });
});
