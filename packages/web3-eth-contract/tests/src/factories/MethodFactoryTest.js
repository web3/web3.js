import {MethodModuleFactory, EstimateGasMethod} from 'web3-core-method';
import {Accounts} from 'web3-eth-accounts';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {AbiCoder} from 'web3-eth-abi';

import MethodFactory from '../../../src/factories/MethodFactory';
import ContractModuleFactory from '../../../src/factories/ContractModuleFactory';
import CallContractMethod from '../../../src/methods/CallContractMethod';
import SendContractMethod from '../../../src/methods/SendContractMethod';
import ContractDeployMethod from '../../../src/methods/ContractDeployMethod';
import PastEventLogsMethod from '../../../src/methods/PastEventLogsMethod';

// Mocks
jest.mock('Accounts');
jest.mock('Utils');
jest.mock('formatters');
jest.mock('MethodModuleFactory');
jest.mock('EstimateGasMethod');
jest.mock('AbiCoder');
jest.mock('../../../src/factories/ContractModuleFactory');
jest.mock('../../../src/methods/CallContractMethod');
jest.mock('../../../src/methods/SendContractMethod');
jest.mock('../../../src/methods/ContractDeployMethod');
jest.mock('../../../src/methods/PastEventLogsMethod');

/**
 * MethodFactory test
 */
describe('MethodFactoryTest', () => {
    let methodFactory, accountsMock, contractModuleFactoryMock, methodModuleFactoryMock, abiCoderMock;

    beforeEach(() => {
        new Accounts();
        accountsMock = Accounts.mock.instances[0];

        new MethodModuleFactory(accountsMock);
        methodModuleFactoryMock = MethodModuleFactory.mock.instances[0];
        methodModuleFactoryMock.createTransactionSigner = jest.fn();
        methodModuleFactoryMock.createTransactionConfirmationWorkflow = jest.fn();

        new ContractModuleFactory({}, {}, {}, {}, {});
        contractModuleFactoryMock = ContractModuleFactory.mock.instances[0];

        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];

        methodFactory = new MethodFactory(
            accountsMock,
            Utils,
            formatters,
            contractModuleFactoryMock,
            methodModuleFactoryMock,
            abiCoderMock
        );
    });

    it('constructor check', () => {
        expect(methodFactory.accounts).toEqual(accountsMock);

        expect(methodFactory.utils).toEqual(Utils);

        expect(methodFactory.formatters).toEqual(formatters);

        expect(methodFactory.contractModuleFactory).toEqual(contractModuleFactoryMock);

        expect(methodFactory.methodModuleFactory).toEqual(methodModuleFactoryMock);
    });

    it('calls createMethodByRequestType with requestType call', () => {
        expect(methodFactory.createMethodByRequestType({}, {}, 'call')).toBeInstanceOf(CallContractMethod);
    });

    it('calls createMethodByRequestType with requestType send', () => {
        expect(methodFactory.createMethodByRequestType({}, {}, 'send')).toBeInstanceOf(SendContractMethod);
    });

    it('calls createMethodByRequestType with requestType estimate', () => {
        expect(methodFactory.createMethodByRequestType({}, {}, 'estimate')).toBeInstanceOf(EstimateGasMethod);
    });

    it('calls createMethodByRequestType with requestType contract-deployment', () => {
        expect(methodFactory.createMethodByRequestType({}, {}, 'contract-deployment')).toBeInstanceOf(
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

    it('calls createCallContractMethod and returns CallContractMethod object', () => {
        expect(methodFactory.createCallContractMethod({})).toBeInstanceOf(CallContractMethod);
    });

    it('calls createSendContractMethod and returns SendContractMethod object', () => {
        expect(methodFactory.createSendContractMethod({})).toBeInstanceOf(SendContractMethod);

        expect(contractModuleFactoryMock.createAllEventsLogDecoder).toHaveBeenCalled();

        expect(methodModuleFactoryMock.createTransactionSigner).toHaveBeenCalled();

        expect(methodModuleFactoryMock.createTransactionConfirmationWorkflow).toHaveBeenCalled();
    });

    it('calls createContractDeployMethod and returns ContractDeployMethod object', () => {
        expect(methodFactory.createContractDeployMethod({})).toBeInstanceOf(ContractDeployMethod);

        expect(methodModuleFactoryMock.createTransactionSigner).toHaveBeenCalled();

        expect(methodModuleFactoryMock.createTransactionConfirmationWorkflow).toHaveBeenCalled();
    });

    it('calls createEstimateGasMethod and returns EstimateGasMethod object', () => {
        expect(methodFactory.createEstimateGasMethod({})).toBeInstanceOf(EstimateGasMethod);
    });
});
