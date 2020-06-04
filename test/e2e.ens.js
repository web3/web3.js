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
    let options;

    before(async function(){
        web3 = new Web3('http://localhost:8545');
        accounts = await web3.eth.getAccounts();
        account = accounts[0];

        addresses = await setupENS(web3);
        registryAddr = addresses.registry;
        resolverAddr = addresses.resolver;
        web3.eth.ens.registryAddress = registryAddr;

        options = {
            from: account,
            gas: 4000000,
            gasPrice: 1
        }
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

    it('should get/set a publickey', async function(){
        const x = "0x3078303030303030303030303030303030303030303030303030303030303030";
        const y = "0x3030303030303030303030303030303030303030303030303030303030303030";

        await web3.eth.ens.setPubkey('resolver', x, y, options);
        const coords = await web3.eth.ens.getPubkey('resolver');

        assert.equal(coords.x, x);
        assert.equal(coords.y, y);
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
    });

    // This test must be run before any contentHashes are set
    it('getContenthash return object keys are null if no contentHash is set', async function(){
        const val = await web3.eth.ens.getContenthash('resolver');

        assert.equal(val.protocolType, null);
        assert.equal(val.decoded, null);
        assert.equal(val.error,  null);
    });

    /**
     * NB: hash values for these tests are borrowed from unit tests at @ensdomains/ui
     * Link: https://github.com/ensdomains/ui/blob/3e62e440b53466eeec9dd1c63d73924eefbd88c1/src/utils/contents.test.js#L1-L151
     */
    it('should get/set an IPFS contenthash (ipfs://)', async function(){
        const prefix = "ipfs://"
        const hash = "QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn";

        await web3.eth.ens.setContenthash('resolver', prefix + hash, options);
        const val = await web3.eth.ens.getContenthash('resolver');

        assert.equal(val.protocolType, 'ipfs');
        assert.equal(val.decoded, hash);
    });

    it('should get/set an IPFS contenthash (/ipfs/)', async function(){
        const prefix = "/ipfs/"
        const hash = "QmaEBknbGT4bTQiQoe2VNgBJbRfygQGktnaW5TbuKixjYL";

        await web3.eth.ens.setContenthash('resolver', prefix + hash, options);
        const val = await web3.eth.ens.getContenthash('resolver');

        assert.equal(val.protocolType, 'ipfs');
        assert.equal(val.decoded, hash);
    });

    it('should get/set a bzz contenthash', async function(){
        const prefix = "bzz://";
        const hash = "d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162";

        await web3.eth.ens.setContenthash('resolver', prefix + hash, options);
        const val = await web3.eth.ens.getContenthash('resolver');

        assert.equal(val.protocolType, 'bzz');
        assert.equal(val.decoded, hash);
    });

    it('should get/set an onion contenthash', async function(){
        const prefix = "onion://"
        const hash = "3g2upl4pq6kufc4m";

        await web3.eth.ens.setContenthash('resolver', prefix + hash, options);
        const val = await web3.eth.ens.getContenthash('resolver');

        assert.equal(val.protocolType, 'onion');
        assert.equal(val.decoded, hash);
    });

    it('should get/set an onion3 contenthash', async function(){
        const prefix = "onion3://"
        const hash = "p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqsiofyeznfu5uqd";

        await web3.eth.ens.setContenthash('resolver', prefix + hash, options);
        const val = await web3.eth.ens.getContenthash('resolver');

        assert.equal(val.protocolType, 'onion3');
        assert.equal(val.decoded, hash);
    });

    it('setContenthash errors when encoding an invalid contenthash (promise)', async function(){
        // Missing required protocol prefix
        const hash = "p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqsiofyeznfu5uqd";

        try {
            await web3.eth.ens.setContenthash('resolver', hash, options);
            assert.fail();
        } catch(err) {
            assert(err.message.includes(`Could not encode ${hash}`));
        }
    });

    it('setContentHash errors when encoding an invalid contenthash (callback)', function(done){
        // Missing required protocol prefix
        const hash = "p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqsiofyeznfu5uqd";

        web3.eth.ens.setContenthash('resolver', hash, options, function(err, result){
            assert(err.message.includes(`Could not encode ${hash}`));
            done();
        });
    });
});

