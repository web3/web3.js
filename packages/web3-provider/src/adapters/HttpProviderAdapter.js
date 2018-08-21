var Jsonrpc = require('./jsonrpc.js'); //TODO:  Fix import

// TODO: Methods should have the same behavior like the EthereumProvider.
/**
 * @param {HttpProvider} httpProvider
 * @constructor
 */
function HttpProviderAdapter (httpProvider) {
    this.provider = httpProvider;
}

/**
 * @param {string} method
 * @param {Array} parameters
 * @returns {Promise}
 */
HttpProviderAdapter.send = function (method, parameters) {
    return new Promise(function(resolve, reject) {
        this.provider.send(Jsonrpc.toPayload(method, parameters), function(result, error) {
            if(!error) {
                resolve(result);
                return;
            }

            reject(error);
        });

    });
};

/**
 * @returns {Promise<Error>}
 */
HttpProviderAdapter.subscribe = function () {
    return new Promise(function(resolve, reject) {
        reject(new Error('HTTP does not support subscriptions'));
    });
};

/**
 * @returns {Promise<Error>}
 */
HttpProviderAdapter.unsubscribe = function () {
    return new Promise(function(resolve, reject) {
        reject(new Error('HTTP does not support subscriptions'));
    });
};

/**
 * @returns {boolean}
 */
HttpProviderAdapter.isConnected = function () {
    return this.provider.connected;
};
