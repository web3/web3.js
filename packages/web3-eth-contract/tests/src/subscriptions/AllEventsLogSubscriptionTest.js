import {LogSubscription} from 'web3-core-subscriptions';
import {GetPastLogsMethod} from 'web3-core-method';
import AllEventsLogSubscription from '../../../src/subscriptions/AllEventsLogSubscription';
import AbstractContract from '../../../src/AbstractContract';
import AllEventsLogDecoder from '../../../src/decoders/AllEventsLogDecoder';
import AbiModel from '../../../src/models/AbiModel';

// Mocks
jest.mock('web3-core-method');
jest.mock('../../../src/AbstractContract');
jest.mock('../../../src/decoders/AllEventsLogDecoder');
jest.mock('../../../src/models/AbiModel');

/**
 * AllEventsLogSubscription test
 */
describe('AllEventsLogSubscriptionTest', () => {
    let allEventsLogSubscription, contractMock, getPastLogsMethodMock, allEventsLogDecoderMock, abiModelMock;

    beforeEach(() => {
        new AbstractContract();
        contractMock = AbstractContract.mock.instances[0];

        new GetPastLogsMethod();
        getPastLogsMethodMock = GetPastLogsMethod.mock.instances[0];

        new AllEventsLogDecoder();
        allEventsLogDecoderMock = AllEventsLogDecoder.mock.instances[0];

        new AbiModel();
        abiModelMock = AbiModel.mock.instances[0];

        allEventsLogSubscription = new AllEventsLogSubscription(
            {},
            contractMock,
            getPastLogsMethodMock,
            allEventsLogDecoderMock,
            abiModelMock
        );
    });

    it('constructor check', () => {
        expect(allEventsLogSubscription.allEventsLogDecoder).toEqual(allEventsLogDecoderMock);

        expect(allEventsLogSubscription.abiModel).toEqual(abiModelMock);

        expect(allEventsLogSubscription).toBeInstanceOf(LogSubscription);
    });

    it('calls onNewSubscriptionItem returns the decoded items', () => {
        allEventsLogDecoderMock.decode.mockReturnValueOnce(true);

        expect(allEventsLogSubscription.onNewSubscriptionItem({item: true})).toEqual(true);

        expect(allEventsLogDecoderMock.decode).toHaveBeenCalledWith(abiModelMock, {item: false});
    });

    it('calls onNewSubscriptionItem returns the decoded items and triggers the changed event', (done) => {
        allEventsLogDecoderMock.decode.mockReturnValueOnce(true);

        allEventsLogSubscription.on('changed', (decodedLog) => {
            expect(decodedLog).toEqual(true);

            done();
        });

        expect(allEventsLogSubscription.onNewSubscriptionItem({item: true, removed: true})).toEqual(true);

        expect(allEventsLogDecoderMock.decode).toHaveBeenCalledWith(abiModelMock, {item: false, removed: true});
    });
});
