
var JSONRpcMapper = require('./JSONRpcMapper.js');
var errors = require('web3-core-helpers').errors;

function AbstractProviderAdapter(provider) {
    this.provider = provider;
}

AbstractProviderAdapter.prototype.send = function (method, parameters) {
    var self = this;
    var payload = JSONRpcMapper.toPayload(method, parameters);

    return new Promise(function(resolve, reject) {
        self.provider.send(payload, function(error, response) {
            self.handleResponse(reject, resolve, error, response)
        });

    });
};

AbstractProviderAdapter.prototype.handleResponse = function (reject, resolve, error, response) {
    if (response && response.id && payload.id !== response.id) {
        reject(
            new Error('Wrong response id "'+ response.id +'" (expected: "'+ payload.id +'") in '+ JSON.stringify(payload))
        );

        return;
    }

    if (response && response.error) {
        reject(errors.ErrorResponse(response));
        return;
    }


    if(!JSONRpcMapper.isValidResponse(response.result)) {
        reject(errors.InvalidResponse(response));
        return;
    }

    if(!error) {
        resolve(response.result);
        return;
    }

    reject(error);
};

AbstractProviderAdapter.prototype = Object.create(EventEmitter.prototype);
AbstractProviderAdapter.prototype.constructor = AbstractProviderAdapter;
