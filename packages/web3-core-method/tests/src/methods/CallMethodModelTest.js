import {formatters} from 'packages/web3-core-helpers/dist/web3-core-helpers.cjs';
import CallMethodModel from '../../../src/models/methods/CallMethodModel';

// Mocks
jest.mock('formatters');

/**
 * CallMethodModel test
 */
describe('CallMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new CallMethodModel({}, formatters);
    });

    it('rpcMethod should return eth_call', () => {
        expect(model.rpcMethod)
            .toBe('eth_call');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount)
            .toBe(2);
    });

    it('beforeExecution should call inputCallFormatter and inputDefaultBlockNumberFormatter', () => {
        model.parameters = [{}, 100];

        formatters.inputCallFormatter
            .mockReturnValueOnce({empty: true});

        formatters.inputDefaultBlockNumberFormatter
            .mockReturnValueOnce({empty: true});

        model.beforeExecution({});

        expect(model.parameters[0])
            .toHaveProperty('empty', true);

        expect(model.parameters[1])
            .toEqual({empty: true});

        expect(formatters.inputDefaultBlockNumberFormatter)
            .toHaveBeenCalledWith(100, {});

        expect(formatters.inputCallFormatter)
            .toHaveBeenCalledWith({}, {});
    });

    it('afterExecution should just return the response', () => {
        const object = {};

        expect(model.afterExecution(object))
            .toBe(object);
    });
});
