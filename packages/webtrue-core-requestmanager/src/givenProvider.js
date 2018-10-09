/*
 This file is part of webtrue.js.

 webtrue.js is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 webtrue.js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with webtrue.js.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @file givenProvider.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

"use strict";

var givenProvider = null;

// ADD GIVEN PROVIDER
/* jshint ignore:start */
var global;
try {
  global = Function('return this')();
} catch (e) {
  global = window;
}

// EthereumProvider
if(typeof global.ethereumProvider !== 'undefined') {
    givenProvider = global.ethereumProvider;

// Legacy webtrue.currentProvider
} else if(typeof global.webtrue !== 'undefined' && global.webtrue.currentProvider) {

    if(global.webtrue.currentProvider.sendAsync) {
        global.webtrue.currentProvider.send = global.webtrue.currentProvider.sendAsync;
        delete global.webtrue.currentProvider.sendAsync;
    }

    // if connection is 'ipcProviderWrapper', add subscription support
    if(!global.webtrue.currentProvider.on &&
        global.webtrue.currentProvider.connection &&
        global.webtrue.currentProvider.connection.constructor.name === 'ipcProviderWrapper') {

        global.webtrue.currentProvider.on = function (type, callback) {

            if(typeof callback !== 'function')
                throw new Error('The second parameter callback must be a function.');

            switch(type){
                case 'data':
                    this.connection.on('data', function(data) {
                        var result = '';

                        data = data.toString();

                        try {
                            result = JSON.parse(data);
                        } catch(e) {
                            return callback(new Error('Couldn\'t parse response data'+ data));
                        }

                        // notification
                        if(!result.id && result.method.indexOf('_subscription') !== -1) {
                            callback(null, result);
                        }

                    });
                    break;

                default:
                    this.connection.on(type, callback);
                    break;
            }
        };
    }

    givenProvider = global.webtrue.currentProvider;
}
/* jshint ignore:end */


module.exports = givenProvider;
