import Ens from '../../../src/Ens';
import Registry from '../../../src/contracts/Registry';
import EnsModuleFactory from '../../../src/factories/EnsModuleFactory';

// Mocks
jest.mock('../../../src/Ens');
jest.mock('../../../src/contracts/Registry');

/**
 * EnsModuleFactory test
 */
describe('EnsModuleFactoryTest', () => {
    let ensModuleFactory;

    beforeEach(() => {
        ensModuleFactory = new EnsModuleFactory();
    });

    it('call createEns and returns the Ens object', () => {
        expect(ensModuleFactory.createENS({}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {})).toBeInstanceOf(Ens);
    });

    it('call createRegistry and returns the Ens object', () => {
        expect(ensModuleFactory.createRegistry({}, {}, {}, {}, {}, {}, {}, {}, {}, {})).toBeInstanceOf(Registry);
    });
});
