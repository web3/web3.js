import {formatters} from 'web3-core-helpers';
import {GetPastLogsMethod} from 'web3-core-method';
import EventLogDecoder from '../../../src/decoders/EventLogDecoder';
import AbiItemModel from '../../../src/models/AbiItemModel';
import EventOptionsMapper from '../../../src/mappers/EventOptionsMapper';
import AbstractContract from '../../../src/AbstractContract';
import PastEventLogsMethod from '../../../src/methods/PastEventLogsMethod';

// Mocks
jest.mock('web3-core-helpers');
jest.mock('../../../src/decoders/EventLogDecoder');
jest.mock('../../../src/models/AbiItemModel');
jest.mock('../../../src/mappers/EventOptionsMapper');
jest.mock('../../../src/AbstractContract');

/**
 * PastEventLogsMethod test
 */
describe('PastEventLogsMethodTest', () => {
    let pastEventLogsMethod, eventLogDecoderMock, abiItemModelMock, eventOptionsMapperMock;

    beforeEach(() => {
        new EventLogDecoder();
        eventLogDecoderMock = EventLogDecoder.mock.instances[0];

        new AbiItemModel();
        abiItemModelMock = AbiItemModel.mock.instances[0];

        new EventOptionsMapper();
        eventOptionsMapperMock = EventOptionsMapper.mock.instances[0];

        pastEventLogsMethod = new PastEventLogsMethod(
            {},
            formatters,
            {},
            eventLogDecoderMock,
            abiItemModelMock,
            eventOptionsMapperMock
        );
    });

    it('constructor check', () => {
        expect(pastEventLogsMethod.eventLogDecoder).toEqual(eventLogDecoderMock);

        expect(pastEventLogsMethod.abiItemModel).toEqual(abiItemModelMock);

        expect(pastEventLogsMethod.eventOptionsMapper).toEqual(eventOptionsMapperMock);

        expect(pastEventLogsMethod).toBeInstanceOf(GetPastLogsMethod);
    });

    it('calls beforeExecution and executes the expected methods', () => {
        new AbstractContract();
        const contractMock = AbstractContract.mock.instances[0];

        eventOptionsMapperMock.map.mockReturnValueOnce({mapped: true});

        formatters.inputLogFormatter.mockReturnValueOnce({options: true});

        pastEventLogsMethod.parameters = [{}];
        pastEventLogsMethod.beforeExecution();

        expect(eventOptionsMapperMock.map).toHaveBeenCalledWith(abiItemModelMock, contractMock, {options: true});

        expect(formatters.inputLogFormatter).toHaveBeenCalledWith({});
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
