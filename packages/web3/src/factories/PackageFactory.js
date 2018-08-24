var Shh = require('web3-shh');
var Bzz = require('web3-bzz');
var ENS = require('web3-eth-ens');
var Accounts = require('web3-eth-accounts');
var Personal = require('web3-eth-personal');
var EthPackage = require('web3-eth');
var Iban = require('web3-eth-iban');
var Contract = require('web3-eth-contract');
var ABI = require('web3-eth-abi');

/**
 * @param {Object} coreFactory
 * @param {Object} connectionModel
 * @constructor
 */
function PackageFactory(coreFactory, connectionModel) {
    this.coreFactory = coreFactory;
    this.connectionModel = connectionModel;
}

/**
 * @returns {Shh}
 */
PackageFactory.prototype.createShhPackage = function () {
    return new Shh(this.connectionModel, this.coreFactory);
};

/**
 * @returns {Bzz}
 */
PackageFactory.prototype.createBzzPackage = function () {
    return new Bzz(this.connectionModel);
};

/**
 * @returns {ENS}
 */
PackageFactory.prototype.createEnsPackage = function () {
    return new ENS(this.connectionModel, this.createEthPackage());
};

/**
 * @returns {Accounts}
 */
PackageFactory.prototype.createAccountsPackage = function () {
    return new Accounts(this.connectionModel, this.coreFactory);
};

/**
 * @returns {Personal}
 */
PackageFactory.prototype.createPersonalPackage = function () {
    return new Personal(this.connectionModel, this.coreFactory);
};

/**
 * @returns {Eth}
 */
PackageFactory.prototype.createEthPackage = function () {
    return new EthPackage.Eth(
        this.connectionModel,
        this,
        this.coreFactory,
        new EthPackage.SubscriptionsResolver(this.connectionModel)
    );
};

/**
 * @returns {Contract}
 */
PackageFactory.prototype.createContractPackage = function () {
    return Contract;// have a closer look later
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
