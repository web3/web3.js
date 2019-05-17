import {formatters} from 'web3-core-helpers';
import {EthSendTransactionMethod} from 'web3-core-method';
import AbiModel from '../../../src/models/AbiModel';
import AllEventsLogDecoder from '../../../src/decoders/AllEventsLogDecoder';
import SendContractMethod from '../../../src/methods/SendContractMethod';

// Mocks
jest.mock('../../../src/decoders/AllEventsLogDecoder');
jest.mock('../../../src/models/AbiItemModel');
jest.mock('../../../src/models/AbiModel');
jest.mock('web3-core-helpers');

/**
 * SendContractMethod test
 */
describe('SendContractMethodTest', () => {
    let sendContractMethod, allEventsLogDecoderMock, abiModelMock;

    beforeEach(() => {
        new AbiModel();
        abiModelMock = AbiModel.mock.instances[0];

        new AllEventsLogDecoder();
        allEventsLogDecoderMock = AllEventsLogDecoder.mock.instances[0];

        sendContractMethod = new SendContractMethod(
            {},
            formatters,
            {},
            {},
            {},
            {},
            allEventsLogDecoderMock,
            abiModelMock
        );
    });

    it('constructor check', () => {
        expect(sendContractMethod.allEventsLogDecoder).toEqual(allEventsLogDecoderMock);

        expect(sendContractMethod.abiModel).toEqual(abiModelMock);

        expect(sendContractMethod).toBeInstanceOf(EthSendTransactionMethod);
    });

    it('calls afterExecution and returns the expected result', () => {
        const response = {
            logs: [
                {
                    event: false
                },
                {
                    event: 'MyEvent'
                },
                {
                    event: 'MyEvent'
                },
                {
                    event: 'MyEvent'
                }
            ]
        };

        allEventsLogDecoderMock.decode.mockReturnValueOnce({event: false});

        allEventsLogDecoderMock.decode.mockReturnValueOnce({event: 'MyEvent'});

        allEventsLogDecoderMock.decode.mockReturnValueOnce({event: 'MyEvent'});

        allEventsLogDecoderMock.decode.mockReturnValueOnce({event: 'MyEvent'});

        formatters.outputTransactionFormatter.mockReturnValueOnce({
            events: {
                0: {event: true},
                MyEvent: [
                    {
                        event: 'MyEvent'
                    },
                    {
                        event: 'MyEvent'
                    },
                    {
                        event: 'MyEvent'
                    }
                ]
            }
        });

        const mappedResponse = sendContractMethod.afterExecution(response);

        expect(mappedResponse).toEqual({
            events: {
                0: {event: true},
                MyEvent: [
                    {
                        event: 'MyEvent'
                    },
                    {
                        event: 'MyEvent'
                    },
                    {
                        event: 'MyEvent'
                    }
                ]
            }
        });

        expect(allEventsLogDecoderMock.decode).toHaveBeenNthCalledWith(1, abiModelMock, {event: false});

        expect(allEventsLogDecoderMock.decode).toHaveBeenNthCalledWith(2, abiModelMock, {event: 'MyEvent'});

        expect(allEventsLogDecoderMock.decode).toHaveBeenNthCalledWith(3, abiModelMock, {event: 'MyEvent'});

        expect(allEventsLogDecoderMock.decode).toHaveBeenNthCalledWith(4, abiModelMock, {event: 'MyEvent'});

        expect(formatters.outputTransactionFormatter).toHaveBeenCalledWith({
            events: {
                0: {event: false},
                MyEvent: [
                    {
                        event: 'MyEvent'
                    },
                    {
                        event: 'MyEvent'
                    },
                    {
                        event: 'MyEvent'
                    }
                ]
            }
        }, undefined);
    });
});
