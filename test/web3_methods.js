import u from './helpers/test.utils.js';
import Web3 from '../packages/web3';

const web3 = new Web3();

describe('web3', () => {
    describe('methods', () => {
        u.methodExists(web3, 'setProvider');

        u.propertyExists(web3, 'givenProvider');

        u.propertyExists(web3, 'eth');
        u.propertyExists(web3, 'bzz');
        u.propertyExists(web3, 'shh');

        u.propertyExists(web3, 'utils');
    });
});
