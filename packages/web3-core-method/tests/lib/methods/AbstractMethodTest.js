import * as Utils from 'packages/web3-utils/dist/web3-utils.cjs';
import {formatters} from 'packages/web3-core-helpers/dist/web3-core-helpers.cjs';
import AbstractMethodModel from '../../lib/models/AbstractMethodModel';

// Mocks
jest.mock('Utils');
jest.mock('formatters');

/**
 * AbsractMethodModel test
 */
describe('AbsractMethodModelTest', () => {
    let abstractMethodModel;

    beforeEach(() => {
        abstractMethodModel = new AbstractMethodModel('RPC_TEST', 0, Utils, formatters);
    });

    it('constructor check', () => {
        expect(abstractMethodModel.rpcMethod)
            .toBe('RPC_TEST');

        expect(abstractMethodModel.parametersAmount)
            .toBe(0);

        expect(abstractMethodModel.utils)
            .toEqual(Utils);

        expect(abstractMethodModel.formatters)
            .toEqual(formatters);

        expect(abstractMethodModel.parameters)
            .toBe(undefined);

        expect(abstractMethodModel.callback)
            .toBe(undefined);
    });

    it('set methodArguments throws error on missing arguments', () => {
        abstractMethodModel.parametersAmount = 3;

        try {
            abstractMethodModel.methodArguments = [];
        } catch(error) {
            expect(error)
                .toBeInstanceOf(Error);
        }
    });

    it('set methodArguments throws error if callback is not of type Function', () => {
        abstractMethodModel.parametersAmount = 1;

        try {
            abstractMethodModel.methodArguments = [true, true];
        } catch(error) {
            expect(error)
                .toBeInstanceOf(Error);
        }
    });

    it('set methodsArguments without callback', () => {
        abstractMethodModel.parametersAmount = 1;
        abstractMethodModel.methodArguments = [true];

        expect(abstractMethodModel.parameters)
            .toEqual([true]);

        expect(abstractMethodModel.callback)
            .toBe(null);
    });

    it('set methodsArguments with callback', () => {
        abstractMethodModel.parametersAmount = 1;
        abstractMethodModel.methodArguments = [true, () => {}];

        expect(abstractMethodModel.parameters)
            .toEqual([true]);

        console.log(abstractMethodModel.callback);

        expect(abstractMethodModel.callback)
            .toBeInstanceOf(Function);
    });

    it('get methodArguments', () => {
        abstractMethodModel.parametersAmount = 1;
        abstractMethodModel.methodArguments = [true];

        expect(abstractMethodModel.methodArguments)
            .toEqual({callback: null, parameters: [true]});

    });

    it('execution of request returns AbstractMethodModel with parameters set', () => {
        abstractMethodModel.parametersAmount = 1;
        abstractMethodModel.methodArguments = [true];
        const request = abstractMethodModel.request(true);

        expect(request)
            .toBeInstanceOf(AbstractMethodModel);

        expect(request.parameters)
            .toEqual([true]);
    });

    it('execution of isSign returns true', () => {
        abstractMethodModel.rpcMethod = 'eth_sign';

        expect(abstractMethodModel.isSign())
            .toBeTruthy();
    });

    it('execution of isSendTransaction returns true', () => {
        abstractMethodModel.rpcMethod = 'eth_sendTransaction';

        expect(abstractMethodModel.isSendTransaction())
            .toBeTruthy();
    });

    it('execution of isSendRawTransaction returns true', () => {
        abstractMethodModel.rpcMethod = 'eth_sendRawTransaction';

        expect(abstractMethodModel.isSendRawTransaction())
            .toBeTruthy();
    });
});
