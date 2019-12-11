const assert = require('assert');
const utils = require('./helpers/test.utils');
const geth = require('./helpers/test.geth.api');
const Web3 = utils.getWeb3();
const util = require('util')

// NB: there are parallel tests for ganache at `eth.subscribe.ganache` in the main unit tests
describe('subscription connect/reconnect (geth) [ @E2E ]', function() {
    this.timeout(15000);

    // Geth instamine over WS is unreliable
    if (!process.env.GETH_AUTOMINE) return;

    let web3;
    let accounts;

    // Setup a seperate RPC connection for the admin startWS calls
    // Once we close the websocket with the 'test Web3 instance',
    // it cannot be used to make more admin calls.
    before(function(){
        geth.connectHTTP(Web3, 8545);
    });

    beforeEach(async function() {
        web3 = new Web3('ws://localhost:8546');
        accounts = await web3.eth.getAccounts();
    });

    afterEach(async function() {
        await geth.admin.wsStart();
    });

    // Usually passes, unstable when run with other suites.
    // Test closes the connection and is notified of the drop.
    it.skip('(1) admin.close closes the connection (baseline)', async function(){
        try {
            await geth.admin.wsStop(web3);
            assert(fail);
        } catch (err) {
            assert(err.message.includes('CONNECTION ERROR'));
            assert(err.message.includes('1006'));
        }
    });

    // Usually passes, unstable when run with other suites.
    it.skip('(2) eth calls fail after the connection has been dropped (baseline)', async function(){
        await geth.admin.wsStopQuietly(web3)

        try {
            const val = await web3.eth.getBlockNumber();
            assert.fail();
        } catch (err){
            assert(err.message.includes('connection not open on send()'))
        }
    });


    it('(3) subscribes (baseline)', function() {
        return new Promise(async function (resolve) {
            web3.eth
                .subscribe('newBlockHeaders')
                .on('data', function(result) {
                    assert(result.parentHash);
                    this.removeAllListeners();
                    resolve();
                })
        });
    });

    // This test times-out. There *is* a `connection not open on send()` error
    // received in the callback handler in Subscription.subscribe, but it does not bubble up.
    it.skip('(4) errors on subscribing when connection is already closed', async function() {
        await geth.admin.wsStopQuietly(web3)

        return new Promise(async function (resolve) {
            web3.eth
                .subscribe('newBlockHeaders')
                .on('error', function(err) {
                    assert(err.message.includes('CONNECTION ERROR'));
                    this.removeAllListeners(); // Idk about this...
                    resolve();
                });
        });
    });

    // This test usually passes on its own, usually fails in sequence: race-conditiony.
    it.skip('(5) errors when subscr is already running & connection gets closed', function() {
        let stage = 0;
        let interval;

        return new Promise(async function (resolve) {
            web3.eth
                .subscribe('newBlockHeaders')
                .on('data', async function() {
                    stage = 1;
                })
                .on('error', function(err) {
                    assert(err.message.includes('CONNECTION ERROR'));
                    this.removeAllListeners();
                    resolve();
                });

            // StopWS from outside the handler logic,
            interval = setInterval(async function(){
                if (stage === 1){
                    await geth.admin.wsStopQuietly(web3);
                    clearInterval(interval);
                }
            }, 50)

        });
    });

    // This test usually passes on its own, usually fails in sequence: race-conditiony.
    it.skip('(6) auto reconnects and keeps the subscription running', function() {
        const provider = new Web3.providers.WebsocketProvider(
            'ws://localhost:8546',
            {reconnect: {auto: true}}
        )

        web3.setProvider(provider);

        return new Promise(async function (resolve) {
            // Stage 0:
            let stage = 0;

            web3.eth
                .subscribe('newBlockHeaders')
                .on('data', function(result) {
                    assert(result.parentHash);

                    // Exit point, flag set below
                    if (stage === 1) {
                        web3.currentProvider.disconnect();
                        this.removeAllListeners();
                        resolve();
                    }
                });

            // Stage 1: Close & re-open server
            await geth.admin.wsStopQuietly(web3);
            await geth.admin.wsStart();
            stage = 1;
        });
    });

    // This test always times out, even alone.
    it.skip('(7) auto reconnects, keeps subscr. running & triggers `connected` listener twice', function() {
        const provider = new Web3.providers.WebsocketProvider(
            'ws://localhost:8546',
            {reconnect: {auto: true}}
        );

        web3.setProvider(provider);

        return new Promise(async function (resolve) {
            // Stage 0:
            let stage = 0;

            web3.eth
                .subscribe('newBlockHeaders')
                .on('connected', function(result) {
                    assert(result);

                    // Exit point, flag set below
                    if (stage === 1) {
                        web3.currentProvider.disconnect();
                        resolve();
                    }
                });

            // Stage 1: Close & re-open server
            await geth.admin.wsStopQuietly(web3);
            await geth.admin.wsStart();
            stage = 1;
        });
    });
});

