import Address from '../Address';

/**
 * Address test
 */
describe('AddressTest', () => {
    const data = {
        address: '0xE247A45c287191d435A8a5D72A7C8dc030451E9F',
        isChecksummed: false
    };

    it('constructor check', () => {
        expect(() => new Address(data)).not.toThrow();
    });

    it('has type property', () => {
        expect(new Address(data).isAddress).toBeTruthy();
    });

    it('parses to string', () => {
        const tests = [
            {value: '0xeaefacdf4402d8d6acf5a6c6249b9d4ba744c812'},
            {value: '0x8b3ad493c077e894a034db7eb53e8285560298fd'},
            {value: '0xa3bd1917f7183fff456829b258057fbb79460139'},
            {value: '0x3fB0cBc24938dDF41B0BAa65A251db01a06ecf84'}
        ];

        tests.forEach((test) => {
            expect(new Address(test.value).toString()).toEqual(test.value);
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
            expect(new Address(test.value).toChecksum().toString()).toEqual(test.is);
            expect(Address.toChecksum(test.value).toString()).toEqual(test.is);
        });
    });

    it('checks the checksum of itself', () => {
        const tests = [
            {value: '0xeaefacdf4402d8d6acf5a6c6249b9d4ba744c812', is: false},
            {value: '0x8b3ad493c077e894a034db7eb53e8285560298fd', is: false},
            {value: '0xa3bd1917f7183fff456829b258057fbb79460139', is: false},
            {value: '0x3fB0cBc24938dDF41B0BAa65A251db01a06ecf84', is: false},
            {value: '0x4F38f4229924bfa28D58eeda496Cc85e8016bCCC', is: true}
        ];

        tests.forEach((test) => {
            expect(new Address({address: test.value, isChecksummed: false}).isValid()).toEqual(test.is);
        });
    });

    it('checks the checksum of an address string', () => {
        const tests = [
            {value: null, is: false},
            {value: 1, is: false},
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

    it('throws an error for prop name and value', () => {
        expect(() => new Address(data)._throw('address', null)).toThrow();
    });
});
