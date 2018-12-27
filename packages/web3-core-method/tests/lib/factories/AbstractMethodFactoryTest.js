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
    let abstractMethodFactory,
        methodModuleFactory,
        methodModuleFactoryMock;

    beforeEach(() => {
        methodModuleFactory = new MethodModuleFactory({});
        methodModuleFactoryMock = MethodModuleFactory.mock.instances[0];

        abstractMethodFactory = new AbstractMethodFactory(
            {
                call: AbstractCallMethod,
                send: AbstractSendMethod
            },
            methodModuleFactoryMock,
            {},
            {}
        );
    });

    it('calls hasMethod and returns true', () => {
        abstractMethodFactory = new AbstractMethodFactory({call: true}, {}, {}, {});
        expect(abstractMethodFactory.hasMethod('call'))
            .toBeTruthy();
    });

    it('calls hasMethod and returns false', () => {
        abstractMethodFactory = new AbstractMethodFactory({}, {}, {}, {});

        expect(abstractMethodFactory.hasMethod('call'))
            .toBeFalsy();
    });

    it('calls createMethod and returns AbstractCallMethod', () => {
        expect(abstractMethodFactory.hasMethod('call'))
            .toBeTruthy();

        expect(abstractMethodFactory.createMethod('call'))
            .toBeInstanceOf(AbstractCallMethod);
    });

    it('calls createMethod and returns AbstractSendMethod', () => {
        expect(abstractMethodFactory.hasMethod('send'))
            .toBeTruthy();

        expect(abstractMethodFactory.createMethod('send'))
            .toBeInstanceOf(AbstractSendMethod);
    });

    it('calls createMethod and returns SendTransactionMethod', () => {
        abstractMethodFactory = new AbstractMethodFactory(
            {
                sendTransaction: SendTransactionMethod
            },
            methodModuleFactoryMock,
            {},
            {}
        );

        expect(abstractMethodFactory.hasMethod('sendTransaction'))
            .toBeTruthy();

        expect(abstractMethodFactory.createMethod('sendTransaction'))
            .toBeInstanceOf(SendTransactionMethod);
    });

    it('calls createMethod and returns SignMethod', () => {
        abstractMethodFactory = new AbstractMethodFactory(
            {
                sign: SignMethod
            },
            methodModuleFactoryMock,
            {},
            {}
        );

        expect(abstractMethodFactory.hasMethod('sign'))
            .toBeTruthy();

        expect(abstractMethodFactory.createMethod('sign'))
            .toBeInstanceOf(SignMethod);
    });
});
