import { assert } from 'chai';
import utils from '../packages/web3-utils';

describe('lib/utils/utils', () => {
    describe('hexToNumberString', () => {
        it('should return the correct value', () => {
            assert.equal(utils.hexToNumberString('0x3e8'), '1000');
            assert.equal(utils.hexToNumberString('0x1f0fe294a36'), '2134567897654');
            // allow compatiblity
            assert.equal(utils.hexToNumberString(100000), '100000');
            assert.equal(utils.hexToNumberString('100000'), '100000');
        });
    });
});
