import { assert } from 'chai';

global.web3 = {
    currentProvider: { bzz: 'http://givenProvider:8500' }
};

describe('Web3.providers.givenProvider', () => {
    describe('should be set if web3.currentProvider is available ', () => {
        it('when instantiating Web3', () => {
            // eslint-disable-next-line global-require
            const Web3 = require('../packages/web3');
            assert.deepEqual(Web3.givenProvider, global.web3.currentProvider);
        });

        it('when instantiating Eth', () => {
            // eslint-disable-next-line global-require
            const Eth = require('../packages/web3-eth');
            assert.deepEqual(Eth.givenProvider, global.web3.currentProvider);
        });
    });
});
