import {PromiEvent} from 'web3-core-promievent';
import AbstractContract from '../../../src/AbstractContract';
import AbiModel from '../../../src/models/AbiModel';
import EventSubscriptionFactory from '../../../src/factories/EventSubscriptionFactory';
import EventOptionsMapper from '../../../src/mappers/EventOptionsMapper';
import EventLogDecoder from '../../../src/decoders/EventLogDecoder';
import AllEventsLogDecoder from '../../../src/decoders/AllEventsLogDecoder';
import AllEventsOptionsMapper from '../../../src/mappers/AllEventsOptionsMapper';
import EventLogSubscription from '../../../src/subscriptions/EventLogSubscription';
import AllEventsLogSubscription from '../../../src/subscriptions/AllEventsLogSubscription';
import AbiItemModel from '../../../src/models/AbiItemModel';
import EventSubscriptionsProxy from '../../../src/proxies/EventSubscriptionsProxy';

// Mocks
jest.mock('../../../src/AbstractContract');
jest.mock('../../../src/models/AbiModel');
jest.mock('../../../src/factories/EventSubscriptionFactory');
jest.mock('../../../src/mappers/EventOptionsMapper');
jest.mock('../../../src/decoders/EventLogDecoder');
jest.mock('../../../src/decoders/AllEventsLogDecoder');
jest.mock('../../../src/mappers/AllEventsOptionsMapper');
jest.mock('../../../src/models/AbiItemModel');
jest.mock('../../../src/subscriptions/EventLogSubscription');
jest.mock('../../../src/subscriptions/AllEventsLogSubscription');

/**
 * EventSubscriptionsProxy test
 */
