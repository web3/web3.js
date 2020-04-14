var assert = require('assert');
var ganache = require('ganache-cli');
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
        provider = ganache.provider();
        web3 = new Web3(provider);
        accounts = await web3.eth.getAccounts();
        basic = new web3.eth.Contract(Basic.abi, basicOptions);
    })

    it('deploys a contract', async function(){
        var instance = await basic.deploy().send({from: accounts[0]})
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
