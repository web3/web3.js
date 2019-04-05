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
import {isNaN, isInteger, isString, isNil, assign} from 'lodash';

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

        assign(this, params);

        if (isInteger(params.chainId)) {
            this.props.chainId = params.chainId.toString();
        }

        if (/main/i.test(params.chainId)) {
            this.props.chainId = '1';
        }

        /* Make the props immutable */
        Object.freeze(this.props);
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
            throw new Error(`The given "from" parameter "${param}" needs to be an address string, an Address object, or a wallet index number.`);
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
        return ((v) => (!isNil(v) ? v.toString() : undefined))(this.props.from);
    }

    /**
     * Set the to property
     *
     * @property to 
     */
    set to(param) {
        let _to;

        if (param.isAddress || param === 'deploy') {
            _to = param;
        }

        if (isString(param) && Types.Address.isValid(param)) {
            _to = new Types.Address(param);
        }

        if(_to === undefined) {
            throw new Error(`The given "to" parameter "${param}" needs to be an address or 'deploy' when deploying code.\n`);
        } else {
            this.props.to = _to;
        }
    }

    /**
     * Gets the to property. Returns undefined for 'deploy'
     *
     * @property to
     *
     * @returns {String} to
     */
    get to() {
        return ((v) => (!isNil(v) && v !== 'deploy' ? v.toString() : undefined))(this.props.to);
    }

    /**
     * Set the value property
     *
     * @property value
     */
    set value(param) {
        let _value;

        if (
            (!isNaN(param) && Number.isInteger(param) && param >= 0) ||
            isBigNumber(param) ||
            (typeof param === 'string' && /(\d)+/gm.test(param) && BigNumber(param))
        ) {
            _value = BigNumber(param.toString());
        }
        
        if (param === undefined || param === 'none') {
            _value = BigNumber(0);
        }

        if(_value === undefined) {
            throw new Error(`The given "value" parameter "${param}" needs to be zero or positive, and in number, BigNumber or string format.\n` +
                'Use "none" to add 0 ether to the transaction.');
        } else {
            this.props.value = _value;
        }
    }

    /**
     * Gets the value property
     *
     * @property value
     *
     * @returns {String} value
     */
    get value() {
        return ((v) => (!isNil(v) ? v.toString() : undefined))(this.props.value);
    }
    
    /**
     * Set the gas property
     *
     * @property gas
     */
    set gas(param) {
        let _gas;

        if (Number.isInteger(param)) {
            _gas = param;
        }
        
        if (param === undefined || param === 'auto') {
            _gas = 'auto';
        }

        if(_gas === undefined) {
            throw new Error(`The given "gas" parameter "${param}" needs to be an integer.\n` +
                'Use "auto" to set the gas the node calculates.');
        } else {
            this.props.gas = _gas;
        }
    }

    /**
     * Gets the gas property
     *
     * @property gas
     *
     * @returns {String} gas
     */
    get gas() {
        return ((v) => (!isNil(v) && v !== 'auto' ? v.toString() : undefined))(this.props.gas);
    }
    
    /**
     * Set the gasPrice property
     *
     * @property gasPrice
     */
    set gasPrice(param) {
        let _gasPrice;

        if (
            (!isNaN(param) && Number.isInteger(param) && param >= 0) ||
            isBigNumber(param) ||
            (typeof param === 'string' && BigNumber(param))
        ) {
            _gasPrice = BigNumber(param.toString());
        }
        
        if (param === undefined || param === 'auto') {
            _gasPrice = 'auto';
        }

        if(_gasPrice === undefined) {
            throw new Error(`The given "gasPrice" parameter "${param}" needs to be zero or positive, and in number, BigNumber or string format.\n` +
                'Use "auto" to set the gas price the node calculates.');
        } else {
            this.props.gasPrice = _gasPrice;
        }
    }


    /**
     * Gets the gasPrice property
     *
     * @property gasPrice
     *
     * @returns {String} gasPrice
     */
    get gasPrice() {
        return ((v) => (!isNil(v) && v !== 'auto' ? v.toString() : undefined))(this.props.gasPrice);
    }

    
    /**
     * Set the data property
     *
     * @property data 
     */
    set data(param) {
        let _data;

        if (param.isHex) {
            _data = param;
        } else if (Types.Hex.isValid(param)) {
            _data = new Types.Hex(param);
        }

        if (param === undefined || param === 'none') {
            _data = new Types.Hex('empty');
        }

        if(_data === undefined) {
            throw new Error(`The given "data" parameter "${param}" needs to be hex encoded or class Hex.\n` +
                "Use 'none' for no payload.");
        } else {
            this.props.data = _data;
        }
    }

    /**
     * Gets the data property
     *
     * @property data
     *
     * @returns {String} data
     */
    get data() {
        return ((v) => (!isNil(v) ? v.toString() : undefined))(this.props.data);
    }
    
    /**
     * Set the nonce property
     *
     * @property nonce 
     */
    set nonce(param) {
        let _nonce;
        
        if (param === 0 || Number.isInteger(param)) {
            _nonce = param;
        }
        
        if (param === undefined || param === 'auto') {
            _nonce = 'auto';
        }

        if(_nonce === undefined) {
            throw new Error(`The given "nonce" parameter "${param}" needs to be an integer.\n` +
                "Use 'auto' to set the RPC-calculated nonce.");
        } else {
            this.props.nonce = _nonce;
        }
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
}
