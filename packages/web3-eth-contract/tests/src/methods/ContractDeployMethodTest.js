import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {
    ChainIdMethod,
    GetTransactionCountMethod,
    SendRawTransactionMethod,
    SendTransactionMethod
} from 'web3-core-method';
import TransactionConfirmationWorkflow from '../../__mocks__/TransactionConfirmationWorkflow';
import AbstractContract from '../../../src/AbstractContract';
import ContractDeployMethod from '../../../src/methods/ContractDeployMethod';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('SendRawTransactionMethod');
jest.mock('ChainIdMethod');
jest.mock('GetTransactionCountMethod');
jest.mock('../../../src/AbstractContract');

/**
 * ContractDeployMethod test
 */
describe('ContractDeployMethodTest', () => {
    let contractDeployMethod,
        transactionConfirmationWorkflowMock,
        contractMock,
        sendRawTransactionMethodMock,
        chainIdMethodMock,
        getTransactionCountMethodMock;

    beforeEach(() => {
        new AbstractContract();
        contractMock = AbstractContract.mock.instances[0];

        new SendRawTransactionMethod();
        sendRawTransactionMethodMock = SendRawTransactionMethod.mock.instances[0];

        new ChainIdMethod();
        chainIdMethodMock = ChainIdMethod.mock.instances[0];

        new GetTransactionCountMethod();
        getTransactionCountMethodMock = GetTransactionCountMethod.mock.instances[0];

        transactionConfirmationWorkflowMock = new TransactionConfirmationWorkflow();

        contractDeployMethod = new ContractDeployMethod(
            Utils,
            formatters,
            transactionConfirmationWorkflowMock,
            sendRawTransactionMethodMock,
            chainIdMethodMock,
            getTransactionCountMethodMock,
            contractMock
        );
    });

    it('constructor check', () => {
        expect(contractDeployMethod.contract).toEqual(contractMock);

        expect(contractDeployMethod).toBeInstanceOf(SendTransactionMethod);
    });

    it('calls beforeExecution and removes the to property from the options', () => {
        contractDeployMethod.parameters = [{to: true}];

        contractDeployMethod.beforeExecution(contractMock);

        expect(contractDeployMethod.parameters[0].to).toBeUndefined();
    });

    it('calls afterExecution and returns the cloned contract object', () => {
        contractMock.clone.mockReturnValueOnce({options: {address: ''}});

        const clonedContract = contractDeployMethod.afterExecution({contractAddress: '0x0'});

        expect(clonedContract.options.address).toEqual('0x0');

        expect(contractMock.clone).toHaveBeenCalled();
    });
});
