
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

/**
 * Sets givenProvider
 *
 * @param {Object} givenProvider
 */
ConnectionModel.prototype.setGivenProvider = function (givenProvider) {
    this.givenProvider = givenProvider;
};

/**
 * Gets the givenProvider (currentProvider, ipcWrapperProvider or ethereumProvider)
 *
 * @returns {Object|*}
 */
ConnectionModel.prototype.getGivenProvider = function () {
    return this.givenProvider;
};

ConnectionModel.prototype.getNetworkType = function () {
    // return network type (main, ropsten, kovan etc.)
};
