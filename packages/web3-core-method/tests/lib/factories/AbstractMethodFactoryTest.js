import AbstractMethodFactory from '../../../lib/factories/AbstractMethodFactory';
import MethodModuleFactory from '../../../src/factories/ModuleFactory';
import AbstractCallMethod from '../../../lib/methods/AbstractCallMethod';
import AbstractSendMethod from '../../../lib/methods/AbstractSendMethod';
import SendTransactionMethod from '../../../src/methods/transaction/SendTransactionMethod';
import SignMethod from '../../../src/methods/SignMethod';

// Mocks
jest.mock('../../../src/factories/ModuleFactory');

/**
 * AbstractMethodFactory test
 */
describe('AbstractMethodFactoryTest', () => {
    let abstractMethodFactory, methodModuleFactoryMock;

    beforeEach(() => {
        new MethodModuleFactory({});
        methodModuleFactoryMock = MethodModuleFactory.mock.instances[0];

        abstractMethodFactory = new AbstractMethodFactory(methodModuleFactoryMock, {}, {});

        abstractMethodFactory.methods = {
            call: AbstractCallMethod,
            send: AbstractSendMethod
        };
    });

    it('calls hasMethod and returns true', () => {
        abstractMethodFactory = new AbstractMethodFactory({}, {}, {});
        abstractMethodFactory.methods = {call: true};

        expect(abstractMethodFactory.hasMethod('call')).toEqual(true);
    });

    it('calls hasMethod and returns false', () => {
        abstractMethodFactory = new AbstractMethodFactory({}, {}, {});
        abstractMethodFactory.methods = {};

        expect(abstractMethodFactory.hasMethod('call')).toEqual(false);
    });

    it('calls createMethod and returns AbstractCallMethod', () => {
        expect(abstractMethodFactory.hasMethod('call')).toEqual(true);

        expect(abstractMethodFactory.createMethod('call')).toBeInstanceOf(AbstractCallMethod);
    });

    it('calls createMethod and returns AbstractSendMethod', () => {
        expect(abstractMethodFactory.hasMethod('send')).toEqual(true);

        expect(abstractMethodFactory.createMethod('send')).toBeInstanceOf(AbstractSendMethod);

        expect(methodModuleFactoryMock.createTransactionConfirmationWorkflow).toHaveBeenCalled();
    });

    it('calls createMethod and returns SendTransactionMethod', () => {
        abstractMethodFactory = new AbstractMethodFactory(methodModuleFactoryMock, {}, {});
        abstractMethodFactory.methods = {
            sendTransaction: SendTransactionMethod
        };

        expect(abstractMethodFactory.hasMethod('sendTransaction')).toEqual(true);

        expect(abstractMethodFactory.createMethod('sendTransaction')).toBeInstanceOf(SendTransactionMethod);

        expect(methodModuleFactoryMock.createTransactionConfirmationWorkflow).toHaveBeenCalled();
        expect(methodModuleFactoryMock.createTransactionSigner).toHaveBeenCalled();
        expect(methodModuleFactoryMock.createSendRawTransactionMethod).toHaveBeenCalled();
    });

    it('calls createMethod and returns SignMethod', () => {
        abstractMethodFactory = new AbstractMethodFactory(methodModuleFactoryMock, {}, {});
        abstractMethodFactory.methods = {
            sign: SignMethod
        };

        expect(abstractMethodFactory.hasMethod('sign')).toEqual(true);

        expect(abstractMethodFactory.createMethod('sign')).toBeInstanceOf(SignMethod);

        expect(methodModuleFactoryMock.createMessageSigner).toHaveBeenCalled();
    });
});