describe('EventSubscriptionsProxyTest', () => {
    let eventSubscriptionsProxy,
        contractMock,
        abiModelMock,
        eventSubscriptionFactoryMock,
        eventOptionsMapperMock,
        eventLogDecoderMock,
        allEventsLogDecoderMock,
        allEventsOptionsMapperMock,
        abiItemModelMock;

    beforeEach(() => {
        new AbiModel();
        abiModelMock = AbiModel.mock.instances[0];

        new AbstractContract();
        contractMock = AbstractContract.mock.instances[0];
        contractMock.abiModel = abiModelMock;

        new EventSubscriptionFactory();
        eventSubscriptionFactoryMock = EventSubscriptionFactory.mock.instances[0];

        new EventOptionsMapper();
        eventOptionsMapperMock = EventOptionsMapper.mock.instances[0];

        new EventLogDecoder();
        eventLogDecoderMock = EventLogDecoder.mock.instances[0];

        new AllEventsLogDecoder();
        allEventsLogDecoderMock = AllEventsLogDecoder.mock.instances[0];

        new AllEventsOptionsMapper();
        allEventsOptionsMapperMock = AllEventsOptionsMapper.mock.instances[0];

        new AbiItemModel();
        abiItemModelMock = AbiItemModel.mock.instances[0];

        eventSubscriptionsProxy = new EventSubscriptionsProxy(
            contractMock,
            eventSubscriptionFactoryMock,
            eventOptionsMapperMock,
            eventLogDecoderMock,
            allEventsLogDecoderMock,
            allEventsOptionsMapperMock
        );
    });

    it('constructor check', () => {
        expect(eventSubscriptionsProxy.contract).toEqual(contractMock);

        expect(eventSubscriptionsProxy.eventSubscriptionFactory).toEqual(eventSubscriptionFactoryMock);

        expect(eventSubscriptionsProxy.eventOptionsMapper).toEqual(eventOptionsMapperMock);

        expect(eventSubscriptionsProxy.eventLogDecoder).toEqual(eventLogDecoderMock);

        expect(eventSubscriptionsProxy.allEventsLogDecoder).toEqual(allEventsLogDecoderMock);

        expect(eventSubscriptionsProxy.allEventsOptionsMapper).toEqual(allEventsOptionsMapperMock);
    });

    it('subscribes an event over the proxy', () => {
        abiModelMock.hasEvent.mockReturnValueOnce(true);

        abiModelMock.getEvent.mockReturnValueOnce(abiItemModelMock);

        new EventLogSubscription();
        const options = {
            filter: []
        };

        const eventLogSubscriptionMock = EventLogSubscription.mock.instances[0];

        eventLogSubscriptionMock.subscribe = jest.fn((callback) => {
            expect(callback).toBeInstanceOf(Function);

            return eventLogSubscriptionMock;
        });

        eventSubscriptionFactoryMock.createEventLogSubscription.mockReturnValueOnce(eventLogSubscriptionMock);

        eventOptionsMapperMock.map.mockReturnValueOnce({options: true});

        const subscription = eventSubscriptionsProxy.MyEvent(options, () => {});

        expect(subscription).toEqual(eventLogSubscriptionMock);

        expect(abiModelMock.hasEvent).toHaveBeenCalledWith('MyEvent');

        expect(abiModelMock.getEvent).toHaveBeenCalledWith('MyEvent');

        expect(eventSubscriptionFactoryMock.createEventLogSubscription).toHaveBeenCalledWith(
            eventLogDecoderMock,
            contractMock,
            {options: true},
            abiItemModelMock
        );

        expect(eventOptionsMapperMock.map).toHaveBeenCalledWith(abiItemModelMock, contractMock, options);
    });

    it('subscribes an event over the proxy with a filter and topics set', () => {
        abiModelMock.hasEvent.mockReturnValueOnce(true);

        const options = {
            filter: [],
            topics: []
        };

        expect(() => {
            eventSubscriptionsProxy.MyEvent(options, () => {});
        }).toThrow('Invalid subscription options: Only filter or topics are allowed and not both');

        expect(abiModelMock.hasEvent).toHaveBeenCalledWith('MyEvent');

        expect(abiModelMock.getEvent).toHaveBeenCalledWith('MyEvent');
    });

    it('subscribes to all events over the proxy', () => {
        abiModelMock.hasEvent.mockReturnValueOnce(false);

        abiModelMock.getEvent.mockReturnValueOnce(abiItemModelMock);

        new AllEventsLogSubscription();
        const options = {
            filter: []
        };

        const allEventsLogSubscription = AllEventsLogSubscription.mock.instances[0];

        allEventsLogSubscription.subscribe = jest.fn((callback) => {
            expect(callback).toBeInstanceOf(Function);

            return allEventsLogSubscription;
        });

        eventSubscriptionFactoryMock.createAllEventsLogSubscription.mockReturnValueOnce(allEventsLogSubscription);

        allEventsOptionsMapperMock.map.mockReturnValueOnce({options: true});

        const subscription = eventSubscriptionsProxy.allEvents(options, () => {});

        expect(subscription).toEqual(allEventsLogSubscription);

        expect(abiModelMock.hasEvent).toHaveBeenCalledWith('allEvents');

        expect(eventSubscriptionFactoryMock.createAllEventsLogSubscription).toHaveBeenCalledWith(
            allEventsLogDecoderMock,
            contractMock,
            {options: true}
        );

        expect(allEventsOptionsMapperMock.map).toHaveBeenCalledWith(abiModelMock, contractMock, options);
    });

    it('subscribes to all evens over the proxy with a filter and topics set', () => {
        abiModelMock.hasEvent.mockReturnValueOnce(false);

        const options = {
            filter: [],
            topics: []
        };

        expect(() => {
            eventSubscriptionsProxy.allEvents(options, () => {});
        }).toThrow('Invalid subscription options: Only filter or topics are allowed and not both');

        expect(abiModelMock.hasEvent).toHaveBeenCalledWith('allEvents');
    });

    it('calls a property on the target that does not exist', () => {
        expect(() => {
            eventSubscriptionsProxy.doesNotExist();
        }).toThrow('eventSubscriptionsProxy.doesNotExist is not a function');
    });
});
