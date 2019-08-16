import Address from '../../../src/types/Address';

/**
 * Address test
 */
describe('AddressTest', () => {
    let mockAddress = '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B';

    it('calls the constructor and returns the expected Address object', () => {
        const address = new Address(mockAddress);

        expect(address.toString()).toEqual('0x6d6dc708643a2782be27191e2abcae7e1b0ca38b');
    });

    it('calls the constructor with a Iban address and returns the expected Address object', () => {
        const address = new Address('XE1222Q908LN1QBBU6XUQSO1OHWJIOS46OO');

        expect(address.toString()).toEqual('0x11c5496aee77c1ba1f0854206a26dda82a81d6d8');
    });

    it('calls the constructor and throws a error', () => {
        try {
            new Address('asdf');
        } catch (error) {
            expect(error).toEqual(
                new Error(
                    'Provided address "asdf" is invalid, the capitalization checksum test failed, or its an indirect IBAN address which can\'t be converted.'
                )
            );
        }
    });

    it('calls toString and returns the expected value', () => {
        const address = new Address(mockAddress);

        expect(address.toString()).toEqual('0x6d6dc708643a2782be27191e2abcae7e1b0ca38b');
    });

    it('calls toChecksum with a upper case prefix returns the expected value', () => {
        expect(Address.toChecksum('0X6d6dC708643A2782bE27191E2ABCae7E1B0cA38B')).toEqual(
            '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B'
        );
    });

    it('calls toChecksum with chainId 30 and returns the expected values', () => {
        const tests = [
            {value: '0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed', is: '0x5aaEB6053f3e94c9b9a09f33669435E7ef1bEAeD'},
            {value: '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359', is: '0xFb6916095cA1Df60bb79ce92cE3EA74c37c5d359'},
            {value: '0xdbf03b407c01e7cd3cbea99509d93f8dddc8c6fb', is: '0xDBF03B407c01E7CD3cBea99509D93F8Dddc8C6FB'},
            {value: '0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb', is: '0xD1220A0Cf47c7B9BE7a2e6ba89F429762E7B9adB'}
        ];

        tests.forEach((test) => {
            expect(Address.toChecksum(test.value, 30)).toEqual(test.is);
        });
    });

    it('calls toChecksum and returns the expected values', () => {
        const tests = [
            {value: '0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed', is: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'},
            {value: '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359', is: '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359'},
            {value: '0xdbf03b407c01e7cd3cbea99509d93f8dddc8c6fb', is: '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB'},
            {value: '0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb', is: '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb'}
        ];

        tests.forEach((test) => {
            expect(Address.toChecksum(test.value)).toEqual(test.is);
        });
    });

    it('calls toChecksum and throws an error empty string', () => {
        try {
            Address.toChecksum('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B00');
        } catch (error) {
            expect(error).toEqual(
                new Error(
                    'Provided address "0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B00" is invalid, the capitalization checksum test failed, or its an indirect IBAN address which can\'t be converted.'
                )
            );
        }
    });

    it('calls isValidChecksum and returns true', () => {
        expect(Address.isValidChecksum('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B')).toEqual(true);
    });

    it('calls isValidChecksum with a chainId and returns true', () => {
        expect(Address.isValidChecksum('0x5aaEB6053f3e94c9b9a09f33669435E7ef1bEAeD', 30)).toEqual(true);
    });

    it('calls isValidChecksum and returns false', () => {
        expect(Address.isValidChecksum('0x6d6dc708643a2782be27191e2abcae7e1b0ca38b')).toEqual(false);
    });

    it('calls isValid and returns the expected results', () => {
        const tests = [
            {
                value: () => {},
                is: false
            },
            /* eslint-disable no-new-func */
            {value: new Function(), is: false},
            /* eslint-enable */
            {value: 'function', is: false},
            {value: {}, is: false},
            {value: '0xc6d9d2cd449a754c494264e1809c50e34d64562b', is: true},
            {value: 'c6d9d2cd449a754c494264e1809c50e34d64562b', is: true},
            {value: '0xE247A45c287191d435A8a5D72A7C8dc030451E9F', is: true},
            {value: '0xE247a45c287191d435A8a5D72A7C8dc030451E9F', is: false},
            {value: '0xe247a45c287191d435a8a5d72a7c8dc030451e9f', is: true},
            {value: '0xE247A45C287191D435A8A5D72A7C8DC030451E9F', is: true},
            {value: '0XE247A45C287191D435A8A5D72A7C8DC030451E9F', is: true}
        ];

        tests.forEach((test) => {
            expect(Address.isValid(test.value)).toEqual(test.is);
        });
    });

    it('calls isValid with chainId 30 and returns the expected results', () => {
        const tests = [
            {value: '0x5aaEB6053f3e94c9b9a09f33669435E7ef1bEAeD', is: true},
            {value: '0xFb6916095cA1Df60bb79ce92cE3EA74c37c5d359', is: true},
            {value: '0xDBF03B407c01E7CD3cBea99509D93F8Dddc8C6FB', is: true},
            {value: '0xE247a45c287191d435A8a5D72A7C8dc030451E9F', is: false},
            {value: '0xD1220A0Cf47c7B9BE7a2e6ba89F429762E7B9adB', is: true},
            {value: '0xe247a45c287191d435a8a5d72a7c8dc030451e9f', is: true},
            {value: '0xE247A45C287191D435A8A5D72A7C8DC030451E9F', is: true}
        ];

        tests.forEach((test) => {
            expect(Address.isValid(test.value, 30)).toEqual(test.is);
        });
    });

    it('calls isValid with all chars upper case and returns true', () => {
        expect(Address.isValid(String('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B').toUpperCase())).toEqual(true);
    });

    it('calls isValid with all chars lower case and returns true', () => {
        expect(Address.isValid(String('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B').toLowerCase())).toEqual(true);
    });

    it('calls isValid and returns false', () => {
        expect(Address.isValid('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B00')).toEqual(false);
    });
});
