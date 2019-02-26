import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {AbiCoder} from 'web3-eth-abi';
import {CallMethod} from 'web3-core-method';
import AbiItemModel from '../../../src/models/AbiItemModel';
import CallContractMethod from '../../../src/methods/CallContractMethod';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('AbiCoder');
jest.mock('../../../src/models/AbiItemModel');

/**
 * CallContractMethod test
 */
describe('CallContractMethodTest', () => {
    let callContractMethod, abiItemModelMock, abiCoderMock;

    beforeEach(() => {
        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];

        new AbiItemModel();
        abiItemModelMock = AbiItemModel.mock.instances[0];

        callContractMethod = new CallContractMethod(Utils, formatters, abiCoderMock, abiItemModelMock);
    });

    it('constructor check', () => {
        expect(callContractMethod.utils).toEqual(Utils);

        expect(callContractMethod.formatters).toEqual(formatters);

        expect(callContractMethod.abiItemModel).toEqual(abiItemModelMock);

        expect(callContractMethod).toBeInstanceOf(CallMethod);
    });

    it('calls afterExecution with undefined response and returns the expected result', () => {
        expect(callContractMethod.afterExecution()).toEqual(null);
    });

    it('calls afterExecution and returns the result array', () => {
        abiCoderMock.decodeParameters = jest.fn();
        
        abiCoderMock.decodeParameters.mockReturnValueOnce(['0x0', '0x0']);

        abiItemModelMock.getOutputs.mockReturnValueOnce([{name: "", type: 'bytes'}, {name: "", type: 'bytes'}]);

        expect(callContractMethod.afterExecution('0x0')).toEqual(['0x0', '0x0']);

        expect(abiCoderMock.decodeParameters).toHaveBeenCalledWith([{name: "", type: 'bytes'}, {name: "", type: 'bytes'}], '0');
    });

    it('calls afterExecution and returns the first array item as result', () => {
        abiCoderMock.decodeParameter = jest.fn();

        abiCoderMock.decodeParameter.mockReturnValueOnce('0x0');

        abiItemModelMock.getOutputs.mockReturnValueOnce([{name: "result", type: 'bytes'}]);

        expect(callContractMethod.afterExecution('0x0')).toEqual('0x0');

        expect(abiCoderMock.decodeParameter).toHaveBeenCalledWith('bytes', '0');
    });
});
