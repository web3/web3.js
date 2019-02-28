import cloneDeep from 'lodash/cloneDeep';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {AbiCoder} from 'web3-eth-abi';
import {HttpProvider, ProvidersModuleFactory, ProviderDetector, ProviderResolver} from 'web3-providers';
import {MethodModuleFactory, GetPastLogsMethod} from 'web3-core-method';
import {PromiEvent} from 'web3-core-promievent';
import {AbstractWeb3Module} from 'web3-core';
import AbiMapper from '../../src/mappers/AbiMapper';
import ContractModuleFactory from '../../src/factories/ContractModuleFactory';
import MethodFactory from '../../src/factories/MethodFactory';
import AbiModel from '../../src/models/AbiModel';
import MethodsProxy from '../../src/proxies/MethodsProxy';
import EventLogSubscription from '../../src/subscriptions/EventLogSubscription';
import EventSubscriptionsProxy from '../../src/proxies/EventSubscriptionsProxy';
import AbstractContract from '../../src/AbstractContract';

// Mocks
jest.mock('HttpProvider');
jest.mock('ProvidersModuleFactory');
jest.mock('ProviderDetector');
jest.mock('ProviderResolver');
jest.mock('MethodModuleFactory');
jest.mock('GetPastLogsMethod');
jest.mock('AbiCoder');
jest.mock('lodash/cloneDeep');
jest.mock('../../src/mappers/AbiMapper');
jest.mock('../../src/factories/ContractModuleFactory');
jest.mock('../../src/factories/MethodFactory');
jest.mock('../../src/models/AbiModel');
jest.mock('../../src/proxies/MethodsProxy');
jest.mock('../../src/proxies/EventSubscriptionsProxy');
jest.mock('../../src/subscriptions/EventLogSubscription');

/**
 * AbstractContract test
 */
