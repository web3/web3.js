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

const { Manager, BatchManager } = require("web3-core-requestmanager");
const extend = require("./extend");






class Core {
  constructor (...args) {
    // sets _requestmanager etc
    if (args[0] && args[0]._requestManager) {
        this._requestManager = args[0]._requestManager;
    } else {
        this._requestManager = new Manager(args[0], args[1]);
    }

    // add givenProvider
    this.givenProvider = Manager.givenProvider;
    this.providers = Manager.providers;

    this._provider = this._requestManager.provider;

    // attach batch request creation
    this.BatchRequest = BatchManager.bind(null, this._requestManager);

    // attach extend function
    this.extend = extend(this);
  }

  setRequestManager (manager) {
    this._requestManager = manager;
    this._provider = manager.provider;
  }

  set curentProvider (newProvider) {
    return this.setProvider(newProvider);
  }

  get curentProvider () {
    return this._provider;
  }

  static get providers () {
    return Manager.providers
  }

  static get givenProvider () {
    return Manager.givenProvider
  }

  setProvider (provider, net) {
    this._requestManager.setProvider(provider, net);
    this._provider = this._requestManager.provider;
    this.extend = extend(this);
    return true;
  }

  addProviders () {
    this.givenProvider = Manager.givenProvider;
    this.providers = Manager.providers;
  }

  static addProviders (pkg) {
    pkg.givenProvider = Manager.givenProvider;
    pkg.providers = Manager.providers;
  }

  static packageInit (pkg, args) {
    args = Array.prototype.slice.call(args);

    if (!pkg) {
        throw new Error('You need to instantiate using the "new" keyword.');
    }

    // make property of pkg._provider, which can properly set providers
    Object.defineProperty(pkg, 'currentProvider', {
        get: () => {
            return pkg._provider;
        },
        set: (value) => {
            return pkg.setProvider(value);
        },
        enumerable: true,
        configurable: true
    });

    // inherit from parent package or create a new RequestManager
    if (args[0] && args[0]._requestManager) {
        pkg._requestManager = args[0]._requestManager;
    } else {
        pkg._requestManager = new Manager(args[0], args[1]);
    }

    // add givenProvider
    pkg.givenProvider = Manager.givenProvider;
    pkg.providers = Manager.providers;

    pkg._provider = pkg._requestManager.provider;

    // add SETPROVIDER function (don't overwrite if already existing)
    if (!pkg.setProvider) {
        pkg.setProvider = (provider, net) => {
            pkg._requestManager.setProvider(provider, net);
            pkg._provider = pkg._requestManager.provider;
            return true;
        };
    }

    pkg.setRequestManager = (manager) => {
        pkg._requestManager = manager;
        pkg._provider = manager.provider;
    };

    // attach batch request creation
    pkg.BatchRequest = BatchManager.bind(null, pkg._requestManager);

    // attach extend function
    pkg.extend = extend(pkg);
  }



}

module.exports = Core
