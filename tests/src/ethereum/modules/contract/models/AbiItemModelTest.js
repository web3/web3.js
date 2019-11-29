import AbiItemModel from '../../../src/models/AbiItemModel';

/**
 * AbiItemModel test
 */
describe('AbiItemModelTest', () => {
    let abiItemModel, abiItem;

    beforeEach(() => {
        abiItem = {
            signature: 'signature',
            name: 'name',
            anonymous: false,
            payable: true,
            type: 'function',
            constant: true
        };
        abiItemModel = new AbiItemModel(abiItem);
    });

    it('constructor check', () => {
        expect(abiItemModel.abiItem).toEqual(abiItem);
    });

    it('calls getInputLength and returns "0" because inputs is not of type array', () => {
        expect(abiItemModel.getInputLength()).toEqual(0);
    });

    it('calls getInputLength and returns the correct inputs length', () => {
        abiItem.inputs = [true, true];

        expect(abiItemModel.getInputLength()).toEqual(2);
    });

    it('calls getInputs and returns a empty array because inputs are not defined', () => {
        expect(abiItemModel.getInputs()).toEqual([]);
    });

    it('calls getInputs and returns the inputs of the ABI item', () => {
        abiItem.inputs = [true];

        expect(abiItemModel.getInputs()).toEqual([true]);
    });

    it('calls getOutputs and returns a empty array because outputs are not defined', () => {
        expect(abiItemModel.getOutputs()).toEqual([]);
    });

    it('calls getOutputs and returns the outputs of the ABI item', () => {
        abiItem.outputs = [true];

        expect(abiItemModel.getOutputs()).toEqual([true]);
    });

    it('calls getIndexedInputs and returns the expected inputs', () => {
        abiItem.inputs = [{indexed: true}, {indexed: false}];

        expect(abiItemModel.getIndexedInputs()).toEqual([{indexed: true}]);
    });

    it('calls isOfType and returns true', () => {
        expect(abiItemModel.isOfType('function')).toEqual(true);
    });
});
