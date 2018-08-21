

// TODO: Methods should have the same behavior like the EthereumProvider.
/**
 * @param {WebsocketProvider} websocketProvider
 * @constructor
 */
function WebsocketProviderAdapter (websocketProvider) {
    this.provider = websocketProvider;
}

/**
 * @param {string} method
 * @param {Array} parameters
 * @returns {Promise}
 */
WebsocketProviderAdapter.send = function (method, parameters) {
    return this.provider.send(method, parameters);
};

/**
 * @param {string} subscriptionType
 * @param {Array} parameters
 * @returns {Promise}
 */
WebsocketProviderAdapter.subscribe = function (subscriptionType, parameters) {
    return this.provider.subscribe(subscriptionType, parameters);
};

/**
 * @param {string} subscriptionId
 * @returns {Promise<Boolean|Error>}
 */
WebsocketProviderAdapter.unsubscribe = function (subscriptionId) {
    return this.provider.unsubscribe(subscriptionId);
};

/**
 * @returns {*} //TODO: define return value
 */
WebsocketProviderAdapter.isConnected = function () {
    return this.provider.isConnected();
};
