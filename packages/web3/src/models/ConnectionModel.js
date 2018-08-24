
/**
 * @param {Object} provider
 * @constructor
 */
function ConnectionModel(provider) {
    this.setProvider(provider);
}

/**
 * Sets the provider object
 *
 * @param {Object} provider
 */
ConnectionModel.prototype.setProvider = function (provider) {
    this.provider = provider;
};

/**
 * Gets the provider Object
 *
 * @returns {Object} provider
 */
ConnectionModel.prototype.getProvider = function () {
    return this.provider;
};

ConnectionModel.prototype.getNetworkType = function () {
    // return network type (main, ropsten, kovan etc.)
};
