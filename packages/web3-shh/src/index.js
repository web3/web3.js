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
const subscriptionMethods = require('./subscription-methods.js')
const Subscriptions = require('web3-core-subscriptions').subscriptions;
const Method = require('web3-core-method');
// const formatters = require('web3-core-helpers').formatters;
const Net = require('web3-net');


class Shh extends Core {
    constructor (...args) {
        super(...args)
        // sets _requestmanager

        // overwrite package setRequestManager
        var setRequestManager = this.setRequestManager;
        this.setRequestManager = function (manager) {
            setRequestManager(manager);

            this.net.setRequestManager(manager);

            return true;
        };

        // overwrite setProvider
        var setProvider = this.setProvider;
        this.setProvider = function () {
            setProvider.apply(this, arguments);

            this.setRequestManager(this._requestManager);
        };

        this.net = new Net(this);

        [new Subscriptions({
                name: 'subscribe',
                type: 'shh',
                subscriptions: {
                    'messages': {
                        params: 1
                        // inputFormatter: [formatters.inputPostFormatter],
                        // outputFormatter: formatters.outputPostFormatter
                    }
                }
            }),
        ].concat(subscriptionMethods.map((method) => new Method(method))).forEach((method) => {
            method.attachToObject(this);
            method.setRequestManager(this._requestManager);
        });
    }


    clearSubscriptions () {
         this._requestManager.clearSubscriptions();
    }
};

module.exports = Shh;


