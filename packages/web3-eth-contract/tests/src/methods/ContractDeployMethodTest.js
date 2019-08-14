import {formatters} from 'web3-core-helpers';
import {EthSendTransactionMethod} from 'web3-core-method';
import AbstractContract from '../../../src/AbstractContract';
import ContractDeployMethod from '../../../src/methods/ContractDeployMethod';

// Mocks
jest.mock('web3-core-helpers');
jest.mock('../../../src/AbstractContract');

/**
 * ContractDeployMethod test
 */
describe('ContractDeployMethodTest', () => {
    let contractDeployMethod, contractMock;

    beforeEach(() => {
        new AbstractContract();
        contractMock = AbstractContract.mock.instances[0];

        contractDeployMethod = new ContractDeployMethod({}, formatters, contractMock, {}, {}, {});
    });

    it('constructor check', () => {
        expect(contractDeployMethod).toBeInstanceOf(EthSendTransactionMethod);
    });

    it('calls beforeExecution and removes the to property from the options', () => {
        contractDeployMethod.parameters = [{to: true}];

        formatters.inputTransactionFormatter.mockReturnValueOnce([{to: true}]);

        contractDeployMethod.beforeExecution();

        expect(contractDeployMethod.parameters[0].to).toBeUndefined();
    });

    it('calls beforeExecution and does nothing because it got signed locally', () => {
        contractDeployMethod.rpcMethod = 'eth_sendRawTransaction';
        contractDeployMethod.parameters = [{to: true}];

        contractDeployMethod.beforeExecution();

        expect(contractDeployMethod.parameters).toEqual([{to: true}]);
    });

    it('calls afterExecution and returns the cloned contract object', () => {
        contractMock.clone.mockReturnValueOnce({options: {address: ''}});

        const clonedContract = contractDeployMethod.afterExecution({contractAddress: '0x0'});

        expect(clonedContract.address).toEqual('0x0');

        expect(contractMock.clone).toHaveBeenCalled();
    });
});
