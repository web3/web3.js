import u from './helpers/test.utils.js';
import utils from '../packages/web3-utils';

describe('utils', () => {
    describe('methods', () => {
        u.methodExists(utils, 'sha3');
        u.methodExists(utils, 'hexToAscii');
        u.methodExists(utils, 'asciiToHex');
        u.methodExists(utils, 'hexToNumberString');
        u.methodExists(utils, 'numberToHex');
        u.methodExists(utils, 'fromWei');
        u.methodExists(utils, 'toWei');
        u.methodExists(utils, 'toBN');
        u.methodExists(utils, 'isAddress');
    });
});
