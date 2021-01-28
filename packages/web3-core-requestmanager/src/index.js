const { callbackify } = require('util');
const _ = require('underscore');
const errors = require('web3-core-helpers').errors;
const Jsonrpc = require('./jsonrpc.js');
const BatchManager = require('./batch.js');
var givenProvider = require('./givenProvider.js');
const noop = () => {}
/**
* It's responsible for passing messages to providers
* It's also responsible for polling the ethereum node for incoming messages
* Default poll timeout is 1 second
* Singleton
*
* @param {string|Object}provider
* @param {Net.Socket} net
*
* @constructor
*/

export default class RequestManager {
  constructor (provider, net) {
    this.provider = null;
    this.providers = RequestManager.providers;

    this.setProvider(provider, net);
    this.subscriptions = new Map();
  }
/**
* sets the provider
*
* @method setProvider
*
* @param {Object||string} provider
* @param {net.Socket} net
*
* @returns void
*/

  setProvider (provider, net) {
    if (!provider && !net) return
    // autodetect provider
    if (typeof provider === 'string') {
      // HTTP
      if (/^http(s)?:\/\//i.test(provider)) {
        provider = new this.providers.HttpProvider(provider);

      // WS
      } else if (/^ws(s)?:\/\//i.test(provider)) {
        provider = new this.providers.WebsocketProvider(provider);

      // IPC
      } else if (provider && typeof net === 'object' && typeof net.connect === 'function') {
        provider = new this.providers.IpcProvider(provider, net);

      } else if (provider) {
        throw new Error('Can\'t autodetect provider for "' + provider + '"');
      }
    }


    // reset the old one before changing, if still connected
    if (this.provider && this.provider.connected) this.clearSubscriptions();

    // assign new provider
    this.provider = provider;

    // listen to incoming notifications
    if (this.provider && this.provider.on) {
      if (typeof provider.request === 'function') { // EIP-1193 provider
        this.provider.on('message', (payload) =>  {
          if (payload && payload.type === 'eth_subscription' && payload.data) {
            const data = payload.data
            if (data.subscription && this.subscriptions.has(data.subscription)) {
              this.subscriptions.get(data.subscription).callback(null, data.result);
            }
          }
        })
      } else { // legacy provider subscription event
        this.provider.on('data', (result, deprecatedResult) => {
          result = result || deprecatedResult; // this is for possible old providers, which may had the error first handler

          // if result is a subscription, call callback for that subscription
          if (result.method && result.params && result.params.subscription && this.subscriptions.has(result.params.subscription)) {
            this.subscriptions.get(result.params.subscription).callback(null, result.params.result);
          }
        });
      }
      // resubscribe if the provider has reconnected
      this.provider.on('connect', () => {
        this.subscriptions.forEach((subscription) => {
          subscription.subscription.resubscribe();
        });
      });

      // notify all subscriptions about the error condition
      this.provider.on('error', (error) => {
        this.subscriptions.forEach(function (subscription) {
          subscription.callback(error);
        });
      });

      // notify all subscriptions about bad close conditions
      const disconnect = (event) => {
        if (this._isCleanCloseEvent(event) || this._isIpcCloseError(event)) {
          this.subscriptions.forEach((subscription) => {
            subscription.callback(errors.ConnectionCloseError(event));
            this.subscriptions.delete(subscription.subscription.id);
          });

          if (this.provider && this.provider.emit) {
            this.provider.emit('error', errors.ConnectionCloseError(event));
          }
        }

        if (this.provider && this.provider.emit) {
          this.provider.emit('end', event);
        }

      };
      // TODO: Remove close once the standard allows it
      this.provider.on('close', disconnect.bind(this));
      this.provider.on('disconnect', disconnect.bind(this));

      // TODO add end, timeout??
    }
  }
/**
* Asynchronously send request to provider.
* Prefers to use the `request` method available on the provider as specified in [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193).
* If `request` is not available, falls back to `sendAsync` and `send` respectively.
* @method send
* @param {Object} data
* @param {Function} callback
*/

send (data, cb = noop) {

if (!this.provider) {
return callback(errors.InvalidProvider());
}

const { method, params } = data

const jsonrpcPayload = Jsonrpc.toPayload(method, params);
const jsonrpcResultCallback = this._jsonrpcResultCallback(callback, jsonrpcPayload)

if (this.provider.request) {
const callbackRequest = callbackify(this.provider.request.bind(this.provider))
const requestArgs = { method, params }
callbackRequest(requestArgs, callback);
} else if (this.provider.sendAsync) {
this.provider.sendAsync(jsonrpcPayload, jsonrpcResultCallback);
} else if (this.provider.send) {
this.provider.send(jsonrpcPayload, jsonrpcResultCallback);
} else {
throw new Error('Provider does not have a request or send method to use.');
}
}


static get givenProvider () {
return givenProvider
}

static get providers () {
return {
WebsocketProvider: require('web3-providers-ws'),
HttpProvider: require('web3-providers-http'),
IpcProvider: require('web3-providers-ipc')
}
}
/**
* Asynchronously send batch request.
* Only works if provider supports batch methods through `sendAsync` or `send`.
* @method sendBatch
* @param {Array} data - array of payload objects
* @param {Function} callback
*/
RequestManager.prototype.sendBatch = function (data, callback) {
if (!this.provider) {
return callback(errors.InvalidProvider());
}

var payload = Jsonrpc.toBatchPayload(data);
this.provider[this.provider.sendAsync ? 'sendAsync' : 'send'](payload, function (err, results) {
if (err) {
return callback(err);
}

if (!_.isArray(results)) {
return callback(errors.InvalidResponse(results));
}

callback(null, results);
});
};


/**
* Waits for notifications
*
* @method addSubscription
* @param {Subscription} subscription         the subscription
* @param {String} type         the subscription namespace (eth, personal, etc)
* @param {Function} callback   the callback to call for incoming notifications
*/
RequestManager.prototype.addSubscription = function (subscription, callback) {
if (this.provider.on) {
this.subscriptions.set(
subscription.id,
{
callback: callback,
subscription: subscription
}
);
} else {
throw new Error('The provider doesn\'t support subscriptions: ' + this.provider.constructor.name);
}
};

/**
* Waits for notifications
*
* @method removeSubscription
* @param {String} id           the subscription id
* @param {Function} callback   fired once the subscription is removed
*/
RequestManager.prototype.removeSubscription = function (id, callback) {
if (this.subscriptions.has(id)) {
var type = this.subscriptions.get(id).subscription.options.type;

// remove subscription first to avoid reentry
this.subscriptions.delete(id);

// then, try to actually unsubscribe
this.send({
method: type + '_unsubscribe',
params: [id]
}, callback);

return;
}

if (typeof callback === 'function') {
// call the callback if the subscription was already removed
callback(null);
}
};

/**
* Should be called to reset the subscriptions
*
* @method reset
*
* @returns {boolean}
*/
RequestManager.prototype.clearSubscriptions = function (keepIsSyncing) {
try {
var this = this;

// uninstall all subscriptions
if (this.subscriptions.size > 0) {
this.subscriptions.forEach(function (value, id) {
if (!keepIsSyncing || value.name !== 'syncing')
this.removeSubscription(id);
});
}

//  reset notification callbacks etc.
if (this.provider.reset)
this.provider.reset();

return true
} catch (e) {
throw new Error(`Error while clearing subscriptions: ${e}`)
}
};

/**
* Evaluates WS close event
*
* @method _isCleanClose
*
* @param {CloseEvent | boolean} event WS close event or exception flag
*
* @returns {boolean}
*/
RequestManager.prototype._isCleanCloseEvent = function (event) {
return typeof event === 'object' && ([1000].includes(event.code) || event.wasClean === true);
};

/**
* Detects Ipc close error. The node.net module emits ('close', isException)
*
* @method _isIpcCloseError
*
* @param {CloseEvent | boolean} event WS close event or exception flag
*
* @returns {boolean}
*/
RequestManager.prototype._isIpcCloseError = function (event) {
return typeof event === 'boolean' && event;
};

/**
* The jsonrpc result callback for RequestManager.send
*
* @method _jsonrpcResultCallback
*
* @param {Function} callback the callback to use
* @param {Object} payload the jsonrpc payload
*
* @returns {Function} return callback of form (err, result)
*
*/
RequestManager.prototype._jsonrpcResultCallback = function (callback, payload) {
return function (err, result) {
if (result && result.id && payload.id !== result.id) {
return callback(new Error(`Wrong response id ${result.id} (expected: ${payload.id}) in ${JSON.stringify(payload)}`));
}

if (err) {
return callback(err);
}

if (result && result.error) {
return callback(errors.ErrorResponse(result));
}

if (!Jsonrpc.isValidResponse(result)) {
return callback(errors.InvalidResponse(result));
}

callback(null, result.result);
}
};

}

module.exports = {
Manager: RequestManager,
BatchManager: BatchManager
};
