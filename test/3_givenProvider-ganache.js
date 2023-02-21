var assert = require('assert');
var ganache = require('ganache');
var Web3 = require('../packages/web3');
var Basic = require('./sources/Basic');

describe('web.providers.givenProvider (ganache)', function(){
    var web3;
    var accounts;
    var basic;
    var provider;

    var basicOptions = {
        data: Basic.bytecode,
        gasPrice: '1',
        gas: 4000000
    };

    before(async function(){
        provider = ganache.provider()
        web3 = new Web3(provider);
        accounts = await web3.eth.getAccounts();
        basic = new web3.eth.Contract(Basic.abi, basicOptions);
    })

    after(function(){
        provider.disconnect();
    })

    it('requestManager attaches 4 listeners', async function(){
        assert.equal(1, web3.currentProvider.listenerCount('message'))
        assert.equal(1, web3.currentProvider.listenerCount('connect'))
        assert.equal(1, web3.currentProvider.listenerCount('error'))
        // TODO: Remove close once the standard allows it
        assert(
            web3.currentProvider.listenerCount("disconnect") === 1 || web3.currentProvider.listenerCount("close") === 1
        );
    });

    it('deploys a contract', async function(){
        var instance = await basic.deploy().send({from: accounts[0],maxFeePerGas: 875000000})
        assert(web3.utils.isAddress(instance.options.address));
    });

    it('can repeatedly setProvider without triggering MaxListeners', function(done){
        let failed = false;

        process.once('warning', function(msg){
            failed = msg.toString().includes("MaxListenersExceededWarning");
        });

        // Setting the provider more than 9X triggers the warning in 1.2.7-rc.0
        for (var i=1; i<=10; i++) {
          basic.setProvider(provider);
        }

        setTimeout(function(){
            if(failed) assert.fail("MaxListenersExceededWarning");
            done();
        },500);
    })

})
