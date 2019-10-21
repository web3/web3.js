var assert = require('assert');
var Basic = require('./sources/Basic');
var utils = require('./helpers/test.utils');
var Web3 = utils.getWeb3();

describe('contract.events [ @E2E ]', function() {
    var web3;
    var accounts;
    var basic;
    var instance;

    var basicOptions = {
        data: Basic.bytecode,
        gasPrice: '1',
        gas: 4000000
    };

    before(async function(){
        var port = utils.getWebsocketPort();

        web3 = new Web3('ws://localhost:' + port);
        accounts = await web3.eth.getAccounts();

        basic = new web3.eth.Contract(Basic.abi, basicOptions);
        instance = await basic.deploy().send({from: accounts[0]});
    })

    it('contract.getPastEvents', async function(){
        // `getPastEvents` not working with Geth instamine over websockets.
        if (process.env.GETH_INSTAMINE) return;

        await instance
            .methods
            .firesEvent(accounts[0], 1)
            .send({from: accounts[0]});

        await instance
            .methods
            .firesEvent(accounts[0], 2)
            .send({from: accounts[0]});

        const events = await instance.getPastEvents({
            fromBlock: 0,
            toBlock: 'latest'
        });

        assert.equal(events.length, 2);
        assert.equal(events[0].event, 'BasicEvent');
        assert.equal(events[1].event, 'BasicEvent');
        assert.notEqual(events[0].id, events[1].id);
    });

    it('contract.events.<eventName>', function(){
        return new Promise(async resolve => {
            instance
                .events
                .BasicEvent({
                    fromBlock: 0,
                    toBlock: 'latest'
                })
                .on('data', function(event) {
                    assert.equal(event.event, 'BasicEvent');
                    this.removeAllListeners();
                    resolve();
                });

            await instance
                .methods
                .firesEvent(accounts[0], 1)
                .send({from: accounts[0]});
        });
    });
});

