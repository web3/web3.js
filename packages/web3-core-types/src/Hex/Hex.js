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
 * @file Hex.js
 * @author Oscar Fonseca <hiro@cehh.io>
 * @date 2019
 */

// import {toBigNumber} from '../BigNumber/BigNumber';
import {BigNumber} from 'web3-utils';
import {cloneDeep, isObject} from 'lodash';

export default class Hex {
    /**
     * @dev Wrap as object
     * @param {String} hex
     *
     * @constructor
     */
    constructor(params, error /* from factory */, initParams /* from factory */) {
        /* params are the values given to the contructor
         * this.props are the params fed via the constructor
         * after being filtered.
         * this.props start assigned to undefined via initParams */

        /* Set the errors */
        this.error = error;

        /* Set the inital values */
        this.initParams = initParams;

        /* Initialize the parameters */
        this.props = cloneDeep(initParams);

        /* Override constructor to only taking a string */
        if (!isObject(params)) {
            params = {
                hex: params
            };
        }

        /* Check for type and format validity */
        this.props.hex = Hex.isValid(params.hex) ? params.hex : undefined;

        /* Check for default, auto, none, etc. key values */
        if (params.hex === 'empty') this.props.hex = '0x';

        /* Throw if any parameter is still undefined */
        Object.keys(this.props).forEach((key) => {
            typeof this.props[key] === 'undefined' && this._throw(this.error[key], params[key]);
        });

        /* Make the props immutable */
        Object.freeze(params);
    }

    /* Class functions */
    /**
     * Check if the supplied string is a valid hex value
     *
     * @method isValid
     *
     * @param {string} parameter
     *
     * @return {boolean}
     */
    static isValid(hex) {
        return /^(-0x|0x)?[0-9a-f]*$/.test(hex);
    }

    /**
     * Check if the supplied string is hex with 0x prefix
     *
     * @method isStrict
     *
     * @param {string} hex
     *
     * @return {boolean}
     */
    static isStrict(hex) {
        return /^(-0x|0x)[0-9a-f]*$/.test(hex);
    }

    /* Instance accessors */
    /**
     * Parse the hex value to BigNumber
     *
     * @method toBigNumber
     *
     * @return {BigNumber}
     */
    toBigNumber() {
        return BigNumber.toBigNumber(this.props.hex);
    }

    /**
     * Parse the hex value to its numeric representation
     *
     * @method toNumberString
     *
     * @return {String}
     */
    toNumber() {
        return BigNumber.toBigNumber(this.props.hex).toNumber();
    }

    /**
     * Check if the supplied string is hex with 0x prefix
     *
     * @method isStrict
     *
     * @return {boolean}
     */
    isStrict() {
        return Hex.isStrict(this.props.hex);
    }

    /**
     * Override toString to print the hex prop
     *
     * @method toString
     *
     * @return {String}
     */
    toString() {
        // TODO return formatted?
        return this.props.hex;
    }

    /**
     * Declare the type of the object
     *
     * @method isHex
     *
     * @return {boolean}
     */
    isHex() {
        return true;
    }

    /**
     * Wrap error throwing from the constructor for types
     *
     * @method _throw
     */
    _throw(message, value) {
        throw message(value);
    }
}
