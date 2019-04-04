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
import BigNumber, {isBigNumber} from 'bignumber.js';
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
    constructor(params) {
        const requires = ['from', 'to', 'value', 'gas', 'gasPrice', 'data', 'nonce'];

        this.props = {};

        this.from = params.from;

        /* Recipient address */
        if (params.to.isAddress) {
            this.props.to = new Types.Address(params.to.props);
        }

        // TODO Move this check to BigNumber as a constructor check
        if (
            (!isNaN(params.value) && Number.isInteger(params.value) && params.value >= 0) ||
            isBigNumber(params.value) ||
            (typeof params.value === 'string' && /(\d)+/gm.test(params.value) && BigNumber(params.value))
        ) {
            this.props.value = BigNumber(params.value.toString());
        }

        /* Transaction gas */
        if (Number.isInteger(params.gas)) {
            this.props.gas = params.gas;
        }

        // TODO Move this check to BigNumber as a constructor check
        if (
            (!isNaN(params.gasPrice) && Number.isInteger(params.gasPrice) && params.gasPrice >= 0) ||
            isBigNumber(params.gasPrice) ||
            (typeof params.gasPrice === 'string' && BigNumber(params.gasPrice))
        ) {
            this.props.gasPrice = BigNumber(params.gasPrice.toString());
        }

        if (params.data.isHex) {
            this.props.data = params.data;
        } else if (Types.Hex.isValid(params.data)) {
            this.props.data = new Types.Hex(params.data);
        }

        /* Transaction nonce */
        if (params.nonce === 0 || Number.isInteger(params.nonce)) {
            this.props.nonce = params.nonce;
        }

        /* Chain ID */
        // TODO The transaction might not check this parameter
        if (isInteger(params.chainId)) {
            this.props.chainId = params.chainId.toString();
        }

        /* Set the default values */
        if (this.props.value === undefined) {
            this.props.value = BigNumber(0);
        }

        if (this.props.gas === undefined) {
            this.props.gas = 'auto';
        }

        if (this.props.gasPrice === undefined) {
            this.props.gasPrice = 'auto';
        }

        if (this.props.data === undefined) {
            this.props.data = new Types.Hex('empty');
        }

        if (this.props.nonce === undefined) {
            this.props.nonce = 'auto';
        }

        if (/main/i.test(params.chainId)) {
            this.props.chainId = '1';
        }

        if (params.to === 'deploy') {
            this.props.to = params.to;
        }

        requires.forEach((propertyName) => {
            if (typeof this.props[propertyName] === 'undefined') {
                this._throw(propertyName, params[propertyName]);
            }
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
        return ((v) => (v && v !== 'auto' ? v.toString() : undefined))(this.props.gas);
    }

    /**
     * Gets the gasPrice property
     *
     * @property gasPrice
     *
     * @returns {String} gasPrice
     */
    get gasPrice() {
        return ((v) => (v && v !== 'auto' ? v.toString() : undefined))(this.props.gasPrice);
    }

    /**
     * Gets the to property. Returns undefined for 'deploy'
     *
     * @property to
     *
     * @returns {String} to
     */
    get to() {
        return ((v) => (v && v !== 'deploy' ? v.toString() : undefined))(this.props.to);
    }
    
    /**
     * Set the from property
     *
     * @property from
     */
    set from(param) {
        let _from;

        if (param.isAddress || isInteger(param)) {
            _from = param;
        }

        if (isString(param) && Types.Address.isValid(param)) {
            _from = new Types.Address(param);
        }
        
        if(_from === undefined) {
            throw new Error(`The given "from" parameter "${value}" needs to be an address string, an Address object, or a wallet index number.`);
        } else {
            this.props.from = _from;
        }
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
        return ((v) => (v && v !== 'auto' ? v.toString() : undefined))(this.props.value);
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
    _throw(propertyName, value) {
        let errorMessage;

        if (propertyName === 'to') {
            errorMessage = `The given "to" parameter "${value}" needs to be an address or 'deploy' when deploying code.\n`;
        }

        if (propertyName === 'value') {
            errorMessage =
                `The given "value" parameter "${value}" needs to be zero or positive, and in number, BigNumber or string format.\n` +
                'Use "none" to add 0 ether to the transaction.';
        }

        if (propertyName === 'data') {
            errorMessage =
                `The given "data" parameter "${value}" needs to be hex encoded or class Hex.\n` +
                "Use 'none' for no payload.";
        }

        if (propertyName === 'nonce') {
            errorMessage =
                `The given "nonce" parameter "${value}" needs to be an integer.\n` +
                "Use 'auto' to set the RPC-calculated nonce.";
        }

        if (propertyName === 'chainId') {
            errorMessage =
                `The given "chainId" parameter "${value}" needs to be an integer.\n` +
                "Use 'main' to set the mainnet chain ID.";
        }

        throw new Error(errorMessage);
    }
}