describe('AbstractContractTest', () => {
    let abstractContract,
        providerMock,
        providersModuleFactoryMock,
        methodModuleFactoryMock,
        contractModuleFactoryMock,
        abiCoderMock,
        abiMapperMock,
        methodFactoryMock,
        abiModelMock,
        methodsProxyMock,
        eventSubscriptionsProxyMock,
        providerDetectorMock,
        providerResolverMock,
        abi,
        options;

    beforeEach(() => {
        new HttpProvider();
        providerMock = HttpProvider.mock.instances[0];

        new ProvidersModuleFactory();
        providersModuleFactoryMock = ProvidersModuleFactory.mock.instances[0];

        new MethodModuleFactory();
        methodModuleFactoryMock = MethodModuleFactory.mock.instances[0];

        new ContractModuleFactory();
        contractModuleFactoryMock = ContractModuleFactory.mock.instances[0];

        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];

        new AbiMapper();
        abiMapperMock = AbiMapper.mock.instances[0];

        new MethodFactory();
        methodFactoryMock = MethodFactory.mock.instances[0];

        new AbiModel();
        abiModelMock = AbiModel.mock.instances[0];

        new MethodsProxy();
        methodsProxyMock = MethodsProxy.mock.instances[0];

        new EventSubscriptionsProxy();
        eventSubscriptionsProxyMock = EventSubscriptionsProxy.mock.instances[0];

        new ProviderDetector();
        providerDetectorMock = ProviderDetector.mock.instances[0];

        new ProviderResolver();
        providerResolverMock = ProviderResolver.mock.instances[0];

        abi = [];
        options = {transactionSigner: {}};

        providerDetectorMock.detect = jest.fn(() => {
            return null;
        });

        providerResolverMock.resolve = jest.fn(() => {
            return providerMock;
        });

        providersModuleFactoryMock.createProviderDetector.mockReturnValueOnce(providerDetectorMock);

        providersModuleFactoryMock.createProviderResolver.mockReturnValueOnce(providerResolverMock);

        contractModuleFactoryMock.createAbiMapper.mockReturnValueOnce(abiMapperMock);

        contractModuleFactoryMock.createMethodFactory.mockReturnValueOnce(methodFactoryMock);

        contractModuleFactoryMock.createMethodsProxy.mockReturnValueOnce(methodsProxyMock);

        contractModuleFactoryMock.createEventSubscriptionsProxy.mockReturnValueOnce(eventSubscriptionsProxyMock);

        abiMapperMock.map.mockReturnValueOnce(abiModelMock);

        abstractContract = new AbstractContract(
            providerMock,
            providersModuleFactoryMock,
            methodModuleFactoryMock,
            contractModuleFactoryMock,
            PromiEvent,
            {},
            abiCoderMock,
            Utils,
            formatters,
            abi,
            '0x0',
            options
        );
    });

    it('constructor check', () => {
        expect(contractModuleFactoryMock.createAbiMapper).toHaveBeenCalled();

        expect(contractModuleFactoryMock.createMethodFactory).toHaveBeenCalled();

        expect(contractModuleFactoryMock.createMethodsProxy).toHaveBeenCalledWith(
            abstractContract,
            abiModelMock,
            PromiEvent
        );

        expect(contractModuleFactoryMock.createEventSubscriptionsProxy).toHaveBeenCalledWith(
            abstractContract,
            abiModelMock,
            PromiEvent
        );

        expect(abiMapperMock.map).toHaveBeenCalledWith([]);

        expect(abstractContract.contractModuleFactory).toEqual(contractModuleFactoryMock);

        expect(abstractContract.abiCoder).toEqual(abiCoderMock);

        expect(abstractContract.utils).toEqual(Utils);

        expect(abstractContract.formatters).toEqual(formatters);

        expect(abstractContract.abiMapper).toEqual(abiMapperMock);

        expect(abstractContract.options).toEqual({address: '0x0', transactionSigner: {}});

        expect(abstractContract.PromiEvent).toEqual(PromiEvent);

        expect(abstractContract.accounts).toEqual({});

        expect(abstractContract.methodFactory).toEqual(methodFactoryMock);

        expect(abstractContract.abiModel).toEqual(abiModelMock);

        expect(abstractContract.address).toEqual('0x0');

        expect(abstractContract.transactionSigner).toEqual({});

        expect(abstractContract.methods).toEqual(methodsProxyMock);

        expect(abstractContract.events).toEqual(eventSubscriptionsProxyMock);

        expect(abstractContract).toBeInstanceOf(AbstractWeb3Module);
    });

    it('calls once and throws an error because no callback is defined', () => {
        expect(() => {
            abstractContract.once('event', {});
        }).toThrow('Once requires a callback function.');
    });

    it('calls once and returns one subscription item', () => {
        new EventLogSubscription();
        const eventSubscriptionMock = EventLogSubscription.mock.instances[0];

        eventSubscriptionMock.on = jest.fn((event, callback) => {
            expect(event).toEqual('data');

            expect(callback).toBeInstanceOf(Function);

            callback();
        });

        eventSubscriptionsProxyMock.event = jest.fn((options, callback) => {
            expect(options).toEqual({});

            expect(callback).toBeInstanceOf(Function);

            return eventSubscriptionMock;
        });

        const options = {fromBlock: true};
        abstractContract.once('event', options, () => {});

        expect(eventSubscriptionMock.unsubscribe).toHaveBeenCalled();

        expect(eventSubscriptionMock.on).toHaveBeenCalled();

        expect(options.fromBlock).toBeUndefined();
    });

    it('calls getPastEvents and returns a resolved promise', async () => {
        abiModelMock.hasEvent.mockReturnValueOnce(true);

        abiModelMock.getEvent.mockReturnValueOnce({});

        new GetPastLogsMethod();
        const getPastLogsMethodMock = GetPastLogsMethod.mock.instances[0];

        getPastLogsMethodMock.execute.mockReturnValueOnce(Promise.resolve(true));

        methodFactoryMock.createPastEventLogsMethod.mockReturnValueOnce(getPastLogsMethodMock);

        await expect(abstractContract.getPastEvents('eventName', {}, () => {})).resolves.toEqual(true);

        expect(abiModelMock.hasEvent).toHaveBeenCalledWith('eventName');

        expect(abiModelMock.getEvent).toHaveBeenCalledWith('eventName');

        expect(getPastLogsMethodMock.execute).toHaveBeenCalledWith(abstractContract);

        expect(methodFactoryMock.createPastEventLogsMethod).toHaveBeenCalledWith({});

        expect(getPastLogsMethodMock.parameters).toEqual([{}]);

        expect(getPastLogsMethodMock.callback).toBeInstanceOf(Function);
    });

    it('calls getPastEvents with "allEvents" and returns a resolved promise', async () => {
        new GetPastLogsMethod();
        const getPastLogsMethodMock = GetPastLogsMethod.mock.instances[0];

        getPastLogsMethodMock.execute.mockReturnValueOnce(Promise.resolve(true));

        methodFactoryMock.createAllPastEventLogsMethod.mockReturnValueOnce(getPastLogsMethodMock);

        await expect(abstractContract.getPastEvents('allEvents', {}, () => {})).resolves.toEqual(true);

        expect(getPastLogsMethodMock.execute).toHaveBeenCalledWith(abstractContract);

        expect(methodFactoryMock.createAllPastEventLogsMethod).toHaveBeenCalledWith(abiModelMock);

        expect(getPastLogsMethodMock.parameters).toEqual([{}]);

        expect(getPastLogsMethodMock.callback).toBeInstanceOf(Function);
    });

    it('calls getPastEvents and returns a rejected promise', async () => {
        abiModelMock.hasEvent.mockReturnValueOnce(false);

        await expect(abstractContract.getPastEvents('eventName', {}, () => {})).rejects.toThrow(
            'Event with name "eventName" does not exists.'
        );

        expect(abiModelMock.hasEvent).toHaveBeenCalledWith('eventName');
    });

    it('calls deploy', () => {
        methodsProxyMock.contractConstructor = jest.fn(() => {
            return true;
        });

        expect(abstractContract.deploy({})).toEqual(true);

        expect(methodsProxyMock.contractConstructor).toHaveBeenCalledWith({});
    });

    it('calls clone and returns the cloned contract object', () => {
        cloneDeep.mockReturnValueOnce(true);

        expect(abstractContract.clone()).toEqual(true);

        expect(cloneDeep).toHaveBeenCalledWith(abstractContract);
    });

    it('gets the jsonInterface property', () => {
        expect(abstractContract.jsonInterface).toEqual(abiModelMock);
    });

    it('sets the jsonInterface property', () => {
        abiMapperMock.map.mockReturnValueOnce(abiModelMock);

        abstractContract.jsonInterface = {};

        expect(abiMapperMock.map).toHaveBeenCalledWith({});

        expect(abstractContract.methods.abiModel).toEqual(abiModelMock);

        expect(abstractContract.events.abiModel).toEqual(abiModelMock);
    });
});
