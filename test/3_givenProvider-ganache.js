var assert = require('assert');
var ganache = require('ganache-cli');
var Web3 = require('../packages/web3');
var Basic = require('./sources/Basic');

describe('web.providers.givenProvider (ganache)', function(){
    var web3;
    var accounts;
    var basic;

    var basicOptions = {
        data: Basic.bytecode,
        gasPrice: '1',
        gas: 4000000
    };

    // TODO: This triggers Nodes max listeners warning.
    //       Fix could be tested here by watching process.on
    before(async function(){
        web3 = new Web3(ganache.provider());
        accounts = await web3.eth.getAccounts();
        basic = new web3.eth.Contract(Basic.abi, basicOptions);
    })

    it('deploys a contract', async function(){
        var instance = await basic.deploy().send({from: accounts[0]})
        assert(web3.utils.isAddress(instance.options.address));
    });
})