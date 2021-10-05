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
            // Currently only Geth supports eth_createAccessList
            if (process.env.GANACHE || global.window ) return

            var expected = {
                accessList: [
                  {
                    address: instance.options.address.toLowerCase(),
                    storageKeys: ["0x0000000000000000000000000000000000000000000000000000000000000000"]
                  }
                ],
                gasUsed: '0x644e'
            };

            assert.deepEqual(
                await instance.methods.getValue().createAccessList({from: accounts[0]}),
                expected
            );
        });

        it('returns expected access list for setValue', async function () {
            // Currently only Geth supports eth_createAccessList
            if (process.env.GANACHE || global.window ) return

            var expected = {
                accessList: [
                  {
                    address: instance.options.address.toLowerCase(),
                    storageKeys: ["0x0000000000000000000000000000000000000000000000000000000000000000"]
                  }
                ],
                gasUsed: '0xb2f5'
            }
              

            assert.deepEqual(
                await instance.methods.setValue(1).createAccessList({from: accounts[0]}),
                expected
            );
        });
    });
});
