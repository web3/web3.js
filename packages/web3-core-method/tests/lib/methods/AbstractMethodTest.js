import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../lib/methods/AbstractMethod';
import CallMethodCommand from '../../../src/commands/CallMethodCommand';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('../../../src/commands/CallMethodCommand');

/**
 * AbsractMethod test
 */
describe('AbsractMethodTest', () => {
    let abstractMethod, command, commandMock;

    beforeEach(() => {
        command = new CallMethodCommand({}, {});
        commandMock = CallMethodCommand.mock.instances[0];
        abstractMethod = new AbstractMethod('RPC_TEST', 0, commandMock, Utils, formatters);
    });

    it('constructor check', () => {
        expect(AbstractMethod.CommandType)
            .toBe('CALL');

        expect(abstractMethod.rpcMethod)
            .toBe('RPC_TEST');

        expect(abstractMethod.parametersAmount)
            .toBe(0);

        expect(abstractMethod.command)
            .toEqual(commandMock);

        expect(abstractMethod.utils)
            .toEqual(Utils);

        expect(abstractMethod.formatters)
            .toEqual(formatters);

        expect(abstractMethod.parameters)
            .toBe(undefined);

        expect(abstractMethod.callback)
            .toBe(undefined);
    });

    it('set arguments throws error on missing arguments', () => {
        abstractMethod.parametersAmount = 3;

        try {
            abstractMethod.arguments = [];
        } catch(error) {
            expect(error)
                .toBeInstanceOf(Error);
        }
    });

    it('set arguments throws error if callback is not of type Function', () => {
        abstractMethod.parametersAmount = 1;

        try {
            abstractMethod.arguments = [true, true];
        } catch(error) {
            expect(error)
                .toBeInstanceOf(Error);
        }
    });

    it('set arguments without callback', () => {
        abstractMethod.parametersAmount = 1;
        abstractMethod.arguments = [true];

        expect(abstractMethod.parameters)
            .toEqual([true]);

        expect(abstractMethod.callback)
            .toBe(null);
    });

    it('set arguments with callback', () => {
        abstractMethod.parametersAmount = 1;
        abstractMethod.arguments = [true, () => {}];

        expect(abstractMethod.parameters)
            .toEqual([true]);


        expect(abstractMethod.callback)
            .toBeInstanceOf(Function);
    });

    it('get arguments', () => {
        abstractMethod.parametersAmount = 1;
        abstractMethod.arguments = [true];

        expect(abstractMethod.arguments)
            .toEqual({callback: null, parameters: [true]});

    });

    it('set rpcMethod', () => {
        abstractMethod.rpcMethod = 'test';

        expect(abstractMethod.rpcMethod)
            .toBe('test');
    });

    it('set parameters', () => {
        abstractMethod.parameters = ['test'];

        expect(abstractMethod.parameters)
            .toEqual(['test']);
    });

    it('set callback', () => {
        abstractMethod.callback = () => {};

        expect(abstractMethod.callback)
            .toBeInstanceOf(Function);
    });

    it('execution of request returns AbstractMethod with parameters set', () => {
        abstractMethod.parametersAmount = 1;
        abstractMethod.arguments = [true];
        const request = abstractMethod.request(true);

        expect(request)
            .toBeInstanceOf(AbstractMethod);

        expect(request.parameters[0])
            .toBeTruthy();
    });

    it('run execute method', () => {
        commandMock.execute
            .mockReturnValueOnce('0x0');

        abstractMethod = new AbstractMethod('RPC_TEST', 0, commandMock, Utils, formatters);

        expect(abstractMethod.execute({}))
            .toBe('0x0');

        expect(commandMock.execute)
            .toHaveBeenCalledWith({}, abstractMethod);
    });
});
