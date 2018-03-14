const chai = require('chai');
const assert = chai.assert;
const Web3 = require('../index');

describe('lib/web3#constructor', () => {
    it('should use ETHEREUM_SOCKET environment variable', () => {
        const existingProvider = process.env.ETHEREUM_SOCKET;
        const testProvider = 'ws://localhost:1337';
        process.env.ETHEREUM_SOCKET = testProvider;
        const web3 = new Web3();
        assert.strictEqual(web3.currentProvider, testProvider);
        process.env.ETHEREUM_SOCKET = existingProvider;
    });
});
