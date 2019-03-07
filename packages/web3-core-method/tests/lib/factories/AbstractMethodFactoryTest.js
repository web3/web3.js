import {AbstractWeb3Module} from 'web3-core';
import AbstractMethod from '../../../lib/methods/AbstractMethod';
import AbstractMethodFactory from '../../../lib/factories/AbstractMethodFactory';


// Mocks
jest.mock('AbstractWeb3Module');
jest.mock('../../../lib/methods/AbstractMethod');

/**
 * AbstractMethodFactory test
 */
describe('AbstractMethodFactoryTest', () => {
    let abstractMethodFactory;

    beforeEach(() => {
        abstractMethodFactory = new AbstractMethodFactory({}, {});

        abstractMethodFactory.methods = {
            send: AbstractMethod
        };
    });

    it('constructor check', () => {
       expect(abstractMethodFactory.utils).toEqual({});

       expect(abstractMethodFactory.formatters).toEqual({});
    });

    it('throws an error on calling the methods property if now methods are defined', () => {
        abstractMethodFactory.methods = null;

        expect(() => {
            const methods = abstractMethodFactory.methods;
        }).toThrow('No methods defined for MethodFactory!')
    });

    it('calls hasMethod and returns true', () => {
        abstractMethodFactory = new AbstractMethodFactory({}, {});
        abstractMethodFactory.methods = {call: true};

        expect(abstractMethodFactory.hasMethod('call')).toEqual(true);
    });

    it('calls hasMethod and returns false', () => {
        abstractMethodFactory = new AbstractMethodFactory({}, {});
        abstractMethodFactory.methods = {};

        expect(abstractMethodFactory.hasMethod('call')).toEqual(false);
    });

    it('calls createMethod and returns AbstractMethod', () => {
        new AbstractWeb3Module();
        const moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        expect(abstractMethodFactory.hasMethod('send')).toEqual(true);

        expect(abstractMethodFactory.createMethod('send', moduleInstanceMock)).toBeInstanceOf(AbstractMethod);

        expect(AbstractMethod).toHaveBeenCalledWith({}, {}, moduleInstanceMock);
    });
});
