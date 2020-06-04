const ENSArtifact = require("@ensdomains/ens/build/contracts/ENSRegistry");
const FIFSRegistrarArtifact = require("@ensdomains/ens/build/contracts/FIFSRegistrar");
const ReverseRegistrarArtifact = require("@ensdomains/ens/build/contracts/ReverseRegistrar");
const PublicResolverArtifact = require("@ensdomains/resolver/build/contracts/PublicResolver");
const namehash = require('eth-ens-namehash');

const addressZero = "0x0000000000000000000000000000000000000000";
const addressOne = "0x0000000000000000000000000000000000000001";
const tld = "test";

async function setupENS(web3) {

    const options = {
        bytecode: undefined,
        gasPrice: '1',
        gas: 5500000
    }

    const accounts = await web3.eth.getAccounts();
    const from = { from: accounts[0] };

    // ENS
    options.data = ENSArtifact.bytecode;
    const ENS = new web3.eth.Contract(ENSArtifact.abi, options)

    const ens = await ENS
        .deploy()
        .send(from);

    // PublicResolver
    options.data = PublicResolverArtifact.bytecode;
    const PublicResolver = new web3.eth.Contract(PublicResolverArtifact.abi, options)

    const resolver = await PublicResolver
        .deploy({ arguments: [ens.options.address] })
        .send(from);

    await setupResolver(ens, resolver, accounts[0], web3);

    // Registrar
    options.data = FIFSRegistrarArtifact.bytecode;
    const FIFSRegistrar = new web3.eth.Contract(FIFSRegistrarArtifact.abi, options)

    const registrar = await FIFSRegistrar
        .deploy({ arguments: [ens.options.address, namehash.hash(tld)] })
        .send(from);

    await setupRegistrar(ens, registrar.options.address, accounts[0], web3);

    // Reverse Registrar
    options.data = ReverseRegistrarArtifact.bytecode;
    const ReverseRegistrar = new web3.eth.Contract(ReverseRegistrarArtifact.abi, options)

    const reverse = await ReverseRegistrar
        .deploy({ arguments: [ens.options.address, resolver.options.address] })
        .send(from);

    await setupReverseRegistrar(ens, reverse.options.address, accounts[0], web3);

    return {
        registry: ens.options.address,
        resolver: resolver.options.address,
        fifsRegistrar: registrar.options.address,
        reverseRegistrar: reverse.options.address
    }
};

async function setupResolver(ens, resolver, account, web3) {
    const node = namehash.hash("resolver");
    const label = web3.utils.sha3("resolver");

    await ens
        .methods
        .setSubnodeOwner(addressZero, label, account)
        .send({from: account});

    await ens
        .methods
        .setResolver(node, resolver.options.address)
        .send({from: account});

    await resolver
        .methods
        .setAddr(node, addressOne)
        .send({from: account});
}

async function setupRegistrar(ens, address, account, web3) {
    await ens
        .methods
        .setSubnodeOwner(addressZero, web3.utils.sha3(tld), address)
        .send({from: account});
}

async function setupReverseRegistrar(ens, address, account, web3) {
    await ens
        .methods
        .setSubnodeOwner(addressZero, web3.utils.sha3("reverse"), account)
        .send({from: account});

    await ens
        .methods
        .setSubnodeOwner(namehash.hash("reverse"), web3.utils.sha3("addr"), address)
        .send({from: account});
}

module.exports = setupENS
