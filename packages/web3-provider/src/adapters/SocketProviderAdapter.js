

var EventEmitter = require('eventemitter3');

function SocketProviderAdapter (provider) {
    this.provider = provider;
    this.subscriptions = [];
    this.registerSubscriptionListener();
}

/**
 * @param {string} method
 * @param {Array} parameters
 * @returns {Promise}
 */
SocketProviderAdapter.prototype.send = function (method, parameters) {
    return this.provider.send(method, parameters);
};

/**
 * @param {string} subscriptionType
 * @param {Array} parameters
 * @returns {Promise<string|Error>}
 */
SocketProviderAdapter.prototype.subscribe = function (subscriptionType, parameters) {
    return this.send('eth_subscribe', parameters.shift(subscriptionType)).then(function (error, subscriptionId) {
        if (!error) {
            this.subscriptions[subscriptionId]({subscriptionType: subscriptionType, type: 'eth'});

            return subscriptionId;
        }

        throw new Error('SUB ERROR');
    });
};

/**
 * Emits an event with the subscription id
 */
SocketProviderAdapter.prototype.registerSubscriptionListener = function () {
    var self = this;
    this.provider.on('data', function (result, deprecatedResult) {
        result = result || deprecatedResult; // this is for possible old providers, which may had the error first handler

        // check for result.method, to prevent old providers errors to pass as result
        if (result.method && self.subscriptions[result.params.subscription]) {
            self.emit(result.params.subscription, result.params.result);
        }
    });
};

/**
 * @param {string} subscriptionId
 * @returns {Promise<Boolean|Error>}
 */
SocketProviderAdapter.prototype.unsubscribe = function (subscriptionId) {
    return this.send('eth_unsubscribe', [subscriptionId]).then(function (result) {
        if (result) {
            this.subscriptions = this.subscriptions.filter(function (subscription) {
                return subscription !== subscriptionId;
            });

            return true;
        }

        return false;
    });
};

/**
 * @returns {boolean}
 */
SocketProviderAdapter.prototype.isConnected = function () {
    return this.provider.connected;
};

SocketProviderAdapter.prototype = Object.create(EventEmitter.prototype);
SocketProviderAdapter.prototype.constructor = SocketProviderAdapter;
