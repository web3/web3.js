import AbiModuleFactory from '../../src/factories/AbiModuleFactory';
import AbiCoder from '../../src/AbiCoder';

// Mocks
jest.mock('../../src/AbiCoder');

/**
 * AbiModuleFactory test
 */
describe('AbiModuleFactoryTest', () => {
    let abiModuleFactory;

    beforeEach(() => {
        abiModuleFactory = new AbiModuleFactory();
    });

    it('calls createAbiCoder and returns AbiCoder object', () => {
        expect(abiModuleFactory.createAbiCoder()).toBeInstanceOf(AbiCoder);
    });
});
