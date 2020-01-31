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
 * @file config.js
 *
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2017
 */

"use strict";

/**
 * Source: https://docs.ens.domains/ens-deployments
 *
 * @type {{addresses: {main: string, rinkeby: string, goerli: string, ropsten: string}}}
 */
var config = {
    addresses: {
        main: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        ropsten: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        rinkeby: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        goerli: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
    },
};

module.exports = config;
