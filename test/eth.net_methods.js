import u from './helpers/test.utils.js';
import Eth from '../packages/web3-eth';

const eth = new Eth();

describe('web3.net', () => {
    describe('methods', () => {
        u.methodExists(eth.net, 'getId');
        u.methodExists(eth.net, 'getNetworkType');
        u.methodExists(eth.net, 'isListening');
        u.methodExists(eth.net, 'getPeerCount');
    });
});
