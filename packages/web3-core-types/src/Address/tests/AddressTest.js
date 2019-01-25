import Address from '../Address';

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

    it('parses to string', () => {
        const tests = [
            {value: '0xeaefacdf4402d8d6acf5a6c6249b9d4ba744c812'},
            {value: '0x8b3ad493c077e894a034db7eb53e8285560298fd'},
            {value: '0xa3bd1917f7183fff456829b258057fbb79460139'},
            {value: '0x3fB0cBc24938dDF41B0BAa65A251db01a06ecf84'}
        ];

        tests.forEach((test) => {
            expect(new Address(test.value, error, initParams).toString()).toEqual(test.value);
        });
    });

    it('checksums the address object', () => {
        const tests = [
            {value: '0xeaefacdf4402d8d6acf5a6c6249b9d4ba744c812', is: '0xEaEFaCdf4402d8D6ACF5a6c6249B9D4BA744C812'},
            {value: '0x8b3ad493c077e894a034db7eb53e8285560298fd', is: '0x8b3AD493C077e894A034DB7Eb53e8285560298fd'},
            {value: '0xa3bd1917f7183fff456829b258057fbb79460139', is: '0xa3Bd1917f7183FFF456829B258057FBB79460139'},
            {value: '0x3fB0cBc24938dDF41B0BAa65A251db01a06ecf84', is: '0x3fB0cBc24938dDF41B0BAa65A251db01a06eCf84'}
        ];

        tests.forEach((test) => {
            expect(new Address(test.value, error, initParams).toChecksum().toString()).toEqual(test.is);
        });
    });

    it('checks the checksum of an address string', () => {
        const tests = [
            {value: '0xeaefacdf4402d8d6acf5a6c6249b9d4ba744c812', is: false},
            {value: '0x8b3ad493c077e894a034db7eb53e8285560298fd', is: false},
            {value: '0xa3bd1917f7183fff456829b258057fbb79460139', is: false},
            {value: '0x3fB0cBc24938dDF41B0BAa65A251db01a06ecf84', is: false},
            {value: '0x4F38f4229924bfa28D58eeda496Cc85e8016bCCC', is: true}
        ];

        tests.forEach((test) => {
            expect(Address.isValid(test.value)).toEqual(test.is);
        });
    });
});
