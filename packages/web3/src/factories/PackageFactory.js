var Shh = require('web3-shh');
var Bzz = require('web3-bzz');
var ENS = require('web3-eth-ens');
var Accounts = require('web3-eth-accounts');
var Personal = require('web3-eth-personal');
var EthPackage = require('web3-eth');
var Iban = require('web3-eth-iban');
var Contract = require('web3-eth-contract');
var ABI = require('web3-eth-abi');
var ProvidersPackageFactory = require('web3-core-providers').ProvidersPackageFactory;

/**
 * @param {Object} coreFactory
 * @constructor
 */
function PackageFactory(coreFactory) {
    this.coreFactory = coreFactory;
}

/**
 * @returns {Shh}
 */
PackageFactory.prototype.createShhPackage = function (connectionModel) {
    return new Shh(connectionModel, this.coreFactory);
};

/**
 * @returns {Bzz}
 */
PackageFactory.prototype.createBzzPackage = function (connectionModel) {
    return new Bzz(connectionModel);
};

/**
 * @returns {ENS}
 */
PackageFactory.prototype.createEnsPackage = function (connectionModel) {
    return new ENS(connectionModel, this.createEthPackage());
};

/**
 * @returns {Accounts}
 */
PackageFactory.prototype.createAccountsPackage = function (connectionModel) {
    return new Accounts(connectionModel, this.coreFactory);
};

/**
 * @returns {Personal}
 */
PackageFactory.prototype.createPersonalPackage = function (connectionModel) {
    return new Personal(connectionModel, this.coreFactory);
};

/**
 * @returns {Eth}
 */
PackageFactory.prototype.createEthPackage = function (connectionModel) {
    return new EthPackage.Eth(
        connectionModel,
        this,
        this.coreFactory,
        new EthPackage.SubscriptionsResolver(connectionModel)
    );
};

/**
 * Bind ConnectionModel and Accounts package to Contract and return the uninstantiated Contract object.
 *
 * @returns {Contract} // TODO: Refactor Contract for usage of binded properties
 */
PackageFactory.prototype.createContractPackage = function (connectionModel) {
    return Contract.bind({connectionModel: connectionModel, accounts: this.createAccountsPackage()});
};

/**
 * @returns {Iban}
 */
PackageFactory.prototype.createIbanPackage = function () {
    return Iban;// have a closer look later
};

/**
 * @returns {ABI}
 */
PackageFactory.prototype.createAbiPackage = function () {
    return new ABI(this.coreFactory.createUtils());
};

/**
 * Return the ProvidersPackageFactory from web3-core-providers
 *
 * @returns ProvidersPackageFactory
 */
PackageFactory.prototype.createProvidersPackageFactory = function () {
    return new ProvidersPackageFactory()
};
