var assert = require('assert');
const ganache = require('ganache-cli');
const pify = require('pify');
var utils = require('./helpers/test.utils');
var Web3 = utils.getWeb3();

describe('WebsocketProvider', function () {
    let web3;
    let server;
    const port = 8545;
    const host = 'ws://localhost:';

    afterEach(async function () {
        // Might already be closed..
        try {
            await pify(server.close)();
        } catch (err) {
        }
    });

    // This test's error is fired by the request queue checker in the onClose handler
    it('errors when there is no connection', async function(){
        web3 = new Web3(host + 8777);

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
        web3 = new Web3(host + 8777);

        try { await web3.eth.getBlockNumber() } catch (err) {

            try {
                await web3.eth.getBlockNumber();
                assert.fail();
            } catch (err){
                assert(err.message.includes('connection not open'));
            }
        }
    });

    it('errors after client has disconnected', async function(){
        server = ganache.server({port: port});
        await pify(server.listen)(port);

        web3 = new Web3(new Web3.providers.WebsocketProvider(host + port));

        // Verify connection and disconnect
        await web3.eth.getBlockNumber();
        web3.currentProvider.disconnect();

        try {
            await web3.eth.getBlockNumber();
            assert.fail();
        } catch(err){
            assert(err.message.includes('connection not open on send'));
        }
    });

    it('can connect after being disconnected', async function(){
        server = ganache.server({port: port});
        await pify(server.listen)(port);

        web3 = new Web3(new Web3.providers.WebsocketProvider(host + port));

        // Verify connection and disconnect
        await web3.eth.getBlockNumber();
        web3.currentProvider.disconnect();

        try { await web3.eth.getBlockNumber() } catch(e){}

        web3.currentProvider.connect();
        const blockNumber = await web3.eth.getBlockNumber();
        assert(blockNumber === 0);
    });

    it('supports subscriptions', async function(){
        assert(web3.eth.currentProvider.supportsSubscriptions());
    });
});

