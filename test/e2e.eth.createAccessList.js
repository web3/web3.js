var assert = require('assert');
var Basic = require('./sources/Basic');
var Misc = require('./sources/Misc');
var utils = require('./helpers/test.utils');
var Web3 = utils.getWeb3();

describe('method.call [ @E2E ]', function () {
    var web3;
    var accounts;
    var basic;
    var instance;
    var options;

    var basicOptions = {
        data: Basic.bytecode,
        gasPrice: 1000000000, // Default gasPrice set by Geth
        gas: 4000000
    };

    var miscOptions = {
        data: Misc.bytecode,
        gasPrice: 1000000000, // Default gasPrice set by Geth
        gas: 4000000
    };

    describe('http', function () {
        before(async function () {
            web3 = new Web3('http://localhost:8545');
            accounts = await web3.eth.getAccounts();

            basic = new web3.eth.Contract(Basic.abi, basicOptions);
            instance = await basic.deploy().send({from: accounts[0]});
        })

        it('returns expected access list for getValue', async function () {
            var expected = {
                accessList: [
                  {
                    address: '0x61ecff5d2eb87dfc4e8517004349ad90d5ba82da',
                    storageKeys: ["0x0000000000000000000000000000000000000000000000000000000000000000"]
                  }
                ],
                gasUsed: '0x644e'
            };

            assert.equal(
                await instance.methods.getValue().createAccessList({from: accounts[0]}),
                expected
            );
        });

        it('returns expected access list for setValue', async function () {
            var expected = {
                accessList: [
                  {
                    address: '0x62c5ea3d7b34f67fced4923b531fc21d674e6fc3',
                    storageKeys: ["0x0000000000000000000000000000000000000000000000000000000000000000"]
                  }
                ],
                gasUsed: '0xb2f5'
            }
              

            assert.equal(
                await instance.methods.setValue(1).createAccessList({from: accounts[0]}),
                expected
            );
        });
    });
});
