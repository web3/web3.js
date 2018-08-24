var Subscription = require('web3-core-subscription');
var PromiEvent = require('web3-core-promievent');
var Net = require('web3-net');
var helpers = require('web3-core-helpers');
var Utils = require('web3-utils');

function CoreFactory() { }

/**
 * Creates Subscription object
 *
 * @param {Object} connectionModel
 * @param {string} type
 * @param {*} parameters
 * @param {Object} inputFormatter
 * @param {Object} outputFormatter
 */
CoreFactory.prototype.createSubscription = function (connectionModel, type, parameters, inputFormatter, outputFormatter) {
    return new Subscription(connectionModel, type, parameters, inputFormatter, outputFormatter);
};

/**
 * Creates PromiEvent object
 *
 * @param {boolean} justPromise
 */
CoreFactory.prototype.createPromiEvent = function (justPromise) {
    return new PromiEvent(justPromise);
};

/**
 * Creates Method object
 *
 * @param {ConnectionModel} connectionModel
 * @param {Object} options
 * @param {boolean} justPromise
 * @returns {Method}
 */
CoreFactory.prototype.createMethod = function (connectionModel, options, justPromise) {
    return new Method(connectionModel, this.createPromiEvent(justPromise), options);
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
