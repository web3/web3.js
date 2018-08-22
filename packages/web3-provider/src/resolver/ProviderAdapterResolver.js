
var _ = require('underscore');
var HttpProviderAdapter = require('../adapters/HttpProviderAdapter');
var SocketProviderAdapter = require('../adapters/SocketProviderAdapter');
var InpageProviderAdapter = require('../adapters/InpageProviderAdapter');
var WebsocketProvider = require('web3-providers-ws');
var HttpProvider = require('web3-providers-http');
var IpcProvider = require('web3-providers-ipc');

function ProviderAdapterResolver() {}

ProviderAdapterResolver.prototype.resolve = function (provider, net) {

    if (typeof provider === 'string') {
        // HTTP
        if (/^http(s)?:\/\//i.test(provider)) {
            return new HttpProviderAdapter(new HttpProvider(provider));
        }
        // WS
        if (/^ws(s)?:\/\//i.test(provider)) {
            return new SocketProviderAdapter(new WebsocketProvider(provider));
        }

        // IPC
        if (provider && _.isObject(net) && _.isFunction(net.connect)) {
            return new SocketProviderAdapter(new IpcProvider(provider, net));
        }
    }

    if (provider.constructor.name === 'EthereumProvider') {
        return provider;
    }

    if (_.isFunction(provider.sendAsync)) {
        return new InpageProviderAdapter(provider);
    }
};

module.exports = ProviderAdapterResolver;
