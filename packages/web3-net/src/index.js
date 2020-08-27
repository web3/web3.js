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
const Method = require('web3-core-method');
const utils = require('web3-utils');
const methods = require('./methods');

class Net extends Core {
    constructor (...args) {
        super(...args)
        methods.forEach((methodOps) => {
            if (methodOps.outputFormatter && typeof methodOps.outputFormatter === 'string') {
                methodOps.outputFormatter = utils[methodOps.outputFormatter]
            }
            const method = new Method(methodOps)
            method.attachToObject(this);
            method.setRequestManager(this._requestManager);
        });
    }
};

module.exports = Net;


