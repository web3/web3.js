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
 * @file CRUX.js
 *
 * @author Yadunandan Batchu <nandubatchu@gmail.com>
 * @date 2020
 */

"use strict";

var cruxSDK = require('@cruxpay/js-sdk');

/**
 * Constructs a new instance of CRUX
 *
 * @method CRUX
 * @constructor
 */
function CRUX() {}

/**
 * @param {string} name
 * @returns {Promise<string>}
 */
CRUX.prototype.resolver = async function (name, currency = "eth") {
    const sampleAssetMapping = {
        "btc": "d78c26f8-7c13-4909-bf62-57d7623f8ee8",
        "eth": "4e4d9982-3469-421b-ab60-2c0c2f05386a",
    };
    // currently only resolves ethereum and bitcoin addresses (ethereum by default);
    const asset = cruxSDK.CruxSpec.globalAssetList.find((a) => a.assetId === sampleAssetMapping[currency]);
    if (asset) {
        const cruxUserRepository = new cruxSDK.BlockstackCruxUserRepository({
            cacheStorage: new cruxSDK.InMemStorage(),
            blockstackInfrastructure: cruxSDK.CruxSpec.blockstack.infrastructure,
        });
        const cruxUser = await cruxUserRepository.getByCruxId(cruxSDK.CruxId.fromString(name));
        if (cruxUser) {
            const address = cruxUser.getAddressFromAsset(asset.assetId);
            if (address) {
                return address.addressHash;
            }
        }
    }
    return;
}

module.exports = CRUX;