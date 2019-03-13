import {EstimateGasMethod} from 'web3-core-method';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {AbiCoder} from 'web3-eth-abi';

import MethodFactory from '../../../src/factories/MethodFactory';
import ContractModuleFactory from '../../../src/factories/ContractModuleFactory';
import CallContractMethod from '../../../src/methods/CallContractMethod';
import SendContractMethod from '../../../src/methods/SendContractMethod';
import ContractDeployMethod from '../../../src/methods/ContractDeployMethod';
import PastEventLogsMethod from '../../../src/methods/PastEventLogsMethod';
import AllPastEventLogsMethod from '../../../src/methods/AllPastEventLogsMethod';

// Mocks
jest.mock('Accounts');
jest.mock('Utils');
jest.mock('formatters');
jest.mock('AbiCoder');
jest.mock('../../../src/factories/ContractModuleFactory');
jest.mock('../../../src/methods/CallContractMethod');
jest.mock('../../../src/methods/SendContractMethod');
jest.mock('../../../src/methods/ContractDeployMethod');
jest.mock('../../../src/methods/PastEventLogsMethod');
jest.mock('../../../src/methods/AllPastEventLogsMethod');

/**
 * MethodFactory test
 */
describe('MethodFactoryTest', () => {
    let methodFactory, contractModuleFactoryMock, abiCoderMock;

    beforeEach(() => {
        new ContractModuleFactory({}, {}, {});
        contractModuleFactoryMock = ContractModuleFactory.mock.instances[0];

        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];

        methodFactory = new MethodFactory(
            Utils,
            formatters,
            contractModuleFactoryMock,
            abiCoderMock
        );
    });

    it('constructor check', () => {
        expect(methodFactory.utils).toEqual(Utils);

        expect(methodFactory.formatters).toEqual(formatters);

        expect(methodFactory.contractModuleFactory).toEqual(contractModuleFactoryMock);
    });

    it('calls createMethodByRequestType with requestType call', () => {
        expect(methodFactory.createMethodByRequestType({}, {}, 'call')).toBeInstanceOf(CallContractMethod);
    });

    it('calls createMethodByRequestType with requestType send', () => {
        const contract = {currentProvider: {constructor: {name: 'HttpProvider'}}};

        expect(methodFactory.createMethodByRequestType({}, contract, 'send')).toBeInstanceOf(SendContractMethod);
    });

    it('calls createMethodByRequestType with requestType send and a socketProvider', () => {
        const contract = {currentProvider: {constructor: {name: 'WebsocketProvider'}}};

        expect(methodFactory.createMethodByRequestType({}, contract, 'send')).toBeInstanceOf(SendContractMethod);
    });

    it('calls createMethodByRequestType with requestType estimate', () => {
        expect(methodFactory.createMethodByRequestType({}, {}, 'estimate')).toBeInstanceOf(EstimateGasMethod);
    });

    it('calls createMethodByRequestType with requestType contract-deployment', () => {
        const contract = {currentProvider: {constructor: {name: 'WebsocketProvider'}}};

        expect(methodFactory.createMethodByRequestType({}, contract, 'contract-deployment')).toBeInstanceOf(
            ContractDeployMethod
        );
    });

    it('calls createMethodByRequestType with unknown requestType', () => {
        expect(() => {
            methodFactory.createMethodByRequestType({}, {}, 'nope');
        }).toThrow('RPC call not found with requestType: "nope"');
    });

    it('calls createPastEventLogsMethod and returns PastEventLogsMethod object', () => {
        expect(methodFactory.createPastEventLogsMethod({})).toBeInstanceOf(PastEventLogsMethod);

        expect(contractModuleFactoryMock.createEventLogDecoder).toHaveBeenCalled();
    });

    it('calls createAllPastEventLogsMethod and returns PastEventLogsMethod object', () => {
        expect(methodFactory.createAllPastEventLogsMethod({})).toBeInstanceOf(AllPastEventLogsMethod);

        expect(contractModuleFactoryMock.createAllEventsLogDecoder).toHaveBeenCalled();
    });

    it('calls createCallContractMethod and returns CallContractMethod object', () => {
        expect(methodFactory.createCallContractMethod({})).toBeInstanceOf(CallContractMethod);
    });

    it('calls createSendContractMethod and returns SendContractMethod object', () => {
        const contract = {currentProvider: {constructor: {name: 'HttpProvider'}}};

        expect(methodFactory.createSendContractMethod(contract)).toBeInstanceOf(SendContractMethod);

        expect(contractModuleFactoryMock.createAllEventsLogDecoder).toHaveBeenCalled();
    });

    it('calls createContractDeployMethod and returns ContractDeployMethod object', () => {
        const contract = {currentProvider: {constructor: {name: 'HttpProvider'}}};

        expect(methodFactory.createContractDeployMethod(contract)).toBeInstanceOf(ContractDeployMethod);
    });

    it('calls createEstimateGasMethod and returns EstimateGasMethod object', () => {
        expect(methodFactory.createEstimateGasMethod({})).toBeInstanceOf(EstimateGasMethod);
    });
});
