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


var requestManager = require('web3-requestManager');
var extend = require('./extend.js');

module.exports = {
    packageInit: function (pkg, args) {
        args = Array.prototype.slice.call(args);

        if (!pkg) {
            throw new Error('You need to instantiate using the "new" keyword.');
        }

        // if (!args[0]) {
        //     throw new Error('You must pass in a provider as argument!');
        // }

        // make write only property of pkg.provider
        Object.defineProperty(pkg, 'currentProvider', {
            get: function () {
                return pkg._provider;
            },
            set: function () {
                return pkg._provider;
            },
            enumerable: true
        });

        // inherit from web3 umbrella package
        if (args[0] && args[0]._requestManager) {
            pkg._requestManager = new requestManager.Manager(args[0].currentProvider);

        // set requestmanager on package
        } else {
            pkg._requestManager = new requestManager.Manager();
            pkg._requestManager.setProvider(args[0], args[1]);
        }

        // add givenProvider
        pkg.givenProvider = requestManager.Manager.givenProvider;
        pkg.providers = requestManager.Manager.providers;

         pkg._provider =  pkg._requestManager.provider;

        // add SETPROVIDER function
        pkg.setProvider = function (provider, net) {
            pkg._requestManager.setProvider(provider, net);
            pkg._provider = pkg._requestManager.provider;
            return true;
        };

        // attach batch request creation
        pkg.BatchRequest = requestManager.BatchManager.bind(null, pkg._requestManager);

        // attach extend function
        pkg.extend = extend(pkg);
    },
    addProviders: function (pkg) {
        pkg.givenProvider = requestManager.Manager.givenProvider;
        pkg.providers = requestManager.Manager.providers;
    }
};

