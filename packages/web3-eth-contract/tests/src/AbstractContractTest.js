import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {AbiCoder} from 'web3-eth-abi';
import {Accounts} from 'web3-eth-accounts';
import {HttpProvider, ProvidersModuleFactory} from 'web3-providers';
import {MethodModuleFactory} from 'web3-core-method';
import {PromiEvent} from 'web3-core-promievent';
import AbstractContract from '../../src/AbstractContract';
import ContractModuleFactory from '../../src/factories/ContractModuleFactory';

// Mocks
jest.mock('HttpProvider');
jest.mock('ProvidersModuleFactory');
jest.mock('MethodModuleFactory');
jest.mock('AbiCoder');
jest.mock('Accounts');

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
        accountsMock,
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

        new Accounts();
        accountsMock = Accounts.mock.instances[0];

        abi = [];
        options = {};

        abstractContract = new AbstractContract(
            providerMock,
            providersModuleFactoryMock,
            methodModuleFactoryMock,
            contractModuleFactoryMock,
            PromiEvent,
            abiCoderMock,
            Utils,
            formatters,
            accountsMock,
            abi,
            '0x0',
            options
        );
    });

    it('constructor check', () => {
        // expect(abstractContract).toEqual();
    });
});
