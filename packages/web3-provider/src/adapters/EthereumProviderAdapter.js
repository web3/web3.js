
/**
 * @param {EthereumProvider} ethereumProvider
 * @constructor
 */
function EthereumProviderAdapter (ethereumProvider) {
    this.provider = ethereumProvider;
}

/**
 * @param {string} method
 * @param {Array} parameters
 * @returns {Promise}
 */
EthereumProviderAdapter.send = function (method, parameters) {
    return this.provider.send(method, parameters);
};

/**
 * @param {string} subscriptionType
 * @param {Array} parameters
 * @returns {Promise}
 */
EthereumProviderAdapter.subscribe = function (subscriptionType, parameters) {
    return this.provider.subscribe(subscriptionType, parameters);
};

/**
 * @param {string} subscriptionId
 * @returns {Promise<Boolean|Error>}
 */
EthereumProviderAdapter.unsubscribe = function (subscriptionId) {
    return this.provider.unsubscribe(subscriptionId);
};

/**
 * @returns {*} //TODO: define return value
 */
EthereumProviderAdapter.isConnected = function () {
    return this.provider.isConnected();
};

/**
 * @param {Object} payload
 * @param {function} callback
 * @returns {Promise}
 */
EthereumProviderAdapter.sendAync = function (payload, callback) {
    return this.provider.sendAsync(); // TODO: Check if this is necessary
};
