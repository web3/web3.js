import Address from '../Address';
import sha3 from '../../sha3';

/**
 * Address test
 */
describe('AddressTest', () => {
    let address;
    const error = {
        address:
            'The address needs to be hex encoded, supplied as a string.\n Addresses may be prefixed with 0x and are 40 hex characters long.',
        isChecksummed:
            "The parameter 'isChecksummed' needs to be true or false.\ntrue means the supplied address is checksummed, and will throw if it isn't.\nfalse means the address may or may not be checksummed."
    };

    const initParams = {
        address: undefined,
        isChecksummed: undefined
    };

    const data = {
        address: '0xE247A45c287191d435A8a5D72A7C8dc030451E9F',
        isChecksummed: false
    };

    beforeEach(() => {
        address = new Address(data, error, initParams);
    });

    it('constructor check', () => {
        expect(address).toHaveProperty('error');
        expect(address).toHaveProperty('props');
    });

    it('checksums the address', () => {
        expect(address.toChecksum().isValid()).toEqual(true);
    });

    it('checks the checksum of an address string', () => {
        expect(Address.isValid(data.address)).toEqual(false);
    });
});
