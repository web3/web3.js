import {AbstractWeb3Module} from 'web3-core';
import AbstractMethodFactory from '../../../lib/factories/AbstractMethodFactory';
import AbstractMethod from '../../../lib/methods/AbstractMethod';
import MethodProxy from '../../../src/proxy/MethodProxy';

// Mocks
jest.mock('AbstractWeb3Module');
jest.mock('../../../lib/factories/AbstractMethodFactory');
jest.mock('../../../lib/methods/AbstractMethod');

/**
 * MethodProxy test
 */
describe('MethodProxyTest', () => {
    let methodProxy, moduleInstanceMock, methodFactoryMock, methodMock;

    beforeEach(() => {
        new AbstractMethodFactory({}, {});
        methodFactoryMock = AbstractMethodFactory.mock.instances[0];

        new AbstractWeb3Module();
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        new AbstractMethod('TEST', 0, {}, {}, {});
        methodMock = AbstractMethod.mock.instances[0];
    });

    it('returns a property from the target object', () => {
        moduleInstanceMock.defaultGasPrice = 100;

        methodFactoryMock.hasMethod.mockReturnValueOnce(false);

        methodProxy = new MethodProxy(moduleInstanceMock, methodFactoryMock);

        expect(methodProxy.defaultGasPrice).toEqual(100);

        expect(methodFactoryMock.hasMethod).toHaveBeenCalledWith('defaultGasPrice');
    });

    it('throws an error because the property is defined on the target and as method', () => {
        moduleInstanceMock.myMethod = 100;

        methodFactoryMock.hasMethod.mockReturnValueOnce(true);

        methodProxy = new MethodProxy(moduleInstanceMock, methodFactoryMock);

        try {
            /* eslint-disable no-unused-vars */
            const test = methodProxy.myMethod;
            /* eslint-enable no-unused-vars */
        } catch (error) {
            expect(methodFactoryMock.hasMethod).toHaveBeenCalledWith('myMethod');

            expect(error.message).toEqual('Duplicated method myMethod. This method is defined as RPC call and as Object method.');
        }
    });

    it('executes the myMethod and it returns the expected value', () => {
        methodMock.parameters = [];
        methodMock.parametersAmount = 0;

        methodMock.execute.mockReturnValueOnce(100);

        methodFactoryMock.hasMethod.mockReturnValue(true);

        methodFactoryMock.createMethod.mockReturnValue(methodMock);

        methodProxy = new MethodProxy(moduleInstanceMock, methodFactoryMock);

        const response = methodProxy.myMethod();

        expect(methodProxy.myMethod.request()).toEqual(methodMock);
        
        expect(methodProxy.myMethod.method).toEqual(methodMock);

        expect(response).toEqual(100);

        expect(methodFactoryMock.hasMethod).toHaveBeenCalledWith('myMethod');

        expect(methodFactoryMock.createMethod).toHaveBeenCalledWith('myMethod', moduleInstanceMock);

        expect(methodMock.execute).toHaveBeenCalled();
    });

    it('throws an error because of an invalid parameter length', () => {
        methodMock.parameters = [];
        methodMock.parametersAmount = 2;

        methodMock.execute.mockReturnValueOnce(100);

        methodFactoryMock.hasMethod.mockReturnValueOnce(true);

        methodFactoryMock.createMethod.mockReturnValueOnce(methodMock);

        methodProxy = new MethodProxy(moduleInstanceMock, methodFactoryMock);

        try {
            methodProxy.myMethod();
        } catch (error) {
            expect(methodFactoryMock.hasMethod).toHaveBeenCalledWith('myMethod');

            expect(methodFactoryMock.createMethod).toHaveBeenCalledWith('myMethod', moduleInstanceMock);

            expect(error.message).toEqual('Invalid parameters length the expected length would be 2 and not 0');
        }
    });
});
