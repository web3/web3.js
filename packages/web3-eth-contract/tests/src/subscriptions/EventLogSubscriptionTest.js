import {GetPastLogsMethod} from 'web3-core-method';
import {LogSubscription} from 'web3-core-subscriptions';
import AbstractContract from '../../../src/AbstractContract';
import EventLogDecoder from '../../../src/decoders/EventLogDecoder';
import AbiItemModel from '../../../src/models/AbiItemModel';
import EventLogSubscription from '../../../src/subscriptions/EventLogSubscription';

// Mocks
jest.mock('web3-core-method');
jest.mock('../../../src/AbstractContract');
jest.mock('../../../src/decoders/EventLogDecoder');
jest.mock('../../../src/models/AbiItemModel');

/**
 * EventLogSubscription test
 */
describe('EventLogSubscriptionTest', () => {
    let eventLogSubscription, contractMock, getPastLogsMethodMock, eventLogDecoderMock, abiItemModelMock;

    beforeEach(() => {
        new AbstractContract();
        contractMock = AbstractContract.mock.instances[0];

        new GetPastLogsMethod();
        getPastLogsMethodMock = GetPastLogsMethod.mock.instances[0];

        new EventLogDecoder();
        eventLogDecoderMock = EventLogDecoder.mock.instances[0];

        new AbiItemModel();
        abiItemModelMock = AbiItemModel.mock.instances[0];

        eventLogSubscription = new EventLogSubscription(
            {},
            contractMock,
            getPastLogsMethodMock,
            eventLogDecoderMock,
            abiItemModelMock
        );
    });

    it('constructor check', () => {
        expect(eventLogSubscription.eventLogDecoder).toEqual(eventLogDecoderMock);

        expect(eventLogSubscription.abiItemModel).toEqual(abiItemModelMock);

        expect(eventLogSubscription).toBeInstanceOf(LogSubscription);
    });

    it('calls onNewSubscriptionItem returns decoded item', () => {
        eventLogDecoderMock.decode.mockReturnValueOnce(true);

        expect(eventLogSubscription.onNewSubscriptionItem({item: true})).toEqual(true);

        expect(eventLogDecoderMock.decode).toHaveBeenCalledWith(abiItemModelMock, {item: false});
    });

    it('calls onNewSubscriptionItem returns the decoded items and triggers the changed event', (done) => {
        eventLogDecoderMock.decode.mockReturnValueOnce(true);

        eventLogSubscription.on('changed', (decodedLog) => {
            expect(decodedLog).toEqual(true);

            done();
        });

        expect(eventLogSubscription.onNewSubscriptionItem({item: true, removed: 1})).toEqual(true);

        expect(eventLogDecoderMock.decode).toHaveBeenCalledWith(abiItemModelMock, {item: false, removed: 1});
    });
});
