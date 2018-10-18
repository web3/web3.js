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
 * @file CallMethodResponseDecoder.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

export default class CallMethodResponseDecoder {

    /**
     * @param {ABICoder} abiCoder
     *
     * @constructor
     */
    constructor(abiCoder) {
        this.abiCoder = abiCoder;
    }

    /**
     * Decodes the method response
     *
     * @method decode
     *
     * @param {Array} abiItemOutputTypes
     * @param {Object} response
     *
     * @returns {*}
     */
    decode(abiItemOutputTypes, response) {
        if (!response) {
            return null;
        }

        if (response.length >= 2) {
            response = response.slice(2);
        }

        const result = this.abiCoder.decodeParameters(abiItemOutputTypes, response);

        if (result.__length__ === 1) {
            return result[0];
        }

        return result;
    }
}
