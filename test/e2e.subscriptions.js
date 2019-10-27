var assert = require('assert');
var Basic = require('./sources/Basic');
var utils = require('./helpers/test.utils');
var Web3 = utils.getWeb3();

describe('subscriptions [ @E2E ]', function() {
    var web3;
    var accounts;

    describe('supportsSubscriptions', function() {
        it('http', function() {
            web3 = new Web3('http://localhost:8545');

            var supports = web3.currentProvider.supportsSubscriptions()
            assert(supports === false);
        });

        it('ws', function() {
            var port = utils.getWebsocketPort();
            web3 = new Web3('ws://localhost:' + port);

            var supports = web3.currentProvider.supportsSubscriptions()
            assert(supports === true);
        });

        // TODO: We need to run inside geth docker container to test ipc
        it.skip('ipc', function(){
        })
    });
});

