import * as Utils from 'web3-utils';
import {AbiCoder as EthersAbiCoder} from 'ethers/utils/abi-coder';
import AbiCoder from '../src/AbiCoder';

// Mocks
jest.mock('Utils');
jest.mock('ethers/utils/abi-coder');

/**
 * AbiCoder test
 */
describe('AbiCoderTest', () => {
    let abiCoder, ethersAbiCoderMock;

    beforeEach(() => {
        new EthersAbiCoder();
        ethersAbiCoderMock = EthersAbiCoder.mock.instances[0];

        abiCoder = new AbiCoder(Utils, ethersAbiCoderMock);
    });

    it('constructor check', () => {
        expect(abiCoder.utils).toEqual(Utils);

        expect(abiCoder.ethersAbiCoder).toEqual(ethersAbiCoderMock);
    });

    it('calls encodeFunctionSignature with a string as parameter', () => {
        Utils.sha3 = jest.fn(() => {
            return '0x000000000';
        });

        expect(abiCoder.encodeFunctionSignature('functionName')).toEqual('0x00000000');

        expect(Utils.sha3).toHaveBeenCalledWith('functionName');
    });

    it('calls encodeFunctionSignature with a object as parameter', () => {
        Utils.jsonInterfaceMethodToString.mockReturnValueOnce('0x000000000');

        Utils.sha3 = jest.fn(() => {
            return '0x000000000';
        });

        expect(abiCoder.encodeFunctionSignature({})).toEqual('0x00000000');

        expect(Utils.jsonInterfaceMethodToString).toHaveBeenCalledWith({});

        expect(Utils.sha3).toHaveBeenCalledWith('0x000000000');
    });

    it('calls encodeEventSignature with a object as parameter', () => {
        Utils.jsonInterfaceMethodToString.mockReturnValueOnce('0x000000000');

        Utils.sha3 = jest.fn(() => {
            return '0x000000000';
        });

        expect(abiCoder.encodeEventSignature({})).toEqual('0x000000000');

        expect(Utils.jsonInterfaceMethodToString).toHaveBeenCalledWith({});

        expect(Utils.sha3).toHaveBeenCalledWith('0x000000000');
    });

    it('calls encodeEventSignature with a string as parameter', () => {
        Utils.sha3 = jest.fn(() => {
            return '0x000000000';
        });

        expect(abiCoder.encodeEventSignature('functionName')).toEqual('0x000000000');

        expect(Utils.sha3).toHaveBeenCalledWith('functionName');
    });

    it('calls encodeParameters', () => {
        ethersAbiCoderMock.encode.mockReturnValueOnce(true);

        expect(abiCoder.encodeParameters([{components: true}], [])).toEqual(true);

        expect(ethersAbiCoderMock.encode).toHaveBeenCalledWith([{components: true}], []);
    });

    it('calls encodeParameter', () => {
        ethersAbiCoderMock.encode.mockReturnValueOnce(true);

        expect(abiCoder.encodeParameter({components: true}, '')).toEqual(true);

        expect(ethersAbiCoderMock.encode).toHaveBeenCalledWith([{components: true}], ['']);
    });

    it('calls _mapTypes and returns the expected types format', () => {
        const types = [
            {
                'StructName[]': {
                    item: 'type',
                    ChildStruct: {
                        item: 'type'
                    }
                }
            }
        ];

        expect(abiCoder._mapTypes(types)).toEqual([
            {
                type: 'tuple[]',
                name: 'StructName',
                components: [
                    {
                        name: 'item',
                        type: 'type'
                    },
                    {
                        type: 'tuple',
                        name: 'ChildStruct',
                        components: [
                            {
                                name: 'item',
                                type: 'type'
                            }
                        ]
                    }
                ]
            }
        ]);
    });

    it('calls encodeFunctionCall and returns the expected string', () => {
        Utils.sha3 = jest.fn(() => {
            return '0x000000000';
        });

        ethersAbiCoderMock.encode.mockReturnValueOnce('0x0');

        expect(abiCoder.encodeFunctionCall({inputs: [{components: true}]}, [])).toEqual('0x000000000');

        expect(ethersAbiCoderMock.encode).toHaveBeenCalledWith([{components: true}], []);
    });

    it('calls decodeParameters and returns the expected object', () => {
        ethersAbiCoderMock.decode.mockReturnValueOnce(['0']);

        expect(abiCoder.decodeParameters([{name: 'output'}], '0x0')).toEqual({output: '0', '0': '0'});

        expect(ethersAbiCoderMock.decode).toHaveBeenCalledWith([{name: 'output'}], '0x0');
    });

    it('calls decodeParameters and throws an error', () => {
        expect(() => {
            abiCoder.decodeParameters(['0'], '0x');
        }).toThrow("Returned values aren't valid, did it run Out of Gas?");

        expect(() => {
            abiCoder.decodeParameters(['0'], '0X');
        }).toThrow("Returned values aren't valid, did it run Out of Gas?");

        expect(() => {
            abiCoder.decodeParameters(['0']);
        }).toThrow("Returned values aren't valid, did it run Out of Gas?");
    });

    it('calls decodeParameter and returns the expected object', () => {
        ethersAbiCoderMock.decode.mockReturnValueOnce(['0']);

        expect(abiCoder.decodeParameter({name: 'output'}, '0x0')).toEqual('0');

        expect(ethersAbiCoderMock.decode).toHaveBeenCalledWith([{name: 'output'}], '0x0');
    });

    it('calls decodeLog and returns the expected object', () => {
        ethersAbiCoderMock.decode.mockReturnValueOnce(['0']).mockReturnValueOnce(['', '', '0']);

        const inputs = [
            {
                components: true,
                indexed: true,
                type: 'bool'
            },
            {
                components: true,
                indexed: true,
                type: ''
            },
            {
                components: true,
                indexed: false,
                name: 'input'
            }
        ];

        expect(abiCoder.decodeLog(inputs, '0x0', ['0x0', '0x0'])).toEqual({'0': '0', '1': '0x0', '2': '', input: ''});

        expect(ethersAbiCoderMock.decode).toHaveBeenNthCalledWith(1, [inputs[0].type], '0x0');

        expect(ethersAbiCoderMock.decode).toHaveBeenNthCalledWith(2, [inputs[2]], '0x0');
    });
});
