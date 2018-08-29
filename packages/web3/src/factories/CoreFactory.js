var Subscription = require('web3-core-subscription');
var PromiEvent = require('web3-core-promievent');
var Net = require('web3-net');
var helpers = require('web3-core-helpers');
var Utils = require('web3-utils');

function CoreFactory() { }

/**
 * Creates Subscription object
 *
 * @param {Object} provider
 * @param {string} type
 * @param {*} parameters
 * @param {Object} inputFormatter
 * @param {Object} outputFormatter
 */
CoreFactory.prototype.createSubscription = function (provider, type, parameters, inputFormatter, outputFormatter) {
    return new Subscription(provider, type, parameters, inputFormatter, outputFormatter);
};

/**
 * Creates PromiEvent object
 */
CoreFactory.prototype.createPromiEvent = function () {
    return new PromiEvent();
};

/**
 * Creates Method object
 *
 * @param {Object} provider
 * @param {string} rpcMethod
 * @param {array} parameters
 * @param {array} inputFormatters
 * @param {Function} outputFormatter
 * @returns {Method}
 */
CoreFactory.prototype.createMethod = function (provider, rpcMethod,  parameters, inputFormatters, outputFormatter) {
    return new Method(
        provider,
        rpcMethod,
        parameters,
        inputFormatters,
        outputFormatter,
        this.createPromiEvent(),
        this.createTransactionConfirmationWorkflow()
    );
};

CoreFactory.prototype.createTransactionConfirmationWorkflow = function () {
 // TODO: overthink the implemented factory pattern. It is strange to create here an internal package object.
 // maybe each package will have his own PackageFactory and it will have an web3-core-factories package where I combine all the factories
 // to one "masterFactory" this master factory should be a proxy to all factories.
};

/**
 * @returns {Object}
 */
CoreFactory.prototype.createUtils = function () { // maybe this can be in a global scope
  return Utils;
};

/**
 * Creates Batch object
 *
 * @param {Object} connectionModel
 * @returns {Batch}
 */
CoreFactory.prototype.createBatch = function (connectionModel) {
    return new Batch(connectionModel);
};

// This helpers things are strange.. maybe we can add this directly in the Web3 global scope.. something like helpers.X
CoreFactory.prototype.createFormatters = function () {// helpers
    return helpers.formatters;
};

CoreFactory.prototype.createErrors = function () { // helpers
    return helpers.errors;
};

//TODO: move this to connection model
// /**
//  * Creates Net object
//  *
//  * @param {Object} provider
//  * @returns {Net}
//  */
// CoreFactory.prototype.createNet = function (provider) {
//     if (provider) {
//         this.connectionModel.setProvider(provider);
//     }
//
//     return new Net(this.connectionModel);
// };
