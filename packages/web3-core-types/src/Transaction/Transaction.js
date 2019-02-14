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
 * @file Transaction.js
 * @author Oscar Fonseca <hiro@cehh.io>
 * @date 2019
 */

import * as Types from '..';
import BigNumber, {isBigNumber} from "bignumber.js";
import {isNaN, isInteger, isString, omit, cloneDeep} from 'lodash';

export default class Transaction {
    /**
     * @dev Wrap as object
     * @param {Address|Number|String} from
     * @param {Address|"deploy"} to
     * @param {Number|BigNumber|String|"none"} value
     * @param {Number|"auto"} gas
     * @param {Number|BigNumber|String|"auto"} gasPrice
     * @param {String|"none"} data
     * @param {Number|"auto"} nonce
     *
     * @constructor
     */
    constructor(params, error /* from factory */, initParams /* from factory */) {
        this.error = error;
        this.initParams = initParams;
        this.props = cloneDeep(initParams);

        /* Check for type and format validity */

        /* Allow from an address string, Address object, or wallet index */
        if (params.from.isAddress) {
            this.props.from = Types.Address(params.from.props);
        } else if (isString(params.from) && Types.Address.isValid(params.from)) {
            this.props.from = Types.Address(params.from);
        } else if (isInteger(params.from)) {
            this.props.from = params.from;
        }

        /* Recipient address */
        this.props.to = params.to.isAddress ? Types.Address(params.to.props) : undefined;

        // TODO Move this check to BigNumber as a constructor check
        this.props.value =
            (!isNaN(params.value) && Number.isInteger(params.value) && params.value >= 0) ||
            isBigNumber(params.value) ||
            (typeof params.value === 'string' && /(\d)+/gm.test(params.value) && BigNumber(params.value))
                ? BigNumber(params.value.toString())
                : undefined;

        /* Transaction gas */
        this.props.gas = Number.isInteger(params.gas) ? params.gas : undefined;

        // TODO Move this check to BigNumber as a constructor check
        this.props.gasPrice =
            (!isNaN(params.gasPrice) && Number.isInteger(params.gasPrice) && params.gasPrice >= 0) ||
            isBigNumber(params.gasPrice) ||
            (typeof params.gasPrice === 'string' && BigNumber(params.gasPrice))
                ? BigNumber(params.gasPrice.toString())
                : undefined;

        /* Allow Hex object or valid hex string */
        if (params.data.isHex) {
            this.props.data = Types.Hex(params.data.props);
        } else if (Types.Hex.isValid(params.data)) {
            this.props.data = Types.Hex(params.data);
        }

        /* Transaction nonce */
        this.props.nonce = params.nonce === 0 || Number.isInteger(params.nonce) ? params.nonce : undefined;

        /* Chain ID */
        // TODO The transaction might not check this parameter
        this.props.chainId = isInteger(params.chainId) ? params.chainId.toString() : undefined;

        /* Set the default values */
        if (params.value === 'none') this.props.value = BigNumber(0);

        if (params.gas === 'auto') this.props.gas = params.gas; // this.props = omit(this.props, 'gas');

        if (params.gasPrice === 'auto') this.props.gasPrice = params.gasPrice; // this.props.gasPrice = omit(this.props, 'gasPrice');

        if (params.data === 'none') this.props.data = Types.Hex('empty');

        if (params.nonce === 'auto') this.props.nonce = params.nonce; // this.props.nonce = omit(this.props, 'nonce');

        if (/main/i.test(params.chainId)) this.props.chainId = '1';

        /* Allow empty 'to' field if code is being deployed */
        if (params.to === 'deploy') this.props = omit(this.props, 'to');

        /* Throw if any parameter is still undefined */
        Object.keys(this.props).forEach((key) => {
            typeof this.props[key] === 'undefined' && this._throw(this.error[key], params[key]);
        });

        /* Make the props immutable */
        Object.freeze(this.props);
    }

    /**
     * Gets the gas property
     *
     * @property gas
     *
     * @returns {String} gas
     */
    get gas() {
        return ((v) => (v ? v.toString() : undefined))(this.props.gas);
    }

    /**
     * Gets the gasPrice property
     *
     * @property gasPrice
     *
     * @returns {String} gasPrice
     */
    get gasPrice() {
        return ((v) => (v ? v.toString() : undefined))(this.props.gasPrice);
    }

    /**
     * Gets the to property
     *
     * @property to
     *
     * @returns {String} to
     */
    get to() {
        return ((v) => (v ? v.toString() : undefined))(this.props.to);
    }

    /**
     * Gets the from property
     *
     * @property from
     *
     * @returns {String} from
     */
    get from() {
        return ((v) => (v ? v.toString() : undefined))(this.props.from);
    }

    /**
     * Gets the value property
     *
     * @property value
     *
     * @returns {String} value
     */
    get value() {
        return ((v) => (v ? v.toString() : undefined))(this.props.value);
    }

    /**
     * Gets the data property
     *
     * @property data
     *
     * @returns {String} data
     */
    get data() {
        return ((v) => (v ? v.toString() : undefined))(this.props.data);
    }

    /**
     * Gets the nonce property
     *
     * @property nonce
     *
     * @returns {Number} nonce
     */
    get nonce() {
        return ((v) => (isInteger(v) ? parseInt(v) : undefined))(this.props.nonce);
    }

    /**
     * Gets the chainId property
     *
     * @property chainId
     *
     * @returns {String} chainId
     */
    get chainId() {
        return ((v) => (v ? v.toString() : undefined))(this.props.chainId);
    }

    /**
     * Check if the transaction has valid content
     *
     * @method isValid
     *
     * @return {boolean|Error}
     *
     */
    isValid() {}

    /**
     * Sign the transaction object.
     *  TODO Patch the account parameter
     *  with the web3-eth-personal module
     *  skipping the inputTransactionFormatter
     *  and passing the this or account reference.
     *
     * @method sign
     *
     * @param {Object}
     *
     * @return {SignedTransaction}
     *
     */
    sign(account) {
        const params = cloneDeep(this.props);
        if (params.from.isAddress) params.from = params.from.toString();
        if (params.to.isAddress) params.to = params.to.toString();

        const unsignedTx = Object.keys(params).forEach(
            (key) => (params[key] = params[key] === 'auto' ? undefined : params[key])
        );

        return account.sign(unsignedTx);
    }

    /**
     * Override toString to print the transaction object
     *
     * @method toString
     *
     * @return {String}
     */
    toString() {
        return this.props.toString();
    }

    /**
     * Declare the type of the object
     *
     * @method isTransaction
     *
     * @return {boolean}
     */
    isTransaction() {
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
