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
 * @file index.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

"use strict";

const Core = require('web3-core');
var Method = require('web3-core-method');
var utils = require('web3-utils');
var Net = require('web3-net');

var formatters = require('web3-core-helpers').formatters;

const methods = require('./methods.js')

class Personal extends Core {
    constructor (...args) {
        super(...args)

        this.net = new Net(this);

        this._defaultAccount = null;
        this._defaultBlock = 'latest';

        this._mthods = methods.forEach((methodParam) => {

            if (methodParam.inputFormatter) {
                methodParam.inputFormatter = methodParam.inputFormatter.map((format) =>{
                    if (format === null) return null
                    return formatters[format];
                })
            }

            if (methodParam.outputFormatter) {
                methodParam.outputFormatter = utils[methodParam.outputFormatter]
            }

            const method = new Method(methodParam);
            method.attachToObject(this);
            method.setRequestManager(this._requestManager);
            method.defaultBlock = this.defaultBlock;
            method.defaultAccount = this.defaultAccount;
        });
    }

    get defaultAccount () {
        return this._defaultAccount
    }

    set defaultAccount (val) {
        if(val) {
            this._defaultAccount = utils.toChecksumAddress(formatters.inputAddressFormatter(val));
        }

        // update defaultBlock
        if (this._methods) {
            this._methods.forEach(function(method) {
                method.defaultAccount = defaultAccount;
            });
        }
        return val;
    }

    get defaultBlock () {
        return this._defaultBlock
    }

    set defaultBlock (val) {
        this._defaultBlock = val;

        // update defaultBlock
        if (this._methods) {
            this._methods.forEach(function(method) {
                method.defaultBlock = defaultBlock;
            });
        }
        return val;
    }
};

module.exports = Personal;


