import * as Types from './src';
import Address from '.src//Address/Address';
import Iban from './src/Address/Iban'; // eslint-disable-line no-unused-vars

// Mocks
jest.mock('../Address/Address');
jest.mock('../Address/Iban');

/**
 * Type Module Address test
 */
describe('TypeModuleAddressTest', () => {
    beforeEach(() => {});

    it('Interface - Address', () => {
        const tests = [
            {value: '0x4F38f4229924bfa28D58eeda496Cc85e8016bCCC', method: Types.Address.isValid},
            {value: '0x4f38f4229924bfa28d58eeda496cc85e8016bccc', method: Types.Address.toChecksum},
            {value: '0000000000000000000000000000000000', method: Types.Address.fromIban}
        ];

        tests.forEach((test) => {
            const obj = test.method(test.value); // eslint-disable-line new-cap, no-unused-vars

            // All Address interface calls go through isValid
            expect(Address.isValid).toHaveBeenCalled();
        });
    });

    it('Mixin - Address', () => {
        Types.Address.isValid('0x4f38f4229924bfa28d58eeda496cc85e8016bccc');
        Types.Address.toChecksum('0x4f38f4229924bfa28d58eeda496cc85e8016bccc');

        expect(Address.isValid).toHaveBeenCalled();
        expect(Address).toHaveBeenCalled();
    });
});
