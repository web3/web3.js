import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {GetPastLogsMethod} from 'web3-core-method';
import {LogSubscription} from 'web3-core-subscriptions';
import AbstractContract from '../../../src/AbstractContract';
import EventLogDecoder from '../../../src/decoders/EventLogDecoder';
import EventLogSubscription from '../../../src/subscriptions/EventLogSubscription';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('GetPastLogsMethod');
jest.mock('../../../src/AbstractContract');
jest.mock('../../../src/decoders/EventLogDecoder');

/**
 * EventLogSubscription test
 */
describe('EventLogSubscriptionTest', () => {
    let eventLogSubscription, contractMock, getPastLogsMethodMock, eventLogDecoderMock;

    beforeEach(() => {
        new AbstractContract();
        contractMock = AbstractContract.mock.instances[0];

        new GetPastLogsMethod();
        getPastLogsMethodMock = GetPastLogsMethod.mock.instances[0];

        new EventLogDecoder();
        eventLogDecoderMock = EventLogDecoder.mock.instances[0];

        eventLogSubscription = new EventLogSubscription(
            {},
            {},
            Utils,
            formatters,
            contractMock,
            getPastLogsMethodMock,
            eventLogDecoderMock
        );
    });

    it('constructor check', () => {
        expect(eventLogSubscription.eventLogDecoder).toEqual(eventLogDecoderMock);

        expect(eventLogSubscription.abiItemModel).toEqual({});

        expect(eventLogSubscription).toBeInstanceOf(LogSubscription);
    });

    it('calls onNewSubscriptionItem returns decoded item', () => {
        eventLogDecoderMock.decode.mockReturnValueOnce(true);

        formatters.outputLogFormatter.mockReturnValueOnce({item: false});

        eventLogSubscription.onNewSubscriptionItem(null, {item: true});

        expect(eventLogDecoderMock.decode).toHaveBeenCalledWith({}, {item: false});

        expect(formatters.outputLogFormatter).toHaveBeenCalledWith({item: true});
    });
});
