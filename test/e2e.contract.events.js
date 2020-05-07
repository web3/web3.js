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
    var port;

    var basicOptions = {
        data: Basic.bytecode,
        gasPrice: '1',
        gas: 4000000
    };

    beforeEach(async function(){
        port = utils.getWebsocketPort();

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

    it('should not hear the error handler when connection.closed() called', function(){
        this.timeout(15000);

        let failed = false;

        return new Promise(async (resolve, reject) => {
            instance
                .events
                .BasicEvent({
                    fromBlock: 0,
                    toBlock: 'latest'
                })
                .on('error', function(err) {
                    failed = true;
                    this.removeAllListeners();
                    reject(new Error('err listener should not hear connection.close'));
                });

            await instance
                .methods
                .firesEvent(accounts[0], 1)
                .send({from: accounts[0]});

            web3.currentProvider.connection.close();

            // Resolve only if we haven't already rejected
            setTimeout(() => { if(!failed) resolve() }, 2500)
        });
    });

    it('should not hear the error handler when provider.disconnect() called', function(){
        this.timeout(15000);

        let failed = false;

        return new Promise(async (resolve, reject) => {
            instance
                .events
                .BasicEvent({
                    fromBlock: 0,
                    toBlock: 'latest'
                })
                .on('error', function(err) {
                    failed = true;
                    this.removeAllListeners();
                    reject(new Error('err listener should not hear provider.disconnect'));
                });

            await instance
                .methods
                .firesEvent(accounts[0], 1)
                .send({from: accounts[0]});

            web3.currentProvider.disconnect();

            // Resolve only if we haven't already rejected
            setTimeout(() => { if(!failed) resolve() }, 2500)
        });
    });

    // Regression test for a race-condition where a fresh web3 instance
    // subscribing to past events would have its call parameters deleted while it
    // made initial Websocket handshake and return an incorrect response.
    it('can immediately listen for events in the past', async function(){
        this.timeout(15000);

        const first = await instance
            .methods
            .firesEvent(accounts[0], 1)
            .send({from: accounts[0]});

        const second = await instance
            .methods
            .firesEvent(accounts[0], 1)
            .send({from: accounts[0]});

        // Go forward one block...
        await utils.mine(web3, accounts[0]);
        const latestBlock = await web3.eth.getBlockNumber();

        assert(first.blockNumber < latestBlock);
        assert(second.blockNumber < latestBlock);

        // Re-instantiate web3 & instance to simulate
        // subscribing to past events as first request
        web3 = new Web3('ws://localhost:' + port);
        const newInstance = new web3.eth.Contract(Basic.abi, instance.options.address);

        let counter = 0;
        await new Promise(async resolve => {
            newInstance
                .events
                .BasicEvent({
                    fromBlock: 0
                })
                .on('data', function(event) {
                    counter++;
                    assert(event.blockNumber < latestBlock);

                    if (counter === 2){
                        this.removeAllListeners();
                        resolve();
                    }
                });
        });
    });

    it('hears events when subscribed to "logs" (emitter)', function(){
        return new Promise(async function(resolve, reject){

            assert(typeof instance.options.address === 'string');
            assert(instance.options.address.length > 0);

            const subscription = web3.eth.subscribe(
                "logs",
                {
                    address: instance.options.address
                })
                .once("data", function(log) {
                    assert.equal(log.address, instance.options.address);
                    subscription.unsubscribe();
                    resolve();
                });

            await instance
                    .methods
                    .firesEvent(accounts[0], 1)
                    .send({from: accounts[0]});
        });
    });

    it('hears events when subscribed to "logs" (callback)', function(){
        return new Promise(async function(resolve, reject){

            assert(typeof instance.options.address === 'string');
            assert(instance.options.address.length > 0);

            const subscription = web3.eth.subscribe(
                "logs",
                {
                    address: instance.options.address
                },
                function(error, log) {
                   assert.equal(log.address, instance.options.address);
                   subscription.unsubscribe();
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

    it('backfills missed events when auto-reconnecting', function(){
        if(!process.env.GANACHE) return;
        this.timeout(10000);

        let counter = 0;
        const acc = accounts[0];

        // Create a parallel connection & contract instance
        // so we can trigger events while the WS provider is down...
        const _web3 = new Web3('http://localhost:8545');
        const shadow = new _web3.eth.Contract(Basic.abi, instance.options.address);

        // Create a reconnect-enabled WS provider and set the default Web3 with it.
        const provider = new Web3.providers.WebsocketProvider(
            'ws://localhost:' + port,
            {
                reconnect: {
                    auto: true,
                    delay: 4000,
                    maxAttempts: 1
                }
            }
        );

        web3.setProvider(provider);

        return new Promise(async function (resolve) {
            instance
                .events
                .BasicEvent()
                .on('data', function(event) {
                    counter++;

                    if (counter === 2){
                        assert(finalBlock === event.blockNumber + 2);
                        this.removeAllListeners();
                        resolve();
                    }
                });

            // First: a regular event
            const firstReceipt = await instance.methods.firesEvent(acc, 1).send({from: acc});

            // Close connection and let it settle...
            provider.connection.close(4000);
            await utils.waitSeconds(1);

            // Submit another event on parallel connection and mine forward 2 blocks
            const secondReceipt = await shadow.methods.firesEvent(acc, 1).send({from: acc});
            utils.mine(_web3, acc);
            utils.mine(_web3, acc);

            const finalBlock = await _web3.eth.getBlockNumber();
            assert(finalBlock === secondReceipt.blockNumber + 2)
        });
    });
});

