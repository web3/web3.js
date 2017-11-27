import u from './helpers/test.utils.js';
import Personal from '../packages/web3-eth-personal';

const personal = new Personal();

describe('web3.net', () => {
    describe('methods', () => {
        u.methodExists(personal, 'getAccounts');
        u.methodExists(personal, 'newAccount');
        u.methodExists(personal, 'unlockAccount');
        u.methodExists(personal, 'lockAccount');
        u.methodExists(personal, 'sendTransaction');

        u.propertyExists(personal, 'net');
        u.methodExists(personal.net, 'getId');
        u.methodExists(personal.net, 'isListening');
        u.methodExists(personal.net, 'getPeerCount');
    });
});
