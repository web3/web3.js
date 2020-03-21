const setupENS = require('../scripts/js/ens');
const utils = require('./helpers/test.utils');
const Web3 = utils.getWeb3();
const assert = require('assert');

describe('ENS [ @E2E ]', function () {
    this.timeout(50000);

    let web3;
    let account;
    let accounts;
    let addresses;
    let registryAddr;
    let resolverAddr;

    before(async function(){
        web3 = new Web3('http://localhost:8545');
        accounts = await web3.eth.getAccounts();
        account = accounts[0];

        addresses = await setupENS(web3);
        registryAddr = addresses.registry;
        resolverAddr = addresses.resolver;
        web3.eth.ens.registryAddress = registryAddr;
    });

    it('custom registry got defined in the ENS module', function () {
        assert(web3.eth.ens.registryAddress, registryAddr);
    });

    it('should return the subnode owner of "resolver"', async function () {
        const owner = await web3.eth.ens.registry.getOwner('resolver');

        assert.equal(
            owner,
            account
        );
    });

    it('should fetch the registered resolver for the subnode "resolver"', async function () {
        const resolver = await web3.eth.ens.registry.getResolver('resolver');
        assert.equal(resolver.options.address, resolverAddr);
    });

    it('should return the addr record for the subnode "resolver"', async function () {
        const address = await web3.eth.ens.getAddress('resolver');

        assert.equal(
            address,
            '0x0000000000000000000000000000000000000001'
        );
    });

    it('should error when calling "getContent" if resolver does not support it', async function () {
        try {
            await web3.eth.ens.getContent('resolver');
            assert.fail();
        } catch(err){
            assert(err.message.includes(resolverAddr));
            assert(err.message.includes('does not implement requested method: "content"'))
        }
    })

    it('should error when calling "setContent" if resolver does not support it', async function () {
        try {
            await web3.eth.ens.setContent('resolver', web3.utils.sha3('test'));
            assert.fail();
        } catch(err){
            assert(err.message.includes(resolverAddr));
            assert(err.message.includes('does not implement requested method: "setContent"'))
        }
    })
});

