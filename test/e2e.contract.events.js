var assert = require('assert');
var Basic = require('./sources/Basic');
var Child = require('./sources/Child');
var Parent = require('./sources/Parent');
var utils = require('./helpers/test.utils');
var Web3 = utils.getWeb3();

describe('contract.events [ @E2E ]', function() {
    // `getPastEvents` not working with Geth instamine over websockets.
    if (process.env.GETH_INSTAMINE) return;

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
    });

    it('contract.getPastEvents', async function(){
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

    // Test models event signature shadowing when one contract calls another.
    // Child and parent contracts have an event named `similar` which has the same
    // function signature but indexes arguments differently.
    it('handles child events with shadowed signatures', async function(){
        this.timeout(25000);

        let contract;

        const options = {
            gasPrice: '1',
            gas: 4000000
        };

        options.data = Child.bytecode;
        contract = new web3.eth.Contract(Child.abi, options);
        const child = await contract.deploy().send({from: accounts[0]});

        options.data = Parent.bytecode;
        contract = new web3.eth.Contract(Parent.abi, options);
        const parent = await contract.deploy().send({from: accounts[0]});

        await parent
            .methods
            .fireChildSimilarEvent(child.options.address)
            .send({from: accounts[0]});

        await parent
            .methods
            .fireChildIdenticalEvent(child.options.address)
            .send({from: accounts[0]});

        const childEvents = await child.getPastEvents({
            fromBlock: 0,
            toBlock: 'latest'
        });

        const parentEvents = await parent.getPastEvents({
            fromBlock: 0,
            toBlock: 'latest'
        });

        assert.equal(childEvents.length, 2);
        assert.equal(parentEvents.length, 0);

        assert.equal(childEvents[0].event, 'Similar');
        assert.equal(typeof childEvents[0].returnValues._owner, 'string');

        assert.equal(childEvents[1].event, 'Identical');
        assert.equal(typeof childEvents[1].returnValues.childA, 'string');
    });
});

