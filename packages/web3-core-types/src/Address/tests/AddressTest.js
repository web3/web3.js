import {cloneDeep} from 'lodash';
import Address from '../Address';
import sha3 from '../../sha3';

jest.mock('../../sha3');
/**
 * Address test
 */
describe('AddressTest', () => {
    let address;
    const error = {
        address: "The address needs to be hex encoded, supplied as a string.",
        isChecksummed: "The parameter 'isChecksum' needs to be true or false.\ntrue means the supplied address is checksummed. false means the address may or may not be checksummed.",
    };

    const initParams = {
        address: undefined,
        isChecksummed: undefined
    };

    const data = {
        address: '0x0E5165F9D5B56cfD5E33e6BA9AB6f114382AF9C4',
        isChecksummed: false
    }
    
    beforeEach(() => {
        sha3.mockImplementation(() => {
          return '0x8f1328e5affc41692dba18acbd8d209af83db094e4d84c32325130350929562e'
        });
        
        address = new Address(
            data,
            error,
            initParams
        );
    });

    it('constructor check', () => {
        expect(address).toHaveProperty('error');
        expect(address).toHaveProperty('params');
    });
    
    it('checksums the address', () => {
        const isChecksummed = address.toChecksumAddress();
        expect(isChecksummed.isValidChecksum()).toEqual(true);
    });
});














