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
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var config = require('./config');
var Registry = require('./contracts/Registry');

/**
 * Constructs a new instance of ENS
 *
 * @method ENS
 * @param {Object} eth
 * @constructor
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
    });
};

/**
 * Sets a new address
 *
 * @method setAddress
 * @param {string} name
 * @param {string} address
 * @param {string} from
 * @returns {Promise<Transaction>}
 */
ENS.prototype.setAddress = function (name, address, from) {
    return this.registry.resolver(name).then(function(resolver) {
        return resolver.setAddr(address, from);
    });
};

/**
 * Returns the public key
 *
 * @method getPubkey
 * @param {string} name
 * @returns {Promise<any>}
 */
ENS.prototype.getPubkey = function (name) {
  return this.registry.resolver(name).then(function(resolver) {
      return resolver.pubkey();
  });
};

/**
 * Set the new public key
 *
 * @method setPubkey
 * @param {string} name
 * @param {string} x
 * @param {string} y
 * @param {string} from
 * @returns {Promise<Transaction>}
 */
ENS.prototype.setPubkey = function (name, x, y, from) {
  return this.registry.resolver(name).then(function(resolver) {
      return resolver.setPubkey(x, y, from);
  });
};

/**
 * Returns the content
 *
 * @method getContent
 * @param {string} name
 * @returns {Promise<any>}
 */
ENS.prototype.getContent = function (name) {
    return this.registry.resolver(name).then(function(resolver) {
        return resolver.content();
    });
};

/**
 * Set the content
 *
 * @method setContent
 * @param {string} name
 * @param {string} hash
 * @param {string} from
 * @returns {Promise<Transaction>}
 */
ENS.prototype.setContent = function (name, hash, from) {
  return this.registry.resolver(name).then(function(resolver) {
      return resolver.setContent(hash, from);
  });
};

/**
 * Get the multihash
 *
 * @method getMultihash
 * @param {string} name
 * @returns {Promise<any>}
 */
ENS.prototype.getMultihash = function (name) {
    return this.registry.resolver(name).then(function (resolver) {
        return resolver.multihash();
    });
};

/**
 * Set the multihash
 *
 * @method setMultihash
 * @param {string} name
 * @param {string} hash
 * @param {string} from
 * @returns {Promise<Transaction>}
 */
ENS.prototype.setMultihash = function (name, hash, from) {
  return this.registry.resolver(name).then(function (resolver) {
      return resolver.setMultihash(hash, from);
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
    });
};

module.exports = ENS;
