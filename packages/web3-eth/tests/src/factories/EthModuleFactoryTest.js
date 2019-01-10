import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {MethodModuleFactory} from 'web3-core-method';
import {PromiEvent} from 'web3-core-promievent';
import {Accounts} from 'web3-eth-accounts';
import {AbiCoder} from 'web3-eth-abi';
import {ContractModuleFactory} from 'web3-eth-contract';
import {HttpProvider, ProvidersModuleFactory} from 'web3-providers';
import Eth from '../../../src/Eth';
import EthModuleFactory from '../../../src/factories/EthModuleFactory';

// Mocks
jest.mock('HttpProvider');
jest.mock('ProvidersModuleFactory');
jest.mock('MethodModuleFactory');
jest.mock('Accounts');
jest.mock('ContractModuleFactory');
jest.mock('AbiCoder');
jest.mock('Utils');
jest.mock('formatters');
jest.mock('../../../src/Eth');

/**
 * EthModuleFactory test
 */
describe('EthModuleFactoryTest', () => {
    let ethModuleFactory,
        providerMock,
        providersModuleFactoryMock,
        methodModuleFactoryMock,
        accountsMock,
        contractModuleFactoryMock,
        abiCoderMock;

    beforeEach(() => {
        new HttpProvider();
        providerMock = HttpProvider.mock.instances[0];

        new ProvidersModuleFactory();
        providersModuleFactoryMock = ProvidersModuleFactory.mock.instances[0];

        new MethodModuleFactory();
        methodModuleFactoryMock = MethodModuleFactory.mock.instances[0];

        new Accounts();
        accountsMock = Accounts.mock.instances[0];

        new ContractModuleFactory();
        contractModuleFactoryMock = ContractModuleFactory.mock.instances[0];

        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];

        ethModuleFactory = new EthModuleFactory(
            providerMock,
            providersModuleFactoryMock,
            methodModuleFactoryMock,
            accountsMock,
            PromiEvent,
            Utils,
            formatters,
            contractModuleFactoryMock,
            abiCoderMock
        );
    });

    it('constructor check', () => {
        expect(ethModuleFactory.provider).toEqual(providerMock);

        expect(ethModuleFactory.providersModuleFactory).toEqual(providersModuleFactoryMock);

        expect(ethModuleFactory.methodModuleFactory).toEqual(methodModuleFactoryMock);

        expect(ethModuleFactory.accounts).toEqual(accountsMock);

        expect(ethModuleFactory.PromiEvent).toEqual(PromiEvent);

        expect(ethModuleFactory.utils).toEqual(Utils);

        expect(ethModuleFactory.formatters).toEqual(formatters);

        expect(ethModuleFactory.contractModuleFactory).toEqual(contractModuleFactoryMock);

        expect(ethModuleFactory.abiCoder).toEqual(abiCoderMock);
    });

    it('calls createEthModule and returns a Contract object', () => {
        expect(ethModuleFactory.createEthModule({}, '', {})).toBeInstanceOf(Eth);
    });
});
