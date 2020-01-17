const addresses = require('./config/ensAddresses');
const registryAddr = addresses.registry;
const resolverAddr = addresses.resolver;
const utils = require('./helpers/test.utils');
const Web3 = utils.getWeb3();
const assert = require('assert');

describe('ENS [ @E2E ]', function () {
    let web3;
    let account;

    beforeEach(async function () {
        web3 = new Web3('ws://localhost:' + utils.getWebsocketPort());
        web3.eth.ens.registryAddress = registryAddr;
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];
    });

    it('custom registry got defined in the ENS module', function () {
        assert(web3.eth.ens.registryAddress, registryAddr);
    });

    it('should return the subnode owner of "resolver"', async function () {
        const owner = await web3.eth.ens.registry.owner('resolver');

        assert.equal(
            owner,
            account
        );
    });

    it('should fetch the registered resolver for the subnode "resolver"', async function () {
        const resolver = await web3.eth.ens.registry.resolver('resolver');
        assert.equal(resolver.options.address, resolverAddr);
    });

    it('should return the addr record for the subnode "resolver"', async function () {
        const address = await web3.eth.ens.getAddress('resolver');

        assert.equal(
            address,
            '0x0000000000000000000000000000000000000001'
        );
    });
});

