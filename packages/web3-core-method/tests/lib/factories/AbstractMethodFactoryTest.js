import AbstractMethodFactory from '../../../lib/factories/AbstractMethodFactory';
import AbstractMethod from '../../../lib/methods/AbstractMethod';
import MethodModuleFactory from '../../../src/factories/ModuleFactory';

// Mocks
jest.mock('../../../lib/methods/AbstractMethod');
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
                test: AbstractMethod
            },
            methodModuleFactoryMock,
            {},
            {}
        );
    });

    it('hasMethod returns true', () => {
        abstractMethodFactory = new AbstractMethodFactory({test: true}, {}, {}, {});
        expect(abstractMethodFactory.hasMethod('test'))
            .toBeTruthy();
    });

    it('hasMethod returns false', () => {
        abstractMethodFactory = new AbstractMethodFactory({}, {}, {}, {});

        expect(abstractMethodFactory.hasMethod('test'))
            .toBeFalsy();
    });

    it('createMethod returns method with call command', () => {
        AbstractMethod.Type = 'CALL';

        abstractMethodFactory = new AbstractMethodFactory(
            {
                test: AbstractMethod
            },
            methodModuleFactoryMock,
            {},
            {}
        );

        expect(abstractMethodFactory.hasMethod('test'))
            .toBeTruthy();

        expect(abstractMethodFactory.createMethod('test'))
            .toBeInstanceOf(AbstractMethod);
    });

    it('createMethod returns method with send command', () => {
        AbstractMethod.Type = 'SEND';

        abstractMethodFactory = new AbstractMethodFactory(
            {
                test: AbstractMethod
            },
            methodModuleFactoryMock,
            {},
            {}
        );

        expect(abstractMethodFactory.hasMethod('test'))
            .toBeTruthy();

        expect(abstractMethodFactory.createMethod('test'))
            .toBeInstanceOf(AbstractMethod);
    });
});
