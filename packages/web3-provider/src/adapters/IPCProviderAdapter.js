

// TODO: Methods should have the same behavior like the EthereumProvider.
/**
 * @param {IPCProvider} ipcProvider
 * @constructor
 */
function IPCProviderAdapter (ipcProvider) {
    this.provider = ipcProvider;
}

/**
 * @param {string} method
 * @param {Array} parameters
 * @returns {Promise}
 */
IPCProviderAdapter.send = function (method, parameters) {
    return this.provider.send(method, parameters);
};

/**
 * @param {string} subscriptionType
 * @param {Array} parameters
 * @returns {Promise}
 */
IPCProviderAdapter.subscribe = function (subscriptionType, parameters) {
    return this.provider.subscribe(subscriptionType, parameters);
};

/**
 * @param {string} subscriptionId
 * @returns {Promise<Boolean|Error>}
 */
IPCProviderAdapter.unsubscribe = function (subscriptionId) {
    return this.provider.unsubscribe(subscriptionId);
};

/**
 * @returns {*} //TODO: define return value
 */
IPCProviderAdapter.isConnected = function () {
    return this.provider.isConnected();
};

/**
 * @param {Object} payload
 * @param {function} callback
 * @returns {Promise}
 */
IPCProviderAdapter.sendAync = function (payload, callback) {
    return this.provider.sendAsync(); // TODO: Check if this is necessary
};
