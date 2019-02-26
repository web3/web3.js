import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {SendTransactionMethod} from 'web3-core-method';
import TransactionConfirmationWorkflow from '../../__mocks__/TransactionConfirmationWorkflow';
import AbstractContract from '../../../src/AbstractContract';
import ContractDeployMethod from '../../../src/methods/ContractDeployMethod';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('../../../src/AbstractContract');

/**
 * ContractDeployMethod test
 */
describe('ContractDeployMethodTest', () => {
    let contractDeployMethod, transactionConfirmationWorkflowMock, contractMock;

    beforeEach(() => {
        new AbstractContract();
        contractMock = AbstractContract.mock.instances[0];

        transactionConfirmationWorkflowMock = new TransactionConfirmationWorkflow();

        contractDeployMethod = new ContractDeployMethod(
            Utils,
            formatters,
            transactionConfirmationWorkflowMock,
            {},
            contractMock
        );
    });

    it('constructor check', () => {
        expect(contractDeployMethod.transactionConfirmationWorkflow).toEqual(transactionConfirmationWorkflowMock);

        expect(contractDeployMethod.sendRawTransactionMethod).toEqual({});

        expect(contractDeployMethod.contract).toEqual(contractMock);

        expect(contractDeployMethod).toBeInstanceOf(SendTransactionMethod);
    });

    it('calls beforeExecution and removes the to property from the options', () => {
        contractDeployMethod.arguments = [{to: true}];

        formatters.inputTransactionFormatter.mockReturnValueOnce({});

        contractDeployMethod.beforeExecution(contractMock);

        expect(contractDeployMethod.parameters[0].to).toBeUndefined();

        expect(formatters.inputTransactionFormatter).toHaveBeenCalled();
    });

    it('calls afterExecution and returns the cloned contract object', () => {
        contractMock.clone.mockReturnValueOnce({options: {address: ''}});

        const clonedContract = contractDeployMethod.afterExecution({contractAddress: '0x0'});

        expect(clonedContract.options.address).toEqual('0x0');

        expect(contractMock.clone).toHaveBeenCalled();
    });
});
