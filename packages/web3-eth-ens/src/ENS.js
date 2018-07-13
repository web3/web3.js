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
 * @file ENS.js
 *
 * @author Samuel Furter <sam@tokenate.io>
 * @date 2018
 */

"use strict";

var config = require('./config');
var Registry = require('./contracts/Registry');

/**
 * varructs a new instance of ENS
 *
 * @method ENS
 * @param {Object} eth
 * @varructor
 */
function ENS(eth) {
    this.eth = eth;
}

Object.defineProperty(ENS.prototype, 'registry', {
    get: function(){
        return new Registry(this);
    },
    enumerable: true
});

/**
 * Returns the address record associated with a name.
 *
 * @method getAddress
 * @param {string} name
 * @return {Promise<string>} a promise
 */
ENS.prototype.getAddress = function (name) {
    return this.registry.resolver(name).then(function(resolver) {
        return resolver.addr();
    }).catch(function(error) {
        throw error;
    });
};

/**
 * Sets a new address
 *
 * @param {string} name
 * @param {string} address
 * @returns {Promise<Transaction>}
 */
ENS.prototype.setAddress = function (name, address) {
    return this.registry.resolver(name).then(function(resolver) {
        return resolver.setAddr(address).send();
    }).catch(function(error) {
        throw error;
    });
};

/**
 * Returns the public key
 *
 * @param {string} name
 * @returns {Promise<T>}
 */
ENS.prototype.getPubkey = function(name) {
  return this.registry.resolver(name).then(function(resolver) {
      return resolver.pubkey();
  }).catch(function(error) {
      throw error;
  });
};

/**
 * Set the new public key
 *
 * @param {string} name
 * @param {string} x
 * @param {string} y
 * @returns {Promise<Transaction>}
 */
ENS.prototype.setPubkey = function(name, x, y) {
  return this.registry.resolver(name).then(function(resolver) {
      return resolver.setPubkey(x, y).send();
  }).catch(function(error) {
      throw error;
  });
};

/**
 * Returns the content
 *
 * @param {string} name
 * @returns {Promise<T>}
 */
ENS.prototype.getContent = function(name) {
    return this.registry.resolver(name).then(function(resolver) {
        return resolver.content();
    }).catch(function(error) {
        throw error;
    });
};

/**
 * Sets the new content
 *
 * @param {string} name
 * @param {string} hash
 * @returns {Promise<Transaction>}
 */
ENS.prototype.setContent = function(name, hash) {
  return this.registry.resolver(name).then(function(resolver) {
      return resolver.setContent(hash);
  }).catch(function(error) {
      throw error;
  });
};

/**
 * Checks if the current used network is synced and looks for ENS support there.
 * Throws an error if not.
 *
 * @returns {Promise<Block>}
 */
ENS.prototype.checkNetwork = function () {
    var self = this;
    return self.eth.getBlock('latest').then(function (block) {
        var headAge = new Date() / 1000 - block.timestamp;
        if (headAge > 3600) {
            throw new Error("Network not synced; last block was " + headAge + " seconds ago");
        }
        return self.eth.net.getNetworkType();
    }).then(function (networkType) {
        var addr = config.addresses[networkType];
        if (typeof addr === 'undefined') {
            throw new Error("ENS is not supported on network " + networkType);
        }

        return addr;
    }).catch(function (err) {
        throw err;
    });
};

module.exports = ENS;
