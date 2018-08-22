/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file ProviderAdapterResolver.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var _ = require('underscore');
var HttpProviderAdapter = require('../adapters/HttpProviderAdapter');
var SocketProviderAdapter = require('../adapters/SocketProviderAdapter');
var InpageProviderAdapter = require('../adapters/InpageProviderAdapter');
var WebsocketProvider = require('web3-providers-ws');
var HttpProvider = require('web3-providers-http');
var IpcProvider = require('web3-providers-ipc');

var ProviderAdapterResolver = {};

ProviderAdapterResolver.resolve = function (provider, net) {

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
