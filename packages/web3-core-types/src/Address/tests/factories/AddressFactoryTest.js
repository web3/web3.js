import AddressFactory from '../../factories/AddressFactory';
import Address from '../../Address';

// Mocks
jest.mock('../../Address');

/**
 * AddressFactory test
 */
describe('AddressFactoryTest', () => {
    let addressFactory;
    const data = {
        address: '0x564286362092D8e7936f0549571a803B203aAceD',
        isChecksummed: true
    };

    beforeEach(() => {
        addressFactory = new AddressFactory();
    });

    it('calls createAddress and returns Address object', () => {
        expect(addressFactory.createAddress(data)).toBeInstanceOf(Address);
    });
});
