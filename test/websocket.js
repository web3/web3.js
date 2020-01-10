var assert = require('assert');
var utils = require('./helpers/test.utils');
var Web3 = utils.getWeb3();

describe('Websockets', function () {
    let web3;

    beforeEach(function(){
        web3 = new Web3('ws://localhost:' + 8777);
    });

    // This test's error is fired by the request queue checker in the onClose handler
    it('errors when there is no connection', async function(){
        try {
            await web3.eth.getBlockNumber();
            assert.fail();
        } catch (err) {
            console.log('error --> ' + err);
            assert(err.message.includes('connection not open'));
        }
    });

    // This test's error is fired by the readyState check in .send
    it('errors when requests continue after socket closed', async function(){
        try { await web3.eth.getBlockNumber() } catch (err) {

            try {
                await web3.eth.getBlockNumber();
                assert.fail();
            } catch (err){
                assert(err.message.includes('connection not open'));
            }
        }
    });

    it('supports subscriptions', async function(){
        assert(web3.eth.currentProvider.supportsSubscriptions());
    });
});

