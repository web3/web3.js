var assert = require('assert');
var Basic = require('./sources/Basic');
var Misc = require('./sources/Misc');
var utils = require('./helpers/test.utils');
var Web3 = utils.getWeb3();

describe('method.call [ @E2E ]', function() {
    var web3;
    var accounts;
    var basic;
    var instance;
    var options;

    var basicOptions = {
        data: Basic.bytecode,
        gasPrice: '1',
        gas: 4000000
    };

    var miscOptions = {
        data: Misc.bytecode,
        gasPrice: '1',
        gas: 4000000
    };

    before(async function(){
        web3 = new Web3('http://localhost:8545');
        accounts = await web3.eth.getAccounts();

        basic = new web3.eth.Contract(Basic.abi, basicOptions);
        instance = await basic.deploy().send({from: accounts[0]});
    })

    it('retrieves a uint value', async function(){
        var expected = '1';

        await instance
            .methods
            .setValue(expected)
            .send({from: accounts[0]});

        var value = await instance
            .methods
            .getValue()
            .call({from: accounts[0]});

        assert.equal(value, expected);
    });

    it('errors correctly when abi and bytecode do not match', async function(){
        // Misc n.eq Basic
        var wrong = new web3.eth.Contract(Basic.abi, miscOptions);
        var wrongInstance = await wrong.deploy().send({from: accounts[0]});

        try {
            await wrongInstance
                .methods
                .getValue()
                .call();

            assert.fail();

        } catch(err){
            assert(err.message.includes("Returned values aren't valid"));
            assert(err.message.includes('the correct ABI'));
        }
    })
});
