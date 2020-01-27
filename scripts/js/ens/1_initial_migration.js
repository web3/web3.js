const ENS = artifacts.require("@ensdomains/ens/ENSRegistry");
const FIFSRegistrar = artifacts.require("@ensdomains/ens/FIFSRegistrar");
const ReverseRegistrar = artifacts.require("@ensdomains/ens/ReverseRegistrar");
const PublicResolver = artifacts.require("@ensdomains/resolver/PublicResolver");
const path = require('path');
const fs = require('fs');
const utils = require('web3-utils');
const namehash = require('eth-ens-namehash');

const ensConfigPath = path.resolve('../test/config/ensAddresses.json');
const tld = "test";

module.exports = function (deployer, network, accounts) {
    let ens;
    let resolver;
    let registrar;

    // Registry
    deployer.deploy(ENS)
    // Resolver
    .then(function (ensInstance) {
        ens = ensInstance;
        return deployer.deploy(PublicResolver, ens.address);
    })
    .then(function (resolverInstance) {
        resolver = resolverInstance;
        return setupResolver(ens, resolver, accounts);
    })
    // Registrar
    .then(function () {
        return deployer.deploy(FIFSRegistrar, ens.address, namehash.hash(tld));
    })
    .then(function (registrarInstance) {
        registrar = registrarInstance;
        return setupRegistrar(ens, registrar);
    })
    // Reverse Registrar
    .then(function () {
        return deployer.deploy(ReverseRegistrar, ens.address, resolver.address);
    })
    .then(async function (reverseRegistrarInstance) {
        await setupReverseRegistrar(ens, resolver, reverseRegistrarInstance, accounts);

        return new Promise(function(resolve, reject) {
            fs.readFile(ensConfigPath, function (error, data) {
                if (error) {
                    reject(error);
                    return;
                }

                let config = JSON.parse(data);
                config.registry = ens.address;
                config.resolver = resolver.address;
                config.fifsRegistrar = registrar.address;
                config.reverseRegistrar = reverseRegistrarInstance.address;

                fs.writeFile(ensConfigPath, JSON.stringify(config), function(error) {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                });
            });
        });
    });
};

async function setupResolver(ens, resolver, accounts) {
    const resolverNode = namehash.hash("resolver");
    const resolverLabel = utils.sha3("resolver");

    await ens.setSubnodeOwner("0x0000000000000000000000000000000000000000", resolverLabel, accounts[0]);
    await ens.setResolver(resolverNode, resolver.address);
    await resolver.setAddr(resolverNode, "0x0000000000000000000000000000000000000001");
}

async function setupRegistrar(ens, registrar) {
    await ens.setSubnodeOwner("0x0000000000000000000000000000000000000000", utils.sha3(tld), registrar.address);
}

async function setupReverseRegistrar(ens, resolver, reverseRegistrar, accounts) {
    await ens.setSubnodeOwner("0x0000000000000000000000000000000000000000", utils.sha3("reverse"), accounts[0]);
    await ens.setSubnodeOwner(namehash.hash("reverse"), utils.sha3("addr"), reverseRegistrar.address);
}
