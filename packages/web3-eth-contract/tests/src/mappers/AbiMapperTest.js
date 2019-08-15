import {AbiCoder} from 'web3-eth-abi';
import ContractModuleFactory from '../../../src/factories/ContractModuleFactory';
import AbiMapper from '../../../src/mappers/AbiMapper';

// Mocks
jest.mock('web3-eth-abi');
jest.mock('../../../src/factories/ContractModuleFactory');

/**
 * AbiMapper test
 */
describe('AbiMapperTest', () => {
    let abiMapper, contractModuleFactoryMock, abiCoderMock;

    beforeEach(() => {
        new ContractModuleFactory();
        contractModuleFactoryMock = ContractModuleFactory.mock.instances[0];

        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];
        abiCoderMock.encodeFunctionSignature = jest.fn();
        abiCoderMock.encodeEventSignature = jest.fn();

        abiMapper = new AbiMapper(contractModuleFactoryMock, abiCoderMock);
    });

    it('constructor check', () => {
        expect(abiMapper.contractModuleFactory).toEqual(contractModuleFactoryMock);

        expect(abiMapper.abiCoder).toEqual(abiCoderMock);

        expect(abiMapper.hasConstructor).toEqual(false);
    });

    it('calls map with ABI items of type function and returns the expected result', () => {
        const abi = [
            {
                name: 'item',
                type: 'function',
                constant: true,
                payable: true
            },
            {
                name: 'item',
                type: 'function',
                constant: true,
                payable: true
            },
            {
                name: 'item',
                type: 'function',
                constant: true,
                payable: true
            },
            {
                name: 'item',
                type: 'constructor',
                constant: true,
                payable: true
            }
        ];

        abiCoderMock.encodeFunctionSignature.mockReturnValue('funcSignature');

        contractModuleFactoryMock.createAbiItemModel.mockReturnValue(true);

        contractModuleFactoryMock.createAbiModel.mockReturnValue(true);

        const response = abiMapper.map(abi);

        expect(response).toEqual(true);

        expect(abiCoderMock.encodeFunctionSignature).toHaveBeenCalledWith('funcName');

        expect(abiCoderMock.encodeFunctionSignature).toHaveBeenCalledTimes(3);

        expect(contractModuleFactoryMock.createAbiModel).toHaveBeenCalledWith({
            events: {},
            methods: {
                item: [true, true, true],
                funcSignature: true,
                funcName: true,
                contractConstructor: true
            }
        });
    });

    it('calls map with ABI items of type event and returns the expected result', () => {
        const abi = [
            {
                name: 'item',
                type: 'event',
                constant: true,
                payable: true
            },
            {
                name: 'item',
                type: 'event',
                constant: true,
                payable: true
            },
            {
                name: 'item',
                type: 'event',
                constant: true,
                payable: true
            }
        ];

        abiCoderMock.encodeEventSignature.mockReturnValue('eventSignature');

        contractModuleFactoryMock.createAbiItemModel.mockReturnValue(true);

        contractModuleFactoryMock.createAbiModel.mockReturnValue(true);

        const response = abiMapper.map(abi);

        expect(response).toEqual(true);

        expect(abiCoderMock.encodeEventSignature).toHaveBeenCalledWith('eventName');

        expect(abiCoderMock.encodeEventSignature).toHaveBeenCalledTimes(3);

        expect(contractModuleFactoryMock.createAbiModel).toHaveBeenCalledWith({
            events: {
                item: true,
                eventSignature: true,
                eventName: true
            },
            methods: {contractConstructor: true}
        });
    });

    it('calls map with an ABI item of type constructor and returns the expected result', () => {
        const abi = [
            {
                name: 'item',
                type: 'constructor',
                constant: true,
                payable: true
            }
        ];

        contractModuleFactoryMock.createAbiItemModel.mockReturnValue(true);

        contractModuleFactoryMock.createAbiModel.mockReturnValue(true);

        const response = abiMapper.map(abi);

        expect(response).toEqual(true);

        expect(contractModuleFactoryMock.createAbiModel).toHaveBeenCalledWith({
            events: {},
            methods: {contractConstructor: true}
        });
    });
});
