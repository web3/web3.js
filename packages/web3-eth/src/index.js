
var EthPackageFactory = require('./factories/EthPackageFactory');
var Contract = require('web3-eth-contract');
var Accounts = require('web3-eth-accounts');
var Personal = require('web3-eth-personal');
var Iban = require('web3-eth-iban');
var Abi = require('web3-eth-abi');
var ENS = require('web3-eth-ens');
var Utils = require('web3-utils');
var formatters = require('web3-core-helpers').formatters;
var Subscription = require('web3-core-subscription');
var PromiEvent = require('web3-core-promiEvent');


var utils = Utils.createUtils();
var ethPackageFactory = new EthPackageFactory();


module.exports = {
    createEth: function (connectionModel) {
        return ethPackageFactory.createEth(
            connectionModel,
            Contract.createContract(connectionModel),
            Accounts.createAccounts(connectionModel),
            Personal.createPersonal(connectionModel),
            Iban.createIban(),
            Abi.createAbi(utils),
            ENS.createEns(connectionModel),
            utils,
            formatters,
            Subscription.SubscriptionPackageFactory,
            PromiEvent.PromiEventPackageFactory
        );
    },
    EthPackageFactory: ethPackageFactory
};
