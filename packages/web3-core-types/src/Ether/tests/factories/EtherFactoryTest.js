import EtherFactory from '../../factories/EtherFactory';
import Ether from '../../Ether';

// Mocks
jest.mock('../../Ether');

/**
 * EtherFactory test
 */
describe('EtherFactoryTest', () => {
    let etherFactory;
    const data = {
        amount: '1',
        unit: 'wei'
    };

    beforeEach(() => {
        etherFactory = new EtherFactory();
    });

    it('calls createEther and returns Ether object', () => {
        expect(etherFactory.createEther(data)).toBeInstanceOf(Ether);
    });
});
