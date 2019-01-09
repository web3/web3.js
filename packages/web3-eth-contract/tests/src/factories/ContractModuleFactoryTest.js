import {AbiCoder} from 'web3-eth-abi';
import {MethodModuleFactory} from 'web3-core-method';
import {Accounts} from 'web3-eth-accounts';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';

import MethodOptionsValidator from '../../../src/validators/MethodOptionsValidator';
import MethodOptionsMapper from '../../../src/mappers/MethodOptionsMapper';
import EventSubscriptionsProxy from '../../../src/proxies/EventSubscriptionsProxy';
import MethodsProxy from '../../../src/proxies/MethodsProxy';
import EventSubscriptionFactory from '../../../src/factories/EventSubscriptionFactory';
import AllEventsOptionsMapper from '../../../src/mappers/AllEventsOptionsMapper';
import EventOptionsMapper from '../../../src/mappers/EventOptionsMapper';
import AllEventsLogDecoder from '../../../src/decoders/AllEventsLogDecoder';
import EventLogDecoder from '../../../src/decoders/EventLogDecoder';
import AbiMapper from '../../../src/mappers/AbiMapper';
import AllEventsFilterEncoder from '../../../src/encoders/AllEventsFilterEncoder';
import EventFilterEncoder from '../../../src/encoders/EventFilterEncoder';
import MethodEncoder from '../../../src/encoders/MethodEncoder';
import AbiItemModel from '../../../src/models/AbiItemModel';
import AbiModel from '../../../src/models/AbiModel';
import AbstractContract from '../../../src/AbstractContract';
import MethodFactory from '../../../src/factories/MethodFactory';
import ContractModuleFactory from '../../../src/factories/ContractModuleFactory';

// Mocks
jest.mock('AbiCoder');
jest.mock('MethodModuleFactory');
jest.mock('Accounts');
jest.mock('Utils');
jest.mock('formatters');
jest.mock('../../../src/validators/MethodOptionsValidator');
jest.mock('../../../src/mappers/MethodOptionsMapper');
jest.mock('../../../src/proxies/EventSubscriptionsProxy');
jest.mock('../../../src/proxies/MethodsProxy');
jest.mock('../../../src/factories/EventSubscriptionFactory');
jest.mock('../../../src/mappers/AllEventsOptionsMapper');
jest.mock('../../../src/mappers/EventOptionsMapper');
jest.mock('../../../src/decoders/AllEventsLogDecoder');
jest.mock('../../../src/decoders/EventLogDecoder');
jest.mock('../../../src/mappers/AbiMapper');
jest.mock('../../../src/encoders/AllEventsFilterEncoder');
jest.mock('../../../src/encoders/EventFilterEncoder');
jest.mock('../../../src/encoders/MethodEncoder');
jest.mock('../../../src/models/AbiItemModel');
jest.mock('../../../src/models/AbiModel');
jest.mock('../../../src/AbstractContract');
jest.mock('../../../src/factories/MethodFactory');

/**
 * ContractModuleFactory test
 */
describe('ContractModuleFactoryTest', () => {
    let contractModuleFactory, abiCoderMock, accountsMock, methodModuleFactoryMock;

    beforeEach(() => {
        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];

        new Accounts({}, {});
        accountsMock = Accounts.mock.instances[0];

        new MethodModuleFactory();
        methodModuleFactoryMock = MethodModuleFactory.mock.instances[0];

        contractModuleFactory = new ContractModuleFactory(
            Utils,
            formatters,
            abiCoderMock,
            accountsMock,
            methodModuleFactoryMock
        );
    });

    it('constructor check', () => {
        expect(contractModuleFactory.utils).toEqual(Utils);

        expect(contractModuleFactory.formatters).toEqual(formatters);

        expect(contractModuleFactory.abiCoder).toEqual(abiCoderMock);

        expect(contractModuleFactory.accounts).toEqual(accountsMock);

        expect(contractModuleFactory.methodModuleFactory).toEqual(methodModuleFactoryMock);
    });

    it('calls createContract and returns an AbstractContract object', () => {
        expect(contractModuleFactory.createContract({}, {}, {}, [], '', {})).toBeInstanceOf(AbstractContract);
    });

    it('calls createAbiModel and returns an AbiModel object', () => {
        expect(contractModuleFactory.createAbiModel({})).toBeInstanceOf(AbiModel);
    });

    it('calls createAbiItemModel and returns an AbiItemModel object', () => {
        expect(contractModuleFactory.createAbiItemModel({})).toBeInstanceOf(AbiItemModel);
    });

    it('calls createMethodEncoder and returns an MethodEncoder object', () => {
        expect(contractModuleFactory.createMethodEncoder()).toBeInstanceOf(MethodEncoder);
    });

    it('calls createEventFilterEncoder and returns an EventFilterEncoder object', () => {
        expect(contractModuleFactory.createEventFilterEncoder()).toBeInstanceOf(EventFilterEncoder);
    });

    it('calls createAllEventsFilterEncoder and returns an AllEventsFilterEncoder object', () => {
        expect(contractModuleFactory.createAllEventsFilterEncoder()).toBeInstanceOf(AllEventsFilterEncoder);
    });

    it('calls createAbiMapper and returns an AbiMapper object', () => {
        expect(contractModuleFactory.createAbiMapper()).toBeInstanceOf(AbiMapper);
    });

    it('calls createEventLogDecoder and returns an EventLogDecoder object', () => {
        expect(contractModuleFactory.createEventLogDecoder()).toBeInstanceOf(EventLogDecoder);
    });

    it('calls createAllEventsLogDecoder and returns an AllEventsLogDecoder object', () => {
        expect(contractModuleFactory.createAllEventsLogDecoder()).toBeInstanceOf(AllEventsLogDecoder);
    });

    it('calls createMethodOptionsValidator and returns an MethodOptionsValidator object', () => {
        expect(contractModuleFactory.createMethodOptionsValidator()).toBeInstanceOf(MethodOptionsValidator);
    });

    it('calls createMethodOptionsMapper and returns an MethodOptionsMapper object', () => {
        expect(contractModuleFactory.createMethodOptionsMapper()).toBeInstanceOf(MethodOptionsMapper);
    });

    it('calls createEventOptionsMapper and returns an EventOptionsMapper object', () => {
        expect(contractModuleFactory.createEventOptionsMapper()).toBeInstanceOf(EventOptionsMapper);
    });

    it('calls createAllEventsOptionsMapper and returns an AllEventsOptionsMapper object', () => {
        expect(contractModuleFactory.createAllEventsOptionsMapper()).toBeInstanceOf(AllEventsOptionsMapper);
    });

    it('calls createMethodFactory and returns an MethodFactory object', () => {
        expect(contractModuleFactory.createMethodFactory()).toBeInstanceOf(MethodFactory);
    });

    it('calls createMethodsProxy and returns an MethodsProxy object', () => {
        expect(contractModuleFactory.createMethodsProxy({}, {}, {})).toBeInstanceOf(MethodsProxy);
    });

    it('calls createEventSubscriptionsProxy and returns an EventSubscriptionsProxy object', () => {
        expect(contractModuleFactory.createEventSubscriptionsProxy({}, {}, {})).toBeInstanceOf(EventSubscriptionsProxy);
    });

    it('calls createEventSubscriptionFactory and returns an EventSubscriptionFactory object', () => {
        expect(contractModuleFactory.createEventSubscriptionFactory()).toBeInstanceOf(EventSubscriptionFactory);
    });
});
