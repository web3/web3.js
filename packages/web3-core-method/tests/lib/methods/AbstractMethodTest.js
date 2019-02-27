import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../lib/methods/AbstractMethod';

// Mocks
jest.mock('Utils');
jest.mock('formatters');

/**
 * AbstractMethod test
 */
describe('AbstractMethodTest', () => {
    let abstractMethod;

    beforeEach(() => {
        abstractMethod = new AbstractMethod('RPC_TEST', 0, Utils, formatters);
    });

    it('constructor check', () => {
        expect(AbstractMethod.Type).toEqual(undefined);

        expect(abstractMethod.rpcMethod).toEqual('RPC_TEST');

        expect(abstractMethod.parametersAmount).toEqual(0);

        expect(abstractMethod.utils).toEqual(Utils);

        expect(abstractMethod.formatters).toEqual(formatters);

        expect(abstractMethod.parameters).toEqual([]);

        expect(abstractMethod.callback).toEqual(undefined);
    });

    it('set arguments throws error on missing arguments', () => {
        abstractMethod.parametersAmount = 3;

        try {
            abstractMethod.arguments = [];
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    it('set arguments throws error if callback is not of type Function', () => {
        abstractMethod.parametersAmount = 1;

        try {
            abstractMethod.arguments = [true, true];
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    it('set arguments without callback', () => {
        abstractMethod.parametersAmount = 1;
        abstractMethod.arguments = [true];

        expect(abstractMethod.parameters).toEqual([true]);

        expect(abstractMethod.callback).toEqual(null);
    });

    it('set arguments with callback', () => {
        abstractMethod.parametersAmount = 1;
        abstractMethod.arguments = [true, () => {}];

        expect(abstractMethod.parameters).toEqual([true]);

        expect(abstractMethod.callback).toBeInstanceOf(Function);
    });

    it('get arguments', () => {
        abstractMethod.parametersAmount = 1;
        abstractMethod.arguments = [true];

        expect(abstractMethod.arguments).toEqual({callback: null, parameters: [true]});
    });

    it('set rpcMethod', () => {
        abstractMethod.rpcMethod = 'test';

        expect(abstractMethod.rpcMethod).toEqual('test');
    });

    it('set parameters', () => {
        abstractMethod.parameters = ['test'];

        expect(abstractMethod.parameters).toEqual(['test']);
    });

    it('set callback', () => {
        abstractMethod.callback = () => {};

        expect(abstractMethod.callback).toBeInstanceOf(Function);
    });

    it('check if execute method exists', () => {
        expect(abstractMethod.execute).toBeInstanceOf(Function);
    });

    it('beforeExecution changes nothing', () => {
        abstractMethod.beforeExecution();

        expect(AbstractMethod.Type).toEqual(undefined);

        expect(abstractMethod.rpcMethod).toEqual('RPC_TEST');

        expect(abstractMethod.parametersAmount).toEqual(0);

        expect(abstractMethod.utils).toEqual(Utils);

        expect(abstractMethod.formatters).toEqual(formatters);

        expect(abstractMethod.parameters).toEqual([]);

        expect(abstractMethod.callback).toEqual(undefined);
    });

    it('afterExecution just returns the value', () => {
        expect(abstractMethod.afterExecution('string')).toEqual('string');
    });

    it('isHash returns true', () => {
        expect(abstractMethod.isHash('0x0')).toBeTruthy();
    });

    it('isHash returns false', () => {
        expect(abstractMethod.isHash(100)).toBeFalsy();
    });
});
