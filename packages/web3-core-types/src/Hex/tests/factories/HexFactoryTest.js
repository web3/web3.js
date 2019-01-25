import HexFactory from '../../factories/HexFactory';
import Hex from '../../Hex';

// Mocks
jest.mock('../../Hex');

/**
 * HexFactory test
 */
describe('HexFactoryTest', () => {
    const hex = {
        hex: '0x0'
    };
    let hexFactory;

    beforeEach(() => {
        hexFactory = new HexFactory();
    });

    it('calls createHex and returns Hex object', () => {
        expect(hexFactory.createHex(hex)).toBeInstanceOf(Hex);
    });
});
