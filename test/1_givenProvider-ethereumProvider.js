import { assert } from 'chai';

global.ethereumProvider = { bzz: 'http://givenProvider:8500' };

describe('Web3.providers.givenProvider', () => {
    describe('should be set if ethereumProvider is available ', () => {
        it('when instantiating Web3', () => {
            // eslint-disable-next-line global-require
            const Web3 = require('../packages/web3');
            assert.deepEqual(Web3.givenProvider, global.ethereumProvider);
        });

        it('when instantiating Eth', () => {
            // eslint-disable-next-line global-require
            const Eth = require('../packages/web3-eth');
            assert.deepEqual(Eth.givenProvider, global.ethereumProvider);
        });

        it('when instantiating Bzz', () => {
            // eslint-disable-next-line global-require
            const Bzz = require('../packages/web3-bzz');
            assert.deepEqual(Bzz.givenProvider, global.ethereumProvider.bzz);
        });
    });
});
