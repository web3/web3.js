import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {LogSubscription} from 'web3-core-subscriptions';
import {GetPastLogsMethod} from 'web3-core-method';
import AllEventsLogSubscription from '../../../src/subscriptions/AllEventsLogSubscription';
import AbstractContract from '../../../src/AbstractContract';
import AllEventsLogDecoder from '../../../src/decoders/AllEventsLogDecoder';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('GetPastLogsMethod');
jest.mock('../../../src/AbstractContract');
jest.mock('../../../src/decoders/AllEventsLogDecoder');

/**
 * AllEventsLogSubscription test
 */
describe('AllEventsLogSubscriptionTest', () => {
    let allEventsLogSubscription, contractMock, getPastLogsMethodMock, allEventsLogDecoderMock;

    beforeEach(() => {
        new AbstractContract();
        contractMock = AbstractContract.mock.instances[0];

        new GetPastLogsMethod();
        getPastLogsMethodMock = GetPastLogsMethod.mock.instances[0];

        new AllEventsLogDecoder();
        allEventsLogDecoderMock = AllEventsLogDecoder.mock.instances[0];

        allEventsLogSubscription = new AllEventsLogSubscription(
            {},
            Utils,
            formatters,
            contractMock,
            getPastLogsMethodMock,
            allEventsLogDecoderMock
        );
    });

    it('constructor check', () => {
        expect(allEventsLogSubscription.allEventsLogDecoder).toEqual(allEventsLogDecoderMock);

        expect(allEventsLogSubscription).toBeInstanceOf(LogSubscription);
    });

    it('calls onNewSubscriptionItem returns decoded item', () => {
        allEventsLogDecoderMock.decode.mockReturnValueOnce(true);

        formatters.outputLogFormatter.mockReturnValueOnce({item: false});

        allEventsLogSubscription.onNewSubscriptionItem(null, {item: true});

        expect(allEventsLogDecoderMock.decode).toHaveBeenCalledWith({item: false});

        expect(formatters.outputLogFormatter).toHaveBeenCalledWith({item: true});
    });
});
